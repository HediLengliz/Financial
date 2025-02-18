import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  newEmployee = new Employee();
  roles: any;
  selectedImageSrc: string = 'https://mdbootstrap.com/img/Photos/Others/placeholder-avatar.jpg';
  files: File | null = null; // To store the selected file

  constructor(private employee:EmployeeService, private router:Router, private role:RoleService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('user-create')) {
      this.toastr.error('You do not have permission to create a user.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.getRole();
    }
  }

  displaySelectedImage(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.files = file; // Save the file in the component

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImageSrc = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addEmployee(): void {
    const formData = new FormData();
    formData.append('name', this.newEmployee.name);
    formData.append('email', this.newEmployee.email);
    formData.append('password', this.newEmployee.password);
    formData.append('password_confirmation', this.newEmployee.password_confirmation);
    formData.append('roles', this.newEmployee.roles);
    if (this.files) {
      formData.append('image', this.files, this.files.name);
    }
  
    this.employee.addEmployee(formData).subscribe({
      next: (res) => {
        this.toastr.success('User added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/employees']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.error) {
          // Extract and display validation error messages
          for (const key in err.error.error) {
            if (err.error.error.hasOwnProperty(key)) {
              err.error.error[key].forEach((message: string) => {
                this.toastr.error(message, 'Validation Error', {
                  timeOut: 4000,
                  progressBar: true
                });
              });
            }
          }
        } else {
          this.toastr.error('Error adding user: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding user:', err);
      }
    });
  }
  

  getRole(){
    return this.role.getRole().subscribe((res) =>{
      console.log(res);
      this.roles = res.roles;
    })
  }

}
