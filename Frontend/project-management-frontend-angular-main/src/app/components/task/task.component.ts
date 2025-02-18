import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasks: any;
  // loading: boolean = false;
  taskToDeleteId!: number;
  taskToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(){
    this.isLoading = true;
    return this.taskService.Task(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.tasks = res.tasks.data;
        this.totalPages = res.tasks.last_page;
        this.totalItems = res.tasks.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.tasks = []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
        this.isLoading = false;
      }
    )
  }

  search() {
    this.getTask();
  }

  setTaskToDelete(taskId: number, taskName: string) {
    this.taskToDeleteId = taskId;
    this.taskToDeleteName = taskName;
  }

  deleteCategory(){
    this.taskService.deleteTask(this.taskToDeleteId).subscribe(res=>{
      this.getTask();
      document.getElementById('exampleModal-2')?.click();
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getTask();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getTask();
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }  

  calculateFirstItemIndex(): number {
    return (this.currentPage - 1) * this.perPage + 1;
  }
  
  calculateLastItemIndex(): number {
    const lastItem = this.currentPage * this.perPage;
    return lastItem > this.totalItems ? this.totalItems : lastItem;
  }

}
