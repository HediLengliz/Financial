import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  newCategory = new Category();
  constructor(private category:CategoryService, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('category-create')) {
      this.toastr.error('You do not have permission to create a category.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
    
    }
  }

  addCategory(){
    return this.category.addCategory(this.newCategory).subscribe({
      next: (res) => {
        this.toastr.success('Category added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/category']);
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
          this.toastr.error('Error adding category: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding category:', err);
      }
    })
  }

}
