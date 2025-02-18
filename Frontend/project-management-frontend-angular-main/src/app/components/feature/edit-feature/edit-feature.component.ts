import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feature } from 'src/app/models/feature.interface';
import { FeatureService } from 'src/app/services/feature.service';
import { ProjectService } from 'src/app/services/project.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnInit {

  id: any;
  data: any;
  feature = new Feature();
  projects: any;
  constructor(private service: FeatureService, private project:ProjectService, private route:ActivatedRoute, private router:Router, private sidebarService: SidebarService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getFeatureById();
    this.getProjectList();
  }

  getFeatureById(){
    this.service.getFeatureById(this.id).subscribe(res=>{
      console.log(res);
      this.data = res;
      this.feature = this.data.feature;
    })
  }

  getProjectList(): void {
    this.project.getProject().subscribe((res) => {
      this.projects = res.projects;
    });
  }

  updateFeature(){
    this.service.updateFeature(this.id, this.feature).subscribe({
      next: (res) => {
        this.toastr.success('Feature updated successfully!', 'Success', {
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
          this.toastr.error('Error updating feature: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error updating feature:', err);
      }
    })
  }
}
