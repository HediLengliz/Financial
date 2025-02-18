import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DesignationService } from 'src/app/services/designation.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MemberService } from 'src/app/services/member.service';


@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {

  id: any;
  data: any;
  member = new Member();
  categories: any;
  designations: any;
  users: any;

  constructor(private service:MemberService,private category:CategoryService,
    private designation:DesignationService, private user: EmployeeService,
    private route:ActivatedRoute, private router:Router, private toastr: ToastrService, private authService: AuthService
     ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.authService.hasPermission('member-edit')) {
      this.toastr.error('You do not have permission to edit a member.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(['/dashboard/unauthorizes']);
    } else {
      console.log(this.id);
      this.getMemberById();
      this.getCategoryList();
      this.getDesignationList();
      this.getUserList();
    }
  }

  getMemberById(){
    this.service.getMemberById(this.id).subscribe(res=>{
      console.log(res);
      this.data = res;
      this.member = this.data.Member;
    });
  }

  getCategoryList(): void {
    this.category.getCategory().subscribe((res) => {
      this.categories = res.categories;
    });
  }

  getDesignationList(): void {
    this.designation.getDesignation().subscribe((res) => {
      this.designations = res.designations;
    });
  }

  getUserList(): void {
    this.user.getEmployee().subscribe((res) => {
      this.users = res.users;
    });
  }

  updateMember(){
    this.service.updateMember(this.id, this.member).subscribe({
      next: (res) => {
        this.toastr.success('Team member updated successfully!', 'Success', {
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
          this.toastr.error('Error updating team member: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating team member:', err);
      }
    })
  }

}
