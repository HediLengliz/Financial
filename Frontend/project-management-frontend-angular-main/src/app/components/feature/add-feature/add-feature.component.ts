import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feature } from 'src/app/models/feature.interface';
import { Project } from 'src/app/models/project.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.css']
})
export class AddFeatureComponent implements OnInit {
  newFeature: Feature = {
    name: '',
    description: '',
    status: 'incompleted',
    project_id: 0
  };
  projects: Project[] = [];

  constructor(
    private featureService: FeatureService,
    private projectService: ProjectService,
    private router: Router,
    private sidebarService: SidebarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => this.handleError('Failed to load projects', err)
    });
  }

  addFeature(): void {
    this.featureService.addFeature(this.newFeature).subscribe({
      next: () => {
        this.toastr.success('Feature added successfully!', 'Success');
        this.router.navigate(['/dashboard/feature']);
        this.sidebarService.triggerReload();
      },
      error: (err) => this.handleFeatureError(err)
    });
  }

  private handleFeatureError(err: any): void {
    if (err.status === 422 && err.error?.message) {
      this.handleValidationErrors(err.error.message);
    } else {
      this.toastr.error('Error adding feature: ' + err.message, 'Error');
    }
    console.error('Error adding feature:', err);
  }

  private handleValidationErrors(errors: any): void {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((message: string) => {
          this.toastr.error(message, 'Validation Error');
        });
      }
    }
  }

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    this.toastr.error(`${context}. Please try again.`, 'Error');
  }
}
