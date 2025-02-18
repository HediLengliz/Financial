import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Designation } from 'src/app/models/designation.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DesignationService } from 'src/app/services/designation.service';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.css']
})
export class AddDesignationComponent implements OnInit {

  newDesignation = new Designation();
  categories: any;
  constructor(private category:CategoryService, private designation:DesignationService, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('designation-create')) {
      this.toastr.error('You do not have permission to create a client.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.getCategoryList();
    }
  }

  getCategoryList(): void {
    this.category.getCategory().subscribe((res) => {
      this.categories = res.categories;
    });
  }

  addDesignation(){
    this.designation.addDesignation(this.newDesignation).subscribe({
      next: (res) => {
        this.toastr.success('Designation added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/designation']);
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
          this.toastr.error('Error adding designation: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding designation:', err);
      }
    });
  }

}
