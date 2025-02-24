import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateProjectRequest } from "../../../models/CreateProjectRequest";
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  selectedImageSrc: string = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg'; // Default image
  newProject: CreateProjectRequest = {
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    startDate: '',
    endDate: '',
    imageFile: null! // Initialize with default (use proper handling)
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

    // Convert dates to MM/dd/yyyy format
    const formattedStartDate = this.formatDate(this.newProject.startDate);
    const formattedEndDate = this.formatDate(this.newProject.endDate);

    formData.append('name', this.newProject.name);
    formData.append('description', this.newProject.description);
    formData.append('status', this.newProject.status);
    formData.append('priority', this.newProject.priority);
    formData.append('startDate', formattedStartDate); // Use formatted date
    formData.append('endDate', formattedEndDate);     // Use formatted date

    if (this.files) {
      formData.append('imageFile', this.files); // Attach the image file
    }

    this.projectService.createProject(formData).subscribe({
      next: (res) => {
        // Assuming the backend returns the project with the imageUrl field populated
        if (res.imageUrl) {
          this.selectedImageSrc = res.imageUrl; // Set the image URL returned by the backend
        }
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

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}/${year}`;
  }

}
