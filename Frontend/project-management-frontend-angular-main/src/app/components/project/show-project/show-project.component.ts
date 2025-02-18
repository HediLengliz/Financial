import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.component.html',
  styleUrls: ['./show-project.component.css']
})
export class ShowProjectComponent implements OnInit {

  id: any;
  data: any;
  progress: any;

  constructor(private project: ProjectService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showProjectById();
  }

  showProjectById() {
    this.project.showProject(this.id).subscribe(res => {
      console.log(res);
      this.data = res.project;
      this.progress = res.project.progress;
    });
  }

}
