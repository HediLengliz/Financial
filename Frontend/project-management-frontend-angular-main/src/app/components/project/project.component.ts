import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projects: any;
  // loading: boolean = false;
  projectToDeleteId!: number;
  projectToDeleteName!: string;
  searchKeyword: string = '';
  selectedStatus: string = '';
  confirmationProjectName: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private projectService: ProjectService, private toastr: ToastrService, private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this.isLoading = true;
    this.projectService.Project(this.searchKeyword, this.selectedStatus, this.currentPage, 5).subscribe(
      (res: any) => {
        this.projects = res.projects.data;
        this.totalPages = res.projects.last_page;
        this.totalItems = res.projects.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.projects = []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
        this.isLoading = false;
      }
    )
  }

  search() {
    this.getProject();
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.getProject();
  }

  setProjectToDelete(projectId: number, projectName: string) {
    this.projectToDeleteId = projectId;
    this.projectToDeleteName = projectName;
  }

  confirmDeleteProject(){
    this.projectService.deleteProject(this.projectToDeleteId, this.confirmationProjectName).subscribe(
      (res) => {
        if (res.status === 200) {
          this.toastr.success(res.message, 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.getProject();
          this.sidebarService.triggerReload();
          document.getElementById('exampleModal-2')?.click();
        } else {
          this.toastr.error(res.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
      },
      (error) => {
        console.error('Error:', error);
          this.toastr.error('An error occurred while deleting the feature.', 'Error', {
            timeOut: 4000,
            progressBar: true
        });
      }
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getProject();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProject();
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
