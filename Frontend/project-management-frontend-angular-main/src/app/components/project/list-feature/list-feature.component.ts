import { Component, Input, OnInit } from '@angular/core';
import { FeatureService } from 'src/app/services/feature.service';

@Component({
  selector: 'app-list-feature',
  templateUrl: './list-feature.component.html',
  styleUrls: ['./list-feature.component.css']
})
export class ListFeatureComponent implements OnInit {

  @Input() projectId!: string | null;
  features: any;

  constructor(private featureService: FeatureService) { }

  ngOnInit(): void {
    if (this.projectId) {
      this.getFeaturesByProjectId(this.projectId);
    }
  }

  getFeaturesByProjectId(projectId: string): void {
    this.featureService.getFeaturesByProject(projectId)
      .subscribe((response: any) => {
        console.log(response);
        this.features = response.features;
      });
  }

}
