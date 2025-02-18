import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-show-role',
  templateUrl: './show-role.component.html',
  styleUrls: ['./show-role.component.css']
})
export class ShowRoleComponent implements OnInit {

  id: any;
  data: any;

  constructor(private role:RoleService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showEmployeeById();
  }

  showEmployeeById() {
    this.role.showRole(this.id).subscribe(res => {
      console.log(res);
      this.data = res;
    });
  }

}
