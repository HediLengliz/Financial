import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.css']
})
export class ProfileOverviewComponent implements OnInit {

  project: any;
  data: any;

  constructor(private userProject: ProfileService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getProject();
    this.getUserdetail();
    this.sharedService.reloadProfile$.subscribe(() => {
      this.getProject();
    });
  }

  getProject(){
    return this.userProject.getProject().subscribe((res) => {
      console.log(res);
      this.project = res.projects;
    })
  }

  getUserdetail(){
    return this.userProject.getUserdetail().subscribe((res) => {
      console.log(res);
      this.data = res;
    })
  }

}
