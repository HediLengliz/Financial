import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any;
  // loading: boolean = false;
  categoryToDeleteId!: number;
  categoryToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private category:CategoryService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(){
    this.isLoading = true;
    return this.category.Category(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        console.log(res);
        this.categories = res.categories.data;
        this.errorMessage = undefined;
        this.totalPages = res.categories.last_page;
        this.totalItems = res.categories.total;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.categories = []; 
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
    this.getCategory();
  }

  setCategoryToDelete(categoryId: number, categoryName: string) {
    this.categoryToDeleteId = categoryId;
    this.categoryToDeleteName = categoryName;
  }

  deleteCategory(){
    if (this.authService.hasPermission('category-delete')){
      this.category.deleteCategory(this.categoryToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getCategory();
            document.getElementById('exampleModal-2')?.click();
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
      )
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
      this.getCategory();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getCategory();
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
