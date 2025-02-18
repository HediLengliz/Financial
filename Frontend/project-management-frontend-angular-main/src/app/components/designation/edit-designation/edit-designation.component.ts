import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Designation } from 'src/app/models/designation.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DesignationService } from 'src/app/services/designation.service';

@Component({
  selector: 'app-edit-designation',
  templateUrl: './edit-designation.component.html',
  styleUrls: ['./edit-designation.component.css']
})
export class EditDesignationComponent implements OnInit {

  id: any;
  data: any;
  designation = new Designation();
  categories: any;
  constructor(private service:DesignationService,private category:CategoryService, private route:ActivatedRoute, private router:Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.authService.hasPermission('designation-edit')) {
      this.toastr.error('You do not have permission to edit a client.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      console.log(this.id);
      console.log(this.id);
    this.getDesignationById();
    this.getCategoryList();
    }
  }

  getDesignationById(){
    this.service.getDesignationById(this.id).subscribe(res=>{
      console.log(res);
      this.data = res;
      this.designation = this.data.designation;
    });
  }

  getCategoryList(): void {
    this.category.getCategory().subscribe((res) => {
      this.categories = res.categories;
    });
  }

  updateDesignation(){
    this.service.updateDesignation(this.id, this.designation).subscribe({
      next: (res) => {
        this.toastr.success('Designation updated successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/dashboard/designation']);
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
          this.toastr.error('Error updating designation: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating designation:', err);
      }
    })
  }

}
