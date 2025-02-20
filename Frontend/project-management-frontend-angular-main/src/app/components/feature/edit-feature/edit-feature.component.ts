import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feature } from 'src/app/models/feature.interface';
import { Project } from 'src/app/models/project.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnInit {
  feature: Feature = {
    name: '',
    description: '',
    status: 'incompleted',
    project_id: 0
  };
  projects: Project[] = [];
  id!: number;

  constructor(
    private featureService: FeatureService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private sidebarService: SidebarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.loadFeature();
    this.loadProjects();
  }

  private loadFeature(): void {
    this.featureService.getFeatureById(this.id).subscribe({
      next: (res) => this.feature = res,
      error: (err) => this.handleError('Failed to load feature', err)
    });
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => this.handleError('Failed to load projects', err)
    });
  }

  updateFeature(): void {
    this.featureService.updateFeature(this.id, this.feature).subscribe({
      next: () => {
        this.toastr.success('Feature updated successfully!', 'Success');
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
      this.toastr.error('Error updating feature: ' + err.message, 'Error');
    }
    console.error('Error updating feature:', err);
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
