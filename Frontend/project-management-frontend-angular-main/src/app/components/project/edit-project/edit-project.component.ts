import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project.interface';
import { AdminService } from 'src/app/services/admin.service';
import { ClientService } from 'src/app/services/client.service';
import { MemberService } from 'src/app/services/member.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  id: any;
  project = new Project();
  selectedFile: File | null = null;
  admins: any;
  clients: any;
  members: any;
  data: any;
  projectToDeleteId!: number;
  projectToDeleteName!: string;
  searchKeyword: string = '';
  projectUsers: any[] = []; // Array to hold project users
  tempProjectUsers: any[] = []; // Array to hold temporary selected users

  constructor(private projectService: ProjectService, private route:ActivatedRoute, private router:Router, private admin: AdminService,
    private client: ClientService,
    private member: MemberService,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getProjectById();
    this.getAdmin();
    this.getClient();
    this.getMember();
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

  getProjectById() {
    this.projectService.getProjectById(this.id).subscribe(res => {
      console.log(res);
      this.project = res.project;
      // Convert the dates to the required format
      this.project.start_date = this.convertToInputDate(this.project.start_date);
      this.project.end_date = this.convertToInputDate(this.project.end_date);
      // Map admin and client names to their IDs
      this.project.admin_id = res.project.admin_id;
      this.project.client_id = res.project.client_id;
      if (this.project.image) {
        const selectedImage = document.getElementById('selectedImage') as HTMLImageElement;
        selectedImage.src = this.project.imageUrl;
      }
      // Automatically update user_ids based on project users
      this.project.member_id = this.project.members.map(user => user.id);

      // Populate projectUsers array with project users
      this.projectUsers = this.project.members;
      this.tempProjectUsers = [...this.projectUsers];
    });
  }

  isUserInProject(user: any): boolean {
    return this.project.member_id.includes(user.id);
  }

  addUserToTempTeam(member: any) {
    if (!this.tempProjectUsers.some(user => user.id === member.id)) {
      this.tempProjectUsers.push(member);
      this.cdr.detectChanges();
    }
  }

  isUserInTempTeam(member: any): boolean {
    return this.tempProjectUsers.some(user => user.id === member.id);
  }
  
  removeUserFromTempTeam(member: any) {
    this.tempProjectUsers = this.tempProjectUsers.filter(user => user.id !== member.id);
    this.cdr.detectChanges();
  }

  inviteMembers() {
    this.projectUsers = [...this.tempProjectUsers];
    this.project.member_id = this.tempProjectUsers.map(user => user.id);
    this.cdr.detectChanges();
  }
  
  convertToInputDate(dateString: string): string {
    const date = new Date(dateString);
    // Format the date as "yyyy-MM-dd"
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    // Display the selected image
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const selectedImage = document.getElementById('selectedImage') as HTMLImageElement;
        selectedImage.src = e.target!.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProject(){
    const formData = new FormData();
    formData.append('name', this.project.name);
    formData.append('status', this.project.status);
    formData.append('priority', this.project.priority);
    formData.append('start_date', this.project.start_date);
    formData.append('end_date', this.project.end_date);
    formData.append('admin_id', this.project.admin_id);
    formData.append('client_id', this.project.client_id);
    formData.append('description', this.project.description);
    
    // Append each member_id separately
    this.project.member_id.forEach(id => {
      formData.append('member_id[]', id);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.projectService.updateProject(this.id, formData).subscribe({
      next: (res) => {
        this.toastr.success('Project updated successfully!', 'Success', {
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
          this.toastr.error('Error updating project: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating project:', err);
      }
    });
  }

  setProjectToDelete(projectId: number, projectName: string) {
    this.projectToDeleteId = projectId;
    this.projectToDeleteName = projectName;
  }

}
