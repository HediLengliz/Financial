import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MemberResponse } from 'src/app/models/member.response';
import { AuthService } from 'src/app/services/auth.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  members: any;
  loading: boolean = false;
  memberToDeleteId!: number;
  memberToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private member:MemberService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getMember();
  }

  getMember(){
    this.isLoading = true;
    return this.member.Member(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.members = res.members.data;
        this.totalPages = res.members.last_page;
        this.totalItems = res.members.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.members = []; 
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
    this.getMember();
  }

  setMemberToDelete(memberId: number, memberName: string) {
    this.memberToDeleteId = memberId;
    this.memberToDeleteName = memberName;
  }

  deleteMember(){
    if (this.authService.hasPermission('member-delete')){
      this.member.deleteMember(this.memberToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getMember();
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
      this.toastr.error('You do not have permission to delete a member.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getMember();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getMember();
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
