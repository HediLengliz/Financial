import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Permission, Role } from 'src/app/models/role.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  newRole = new Role();
  permissions: Permission[] = [];

  constructor(private role:RoleService, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('role-create')) {
      this.toastr.error('You do not have permission to create a role.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.loadPermissions();
    }
  }

  loadPermissions() {
    this.role.getPermissions().subscribe(
      (response) => {
        this.permissions = response.permissions;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addRole(){
    this.role.addRole(this.newRole).subscribe({
      next: (res) => {
        this.toastr.success('Role added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/roles']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.errors) {
          // Extract and display validation error messages
          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              err.error.errors[key].forEach((message: string) => {
                this.toastr.error(message, 'Validation Error', {
                  timeOut: 4000,
                  progressBar: true
                });
              });
            }
          }
        } else {
          this.toastr.error('Error adding role: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding role:', err);
      }
    })
  }

  togglePermission(permissionName: string) {
    const index = this.newRole.permission.indexOf(permissionName);
    if (index === -1) {
      // If not present, add to permissions array
      this.newRole.permission.push(permissionName);
    } else {
      // If present, remove from permissions array
      this.newRole.permission.splice(index, 1);
    }
  }
  

}
