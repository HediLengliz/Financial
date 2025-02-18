import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-team',
  templateUrl: './profile-team.component.html',
  styleUrls: ['./profile-team.component.css']
})
export class ProfileTeamComponent implements OnInit {

  designationCounts: { designation: string, count: number }[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getTeam();
  }

  getTeam() {
    this.profileService.getUserteam().subscribe((res: any) => {
      console.log(res);
      // Convert the object to an array of objects
      this.designationCounts = Object.keys(res.designation_counts).map(key => ({
        designation: key,
        count: res.designation_counts[key]
      }));
    }, (error) => {
      console.error('Error fetching team data:', error);
    });
  }

}
