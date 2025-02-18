import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.css']
})
export class ShowCategoryComponent implements OnInit {

  id: any;
  data: any;
  constructor(private service:CategoryService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showCategoryById();
  }

  showCategoryById() {
    this.service.showCategory(this.id).subscribe(res => {
      console.log(res);
      this.data = res.category;
    });
  }

}
