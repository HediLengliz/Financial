import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-show-member',
  templateUrl: './show-member.component.html',
  styleUrls: ['./show-member.component.css']
})
export class ShowMemberComponent implements OnInit {

  id: any;
  data: any;
  constructor(private service:MemberService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showMemberById();
  }

  showMemberById() {
    this.service.showMember(this.id).subscribe(res => {
      console.log(res);
      this.data = res.Member;
    });
  }

}
