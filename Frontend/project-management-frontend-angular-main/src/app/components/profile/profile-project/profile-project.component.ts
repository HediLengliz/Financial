import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile-project',
  templateUrl: './profile-project.component.html',
  styleUrls: ['./profile-project.component.css']
})
export class ProfileProjectComponent implements OnInit {

  projects: any[] = [];

  constructor(private userProject: ProfileService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getUserproject();
    this.sharedService.reloadProfile$.subscribe(() => {
      this.getUserproject();
    });
  }

  getUserproject(){
    this.userProject.getUserproject().subscribe((res: any) => {
      console.log(res);
      this.projects = res.projects;
    });
  }
}
