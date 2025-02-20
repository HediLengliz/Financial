import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Project } from 'src/app/models/project.interface';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  projectToDeleteId!: number;
  searchKeyword: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects(this.searchKeyword, this.selectedStatus)
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.errorMessage = undefined;
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error);
          this.isLoading = false;
        }
      });
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'No projects found';
      this.projects = [];
    } else {
      this.errorMessage = 'An error occurred while fetching projects';
      this.toastr.error('Failed to load projects', 'Error', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  search(): void {
    this.loadProjects();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.loadProjects();
  }

  // Component method
  setProjectToDelete(projectId: number | undefined): void {
    if (projectId === undefined) return;
    this.projectToDeleteId = projectId;
  }

  confirmDeleteProject(): void {
    this.projectService.deleteProject(this.projectToDeleteId)
      .subscribe({
        next: () => {
          this.toastr.success('Project deleted successfully!', 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          this.loadProjects();
          this.sidebarService.triggerReload();
        },
        error: (error) => {
          this.toastr.error('Failed to delete project', 'Error', {
            timeOut: 4000,
            progressBar: true
          });
          console.error('Delete error:', error);
        }
      });
  }
}
