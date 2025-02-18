import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  id: any;
  data: any;
  category = new Category();
  constructor(private service:CategoryService, private route:ActivatedRoute, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.authService.hasPermission('category-edit')) {
      this.toastr.error('You do not have permission to edit a category.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      console.log(this.id);
      this.getCategoryById();
    }
  }

  getCategoryById(){
    this.service.getCategoryById(this.id).subscribe(res=>{
      console.log(res);
      this.data = res;
      this.category = this.data.category;
    });
  }

  updateCategory(){
    this.service.updateCategory(this.id, this.category).subscribe({
      next: (res) => {
        this.toastr.success('Category updated successfully!', 'Success', {
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
          this.toastr.error('Error updating category: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating category:', err);
      }
    })
  }

}
