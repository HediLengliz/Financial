import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Admin } from 'src/app/models/admin.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  newAdmin = new Admin();
  employees: any;
  constructor(private userService:EmployeeService, private adminService:AdminService, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('admin-create')) {
      this.toastr.error('You do not have permission to create a category.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.getEmployeeList();
    }
  }

  getEmployeeList(): void {
    this.userService.getEmployee().subscribe((res) => {
      this.employees = res.users;
    });
  }

  addAdmin(){
    this.adminService.addAdmin(this.newAdmin).subscribe({
      next: (res) => {
        this.toastr.success('Admin Group added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/admin']);
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
          this.toastr.error('Error adding admin group: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding admin group:', err);
      }
    });
  }

}
