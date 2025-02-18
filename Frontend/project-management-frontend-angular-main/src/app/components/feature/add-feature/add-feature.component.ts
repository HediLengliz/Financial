import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feature } from 'src/app/models/feature.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.css']
})
export class AddFeatureComponent implements OnInit {

  newFeature = new Feature;
  projects: any;
  constructor(private feature:FeatureService, private router:Router, private project:ProjectService, private sidebarService: SidebarService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getProjectList();
    this.newFeature.status = 'incompleted';
  }

  getProjectList(): void {
    this.project.getProject().subscribe((res) => {
      this.projects = res.projects;
    });
  }

  addFeature() {
    this.feature.addFeature(this.newFeature).subscribe({
      next: (res) => {
        this.toastr.success('Feature added successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        console.log(res);
        this.router.navigate(['/dashboard/feature']);
        this.sidebarService.triggerReload();
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          // Extract and display validation error messages
          for (const key in err.error.message) {
            if (err.error.message.hasOwnProperty(key)) {
              err.error.message[key].forEach((message: string) => {
                this.toastr.error(message, 'Validation Error', {
                  timeOut: 4000,
                  progressBar: true
                });
              });
            }
          }
        } else {
          this.toastr.error('Error adding feature: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error adding feature:', err);
      }
    })
  }
}
