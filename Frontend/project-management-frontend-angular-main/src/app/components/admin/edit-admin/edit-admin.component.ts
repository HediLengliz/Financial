import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Admin } from 'src/app/models/admin.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {

  id: any;
  data: any;
  admin = new Admin();
  employees: any;
  constructor(private adminService:AdminService, private userService:EmployeeService, private route:ActivatedRoute, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.authService.hasPermission('admin-edit')) {
      this.toastr.error('You do not have permission to edit a category.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      console.log(this.id);
      console.log(this.id);
    this.getAdminById();
    this.getEmployeeList();
    }
  }

  getAdminById(){
    this.adminService.getAdminById(this.id).subscribe(res=>{
      console.log(res);
      this.data = res;
      this.admin = this.data.admin;
    });
  }

  getEmployeeList(): void {
    this.userService.getEmployee().subscribe((res) => {
      this.employees = res.users;
    });
  }

  updateAdmin(){
    this.adminService.updateAdmin(this.id, this.admin).subscribe({
      next: (res) => {
        this.toastr.success('Admin Group updated successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/admin']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          // Extract and display validation error messages
          for (const key in err.error.message) {
            if (err.error.message.hasOwnProperty(key)) {
              err.error.message[key].forEach((message: string) => {
                this.toastr.error(message, 'Validation Error', {
                  timeOut: 4000,
                  progressBar: true
                });
              });
            }
          }
        } else {
          this.toastr.error('Error updating admin group: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating admin group:', err);
      }
    })
  }

}
