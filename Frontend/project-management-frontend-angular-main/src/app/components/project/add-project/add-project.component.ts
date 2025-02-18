import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project.interface';
import { AdminService } from 'src/app/services/admin.service';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MemberService } from 'src/app/services/member.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  selectedImageSrc: string = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg';
  newProject: Project = new Project();
  files: File | null = null; // To store the selected file
  admins: any;
  clients: any;
  members: any;
  selectedUsers: any[] = [];
  tempSelectedUsers: any[] = []; // Temporary selection in the modal
  searchKeyword: string = '';

  constructor(private project: ProjectService, private router:Router, private admin: AdminService,
    private client: ClientService,
    private member: MemberService,
    private sidebarService: SidebarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAdmin();
    this.getClient();
    this.getMember();
    this.newProject.status = 'pending';
    this.newProject.priority = 'medium';
  }

  getAdmin(){
    return this.admin.getAdmin().subscribe((res) =>{
      console.log(res);
      this.admins = res.admins;
    })
  }

  getClient(){
    return this.client.getClient().subscribe((res) =>{
      console.log(res);
      this.clients = res.clients;
    })
  }

  getMember(){
    return this.member.getMembers(this.searchKeyword).subscribe((res: any) => {
      console.log(res);
      this.members = res.members;
    })
  }

  search() {
    this.getMember();
  }

  displaySelectedImage(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.files = file; // Save the file in the component

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImageSrc = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addUserToTempTeam(member: any) {
    if (!this.tempSelectedUsers.some(user => user.id === member.id)) {
      this.tempSelectedUsers.push(member); // Add the user to the temporary selected users array
    }
  }

  removeUserFromTempTeam(member: any) {
    this.tempSelectedUsers = this.tempSelectedUsers.filter(user => user.id !== member.id);
  }

  isUserInTempTeam(member: any): boolean {
    return this.tempSelectedUsers.some(user => user.id === member.id);
  }

  inviteUsers() {
    this.tempSelectedUsers.forEach(member => {
      if (!this.selectedUsers.some(user => user.id === member.id)) {
        this.selectedUsers.push(member); // Add the user to the final selected users array
        this.newProject.member_id.push(member.id); // Add the user's id to the project's user_ids array
      }
    });
    // this.tempSelectedUsers = []; // Clear temporary selection after inviting
  }

  addProject(): void {
    const formData = new FormData();
    formData.append('name', this.newProject.name);
    formData.append('status', this.newProject.status);
    formData.append('priority', this.newProject.priority);
    formData.append('start_date', this.newProject.start_date);
    formData.append('end_date', this.newProject.end_date);
    formData.append('admin_id', this.newProject.admin_id);
    formData.append('client_id', this.newProject.client_id);
    formData.append('description', this.newProject.description);
    this.newProject.member_id.forEach(id => {
      formData.append('member_id[]', id);
    });
    if (this.files) {
      formData.append('image', this.files, this.files.name);
    }
    this.project.addProject(formData).subscribe({
      next: (res) => {
        this.toastr.success('Project added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/projects']);
        this.sidebarService.triggerReload();
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
          this.toastr.error('Error adding project: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding project:', err);
      }
    });
  }

}
