import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DesignationResponse } from 'src/app/models/designation.response';
import { AuthService } from 'src/app/services/auth.service';
import { DesignationService } from 'src/app/services/designation.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent implements OnInit {

  designations: any;
  // loading: boolean = false;
  designationToDeleteId!: number;
  designationToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private designation:DesignationService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getDesignation();
  }

  getDesignation(){
    this.isLoading = true;
    return this.designation.Designation(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.designations = res.designations.data;
        this.totalPages = res.designations.last_page;
        this.totalItems = res.designations.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.designations = []; 
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
    this.getDesignation();
  }

  setDesignationToDelete(designationId: number, designationName: string) {
    this.designationToDeleteId = designationId;
    this.designationToDeleteName = designationName;
  }

  deleteDesignation(){
    if (this.authService.hasPermission('designation-delete')){
      this.designation.deleteDesignation(this.designationToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getDesignation();
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
            this.toastr.error('An error occurred while deleting the designation.', 'Error', {
              timeOut: 4000,
              progressBar: true
          });
        }
      );
    }else {
      // Display error message if user doesn't have permission to delete a role
      this.toastr.error('You do not have permission to delete a designation.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getDesignation();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getDesignation();
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
