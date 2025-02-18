import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token: any;
  userData: any;
  editMode: boolean = false;
  profileForm!: FormGroup;
  selectedImageSrc: string | ArrayBuffer | null = null;
  files: File | null = null;

  constructor(private profile:AuthService, private fb: FormBuilder, private userService: EmployeeService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.profile.getUserProfile().subscribe((data: any) => {
        this.userData = data;
        this.profileForm = this.fb.group({
          image: [null]
        });
        // Set selectedImageSrc to the current user's image URL
        this.selectedImageSrc = this.userData.image;
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  displaySelectedImage(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImageSrc = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);

      if (this.profileForm) {
        this.profileForm.patchValue({
          image: file
        });
      }
    }
  }

  onSubmit() {
    if (this.profileForm) {
      const formData = new FormData();
      const imageControl = this.profileForm.get('image');
      if (imageControl) {
        formData.append('image', imageControl.value);
        this.userService.updateUserProfile(formData).subscribe(response => {
          // Handle the response from the server
          this.editMode = false;
          this.userData.image = response.imageUrl;
          this.sharedService.triggerReload(); // Update the userData with new image
        });
      }
    }
  }

}
