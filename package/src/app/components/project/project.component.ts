import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusPipe } from '../../pipe/status.pipe';
import {RouterLink} from "@angular/router";
import {PriorityPipe} from "../../pipe/priority.pipe";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  standalone: true,
  imports: [
    CommonModule,  // Add this to fix *ngIf, *ngFor issues
    FormsModule,   // Ensure ngModel works
    StatusPipe,
    RouterLink,
    PriorityPipe
  ],
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  projectToDeleteId!: number | undefined ;
  searchKeyword: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
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

  setProjectToDelete(projectId: number | undefined): void {
    if (projectId === undefined) return;
    this.projectToDeleteId = projectId;
  }

  confirmDeleteProject(): void {
    if (typeof this.projectToDeleteId === "number") {
      this.projectService.deleteProject(this.projectToDeleteId)
        .subscribe({
          next: () => {
            this.toastr.success('Project deleted successfully!', 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.loadProjects();
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
}
