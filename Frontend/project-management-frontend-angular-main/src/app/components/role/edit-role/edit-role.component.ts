import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Permission, Role } from 'src/app/models/role.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

  id: any;
  role: Role = new Role();
  permissions: Permission[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private roleService: RoleService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.authService.hasPermission('role-edit')) {
      // Redirect to unauthorized page or display message
      this.toastr.error('You do not have permission to edit a role.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.getRoleById();
    }
  }

  getRoleById() {
    this.roleService.getRoleById(this.id).subscribe(res => {
      if (res) { // Check if res is not undefined
        this.role = res.role!;
        
        // Check if permissions exists and not undefined
        if (res.permissions && res.rolePermissions) {
          this.permissions = res.permissions;
          
          // Assign permissions to the role and mark checkboxes accordingly
          this.role.permission = Object.keys(res.rolePermissions).map(key => {
            const permission = this.permissions.find(permission => permission.id === parseInt(key));
            return permission ? permission.name : '';
          });
        }
      }
    });
  }   

  updateRole() {
    this.roleService.updateRole(this.id, this.role).subscribe({
      next: (res) => {
        this.toastr.success('Role updated successfully!', 'Success', {
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
          this.toastr.error('Error updating role: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating role:', err);
      }
    })
  }

  togglePermission(permissionName: string) {
    const index = this.role.permission.indexOf(permissionName);
    if (index === -1) {
      // If not present, add to permissions array
      this.role.permission.push(permissionName);
    } else {
      // If present, remove from permissions array
      this.role.permission.splice(index, 1);
    }
  }
  
}
