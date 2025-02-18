import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-show-employee',
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.css']
})
export class ShowEmployeeComponent implements OnInit {

  id: any;
  data: any;
  constructor(private service:EmployeeService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showEmployeeById();
  }

  showEmployeeById() {
    this.service.showEmployee(this.id).subscribe(res => {
      console.log(res);
      this.data = res;
    });
  }

}
