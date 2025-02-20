import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  selectedImageSrc: string = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg';
  newProject: Project = {
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    startDate: '',
    endDate: ''
  };
  files: File | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private sidebarService: SidebarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Initialize dates to today and next week
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    this.newProject.startDate = today.toISOString().split('T')[0];
    this.newProject.endDate = nextWeek.toISOString().split('T')[0];
  }

  displaySelectedImage(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      this.files = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImageSrc = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addProject(): void {
    const formData = new FormData();
    formData.append('name', this.newProject.name);
    formData.append('description', this.newProject.description);
    formData.append('status', this.newProject.status);
    formData.append('priority', this.newProject.priority);
    formData.append('startDate', this.newProject.startDate);
    formData.append('endDate', this.newProject.endDate);

    if (this.files) {
      formData.append('image', this.files);
    }

    this.projectService.createProject(formData).subscribe({
      next: (res) => {
        this.toastr.success('Project created successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/projects']);
        this.sidebarService.triggerReload();
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          this.handleValidationErrors(err.error.message);
        } else {
          this.toastr.error('Error creating project: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error creating project:', err);
      }
    });
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
}
