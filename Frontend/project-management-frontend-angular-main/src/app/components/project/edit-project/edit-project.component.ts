import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project.interface';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  project: Project = {
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    startDate: '',
    endDate: ''
  };
  selectedFile: File | null = null;
  id: number | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;

    if (this.id) {
      this.loadProject();
    }
  }

  private loadProject(): void {
    this.projectService.getProjectById(this.id!).subscribe({
      next: (project) => {
        this.project = {
          ...project,
          startDate: this.convertToInputDate(project.startDate),
          endDate: this.convertToInputDate(project.endDate)
        };
        this.updateImagePreview(this.project.imagePath || '');
      },
      error: (err) => this.handleError('Failed to load project', err)
    });
  }

  updateProject(): void {
    if (!this.id) return;

    const formData = this.createFormData();

    this.projectService.updateProject(this.id, formData).subscribe({
      next: () => {
        this.toastr.success('Project updated successfully!');
        this.router.navigate(['/dashboard/projects']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          this.handleValidationErrors(err.error.message);
        } else {
          this.handleError('Error updating project', err);
        }
      }
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.project.name);
    formData.append('description', this.project.description);
    formData.append('status', this.project.status);
    formData.append('priority', this.project.priority);
    formData.append('startDate', this.project.startDate);
    formData.append('endDate', this.project.endDate);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    return formData;
  }

  private convertToInputDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.updateImagePreview(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private updateImagePreview(src: string): void {
    const img = document.getElementById('selectedImage') as HTMLImageElement;
    if (img) img.src = src;
  }

  private handleValidationErrors(errors: any): void {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((message: string) => {
          this.toastr.error(message, 'Validation Error', {
            timeOut: 4000,
            progressBar: true
          });
        });
      }
    }
  }

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    this.toastr.error(`${context}. Please try again.`, 'Error', {
      timeOut: 4000,
      progressBar: true
    });
  }
}
