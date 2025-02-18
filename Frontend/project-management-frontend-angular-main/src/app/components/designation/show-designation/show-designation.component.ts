import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignationService } from 'src/app/services/designation.service';

@Component({
  selector: 'app-show-designation',
  templateUrl: './show-designation.component.html',
  styleUrls: ['./show-designation.component.css']
})
export class ShowDesignationComponent implements OnInit {

  id: any;
  data: any;
  constructor(private service:DesignationService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showDesignationById();
  }

  showDesignationById() {
    this.service.showDesignation(this.id).subscribe(res => {
      console.log(res);
      this.data = res.designation;
    });
  }

}
