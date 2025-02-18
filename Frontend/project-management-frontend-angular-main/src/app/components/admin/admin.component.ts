import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  admins: any;
  // loading: boolean = false;
  adminToDeleteId!: number;
  adminToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private adminService: AdminService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAdmin();
  }

  getAdmin(){
    this.isLoading = true;
    return this.adminService.Admin(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.admins = res.admins.data;
        this.totalPages = res.admins.last_page;
        this.totalItems = res.admins.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.admins = []; 
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
    this.getAdmin();
  }

  setDesignationToDelete(adminId: number, adminName: string) {
    this.adminToDeleteId = adminId;
    this.adminToDeleteName = adminName;
  }

  deleteDesignation(){
    if (this.authService.hasPermission('category-delete')){
      this.adminService.deleteAdmin(this.adminToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getAdmin();
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
    }else {
      // Display error message if user doesn't have permission to delete a role
      this.toastr.error('You do not have permission to delete a category.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAdmin();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAdmin();
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
