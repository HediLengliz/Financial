import { Component, OnInit } from '@angular/core';
import { ProjectResponse } from 'src/app/models/project.response';
import { FeatureService } from 'src/app/services/feature.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  projects: any;
  constructor(private project: ProjectService, private feature: FeatureService, private sidebarService: SidebarService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getProject();
    this.sidebarService.reloadSidebar$.subscribe(() => {
      this.getProject();
    });
  }

  getProject(){
    this.project.getProject().subscribe((res: ProjectResponse) => {
      console.log(res);
      this.projects = res.projects;

      // For each project, fetch features
      for (let project of this.projects) {
        this.feature.getFeatureByProject(project.id).subscribe((features: any) => {
          project.features = features.features;
        });
      }
    });
  }

  setFeatureName(featureName: string) {
    this.sharedService.changeFeatureName(featureName);
  }
  
}
