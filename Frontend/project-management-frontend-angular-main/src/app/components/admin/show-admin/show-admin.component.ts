import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-show-admin',
  templateUrl: './show-admin.component.html',
  styleUrls: ['./show-admin.component.css']
})
export class ShowAdminComponent implements OnInit {

  id: any;
  data: any;
  constructor(private adminService:AdminService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showAdminById();
  }

  showAdminById() {
    this.adminService.showAdmin(this.id).subscribe(res => {
      console.log(res);
      this.data = res.admin;
    });
  }

}
