import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DesignationService } from 'src/app/services/designation.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  newMember = new Member();
  categories: any;
  designations: any;
  users: any;

  constructor(private member:MemberService, private router:Router,
    private category: CategoryService, private designation: DesignationService,
    private user: EmployeeService, private toastr: ToastrService, private authService: AuthService
    ) { }

  ngOnInit(): void {
    if (!this.authService.hasPermission('member-create')) {
      this.toastr.error('You do not have permission to create a client.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      this.getCategory();
    this.getUser();
    }
  }

  addMember(){
    return this.member.addMember(this.newMember).subscribe({
      next: (res) => {
        this.toastr.success('Team member added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        console.log(res);
        this.router.navigate(['/dashboard/member']);
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
          this.toastr.error('Error adding team member: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding team member:', err);
      }
    })
  }

  getCategory(){
    return this.category.getCategory().subscribe((res) =>{
      console.log(res);
      this.categories = res.categories;
    })
  }

  // getDesignation(){
  //   return this.designation.getDesignation().subscribe((res) =>{
  //     console.log(res);
  //     this.designations = res.designations;
  //   })
  // }

  getUser(){
    return this.user.getEmployee().subscribe((res) =>{
      console.log(res);
      console.log(res);
      this.users = res.users;
    })
  }

  onCategoryChange(categoryId: number) {
    this.newMember.designation_id = null; // Reset designation field
    if (categoryId) {
      this.designation.getDesignationsByCategory(categoryId).subscribe((res) => {
        this.designations = res.designations;
      });
    } else {
      this.designations = [];
    }
  }

}
