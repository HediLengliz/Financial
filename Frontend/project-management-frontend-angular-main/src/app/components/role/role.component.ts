import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  searchKeyword: string = '';
  loading: boolean = false;
  roles: any;
  roleToDeleteId!: number;
  roleToDeleteName!: string;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  // permissions: Permission[] = [];
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private role:RoleService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getRole();
  }

  getRole(){
    this.isLoading = true;
    return this.role.Role(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.roles = res.roles.data;
        this.totalPages = res.roles.last_page;
        this.totalItems = res.roles.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.roles = []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
        this.isLoading = false;
      }
    )
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  search() {
    this.getRole();
  }

  setRoleToDelete(roleId: number, roleName: string) {
    this.roleToDeleteId = roleId;
    this.roleToDeleteName = roleName;
  }

  deleteRole() {
    // Check if the user has permission to delete a role
    if (this.authService.hasPermission('role-delete')) {
      this.role.deleteRole(this.roleToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getRole(); // Refresh roles after deletion
            document.getElementById('exampleModal')?.click();
          } else {
            this.toastr.error(res.message, 'Error', {
              timeOut: 4000,
              progressBar: true
            });
          }
        },
        (error) => {
          console.error('Error:', error);
          this.toastr.error('An error occurred while deleting the feature.', 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
      );
    } else {
      // Display error message if user doesn't have permission to delete a role
      this.toastr.error('You do not have permission to delete a role.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getRole();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getRole();
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }  

  calculateFirstItemIndex(): number {
    return (this.currentPage - 1) * this.perPage + 1;
  }
  
  calculateLastItemIndex(): number {
    const lastItem = this.currentPage * this.perPage;
    return lastItem > this.totalItems ? this.totalItems : lastItem;
  }

}
