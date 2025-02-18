import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.interface';
import { Todo } from 'src/app/models/todo.interface';
import { StatusPipe } from 'src/app/pipes/status.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [
    StatusPipe
],
})
export class TodoComponent implements OnInit {

  todos: Todo[] = [];
  employees: Employee[] = []
  errorMessage: string | undefined;
  featureId!: number;
  selectedStatus: string = '';
  selectedPriority: string = '';
  statuses = ['pending', 'completed', 'processing', 'planning', 'done', 'hold', 'recheck', 'not_to_do'];

  editableColumns: Map<number, Map<string, boolean>> = new Map();

  newTodo: Todo = {
    id: 0,
    name: '',
    project_id: 0,
    feature_id: 0,
    member_id: [],
    members: '',
    status: 'pending',
    priority: 'medium',
    start_date: '',
    end_date: '',
    description: '',
    users: [{ 
      id: 0,
      name: '',
      email: '',
      email_verified_at: '',
      image: '',
      created_at: '',
      updated_at: '',
    }],
    member: [{
      id: 0,
    }]
  };

  baseUrl: string = 'http://127.0.0.1:8000/storage/users/';

  @ViewChild('form', { static: false }) form!: NgForm;
  taskDetail: any;
  featureName!: string; 
  searchKeyword: string = '';
  selectedUsers: any[] = [];
  tempSelectedUsers: any[] = [];

  constructor(private todoService: TodoService, private route: ActivatedRoute, private employee: EmployeeService, private statusPipe: StatusPipe, private router:Router, private authService: AuthService, private sharedService: SharedService, private toastr: ToastrService, private sidebarService: SidebarService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.featureId = params['featureId'];
      this.getTasks(this.featureId);
      this.getEmployeeListByFeatureId(this.featureId);
      this.sharedService.currentFeatureName.subscribe(featureName => this.featureName = featureName);
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  getTasks(featureId: number) {
    this.todoService.getTasksByFeature(featureId, this.selectedPriority, this.selectedStatus).subscribe(
      (res: any) => { 
        console.log(res);
        this.todos = res.tasks;
        this.errorMessage = undefined;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.todos = []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
      }
    );
  }

  filterTasks() {
    this.getTasks(this.featureId); 
  }

  getEmployeeListByFeatureId(featureId: number): void {
    this.employee.getEmployeesByFeatureIds(featureId, this.searchKeyword).subscribe((res) => {
      this.employees = res.members;
    });
  }

  search() {
    this.getEmployeeListByFeatureId(this.featureId);
  }

  addUserToTempTeam(member: any) {
    if (!this.tempSelectedUsers.some(user => user.id === member.id)) {
      this.tempSelectedUsers.push(member);
    }
  }

  isUserInTempTeam(member: any): boolean {
    return this.tempSelectedUsers.some(user => user.id === member.id);
  }

  removeUserFromTempTeam(member: any) {
    this.tempSelectedUsers = this.tempSelectedUsers.filter(user => user.id !== member.id);
  }

  inviteUsers() {
    this.tempSelectedUsers.forEach(member => {
      if (!this.selectedUsers.some(user => user.id === member.id)) {
        this.selectedUsers.push(member);
        this.newTodo.member_id.push(member.id);
      }
    });
    this.tempSelectedUsers = [];
  }

  editColumn(todo: Todo, columnName: string) {
    if (!this.editableColumns.has(todo.id)) {
        this.editableColumns.set(todo.id, new Map<string, boolean>());
    }
    const taskEditableColumns = this.editableColumns.get(todo.id)!;
    taskEditableColumns.set(columnName, true);
  }

  isColumnEditable(todoId: number, column: string): boolean {
    if (!this.editableColumns.has(todoId)) {
        return false;
    }
    const taskEditableColumns = this.editableColumns.get(todoId)!;
    return taskEditableColumns.get(column) || false;
  }

  saveColumn(todo: Todo, columnName: string) {
    // Ensure user_ids are included in the payload
    let payload: Partial<Todo>;
  
    if (columnName === 'user_ids') {
      payload = {
        ...(todo.id && { id: todo.id }), // Ensure id is included if it's defined
        member_id: todo.member_id,
        name: todo.name,
        status: todo.status,
        feature_id: todo.feature_id,
        description: todo.description,
        end_date: todo.end_date,
        priority: todo.priority,
        start_date: todo.start_date
      };
    } else {
      payload = {
        ...(todo.id && { id: todo.id }), // Ensure id is included if it's defined
        ...todo,
        member_id: todo.members ? todo.members.map((member: Employee) => member.id) : [], // Specify type of 'member' as 'Employee'
      };
    }
  
    this.todoService.updateTodo(todo.id, payload as Todo).subscribe(
      (res: any) => {
        console.log('Task updated successfully:', res);
        const taskEditableColumns = this.editableColumns.get(todo.id)!;
        taskEditableColumns.set(columnName, false);
  
        this.todoService.getTodoById(todo.id).subscribe(
          (updatedTodo: Todo) => {
            const index = this.todos.findIndex(t => t.id === updatedTodo.id);
            if (index !== -1) {
              this.todos[index] = updatedTodo;
            }
          },
          error => {
            console.error('Error fetching updated task:', error);
          }
        );
      },
      error => {
        console.error('Error updating task:', error);
      }
    );
  }

  addTask() {
    this.newTodo.feature_id = this.featureId;
    this.todoService.addTodo(this.newTodo).subscribe({
      next: (res) => {
        this.toastr.success('Task added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.getTasks(this.featureId);
        this.form.resetForm();
        this.sidebarService.triggerReload();
        this.newTodo = {
          id: 0,
          name: '',
          project_id: 0,
          feature_id: this.featureId,
          member_id: [],
          members: '',
          status: 'pending',
          priority: 'medium',
          start_date: '',
          end_date: '',
          description: '',
          users: [],
          member: []
        };
        this.selectedUsers = [];
        this.tempSelectedUsers = [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          // Extract and display validation error messages
          for (const key in err.error.message) {
            if (err.error.message.hasOwnProperty(key)) {
              err.error.message[key].forEach((message: string) => {
                this.toastr.error(message, 'Validation Error', {
                  timeOut: 4000,
                  progressBar: true
                });
              });
            }
          }
        } else {
          this.toastr.error('Error adding task: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding task:', err);
      }
    });
  }
  
  showTaskDetail(taskId: number): void {
    this.todoService.showTodo(taskId).subscribe(
      (res) => {
        this.taskDetail = res.task;
      },
      (error) => {
        console.error('Error fetching task details:', error);
      }
    );
  }

  // Add this method to update only user_ids
  updateUserIds(taskId: number) {
    const userIds = this.selectedUsers.map(user => user.id);
    this.todoService.updateUserIds(taskId, { member_id : userIds }).subscribe(
      (res: any) => {
        console.log('User IDs updated successfully:', res);
        this.showTaskDetail(taskId); // Refresh task details
        this.getTasks(this.featureId);
        this.selectedUsers = [];
      },
      (error: any) => {
        console.error('Error updating user IDs:', error);
      }
    );
  }

  // Add user to the selected users list
  addUserToSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIds = Array.from(selectElement.selectedOptions).map(option => +option.value);
    this.selectedUsers = this.employees.filter(employee => selectedIds.includes(employee.id));
    this.selectedUsers = [];
  }
  
  // Remove user from the selected users list
  removeUserFromSelected(userId: number) {
    this.selectedUsers = this.selectedUsers.filter(user => user.id !== userId);
  }

}
