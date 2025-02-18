import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FeatureService } from 'src/app/services/feature.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  features: any;
  featureToDeleteId!: number;
  featureToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private feature:FeatureService, private sidebarService: SidebarService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getFeature();
  }

  // getFeature(){
  //   this.isLoading = true;
  //   return this.feature.getFeatures(this.searchKeyword).subscribe((res: any) => {
  //     console.log(res);
  //     this.features = res.features;
  //   });
  // }

  // getProject() {
  //   this.isLoading = true;
  //   this.projectService.getProjects(this.searchKeyword, this.selectedStatus).subscribe(
  //     (res: any) => {
  //       this.projects = res.projects;
  //       this.errorMessage = undefined;
  //       this.isLoading = false;
  //     },
  //     error => {
  //       if (error.status === 404) {
  //         this.errorMessage = error.error.message;
  //         this.projects = []; 
  //       } else {
  //         this.errorMessage = 'An error occurred while fetching tasks.';
  //       }
  //       this.isLoading = false;
  //     }
  //   )
  // }

  getFeature(){
    this.isLoading = true;
    return this.feature.Feature(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.features = res.features.data;
        this.totalPages = res.features.last_page;
        this.totalItems = res.features.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.features = []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
        this.isLoading = false;
      }
    )
  }

  search() {
    this.getFeature();
  }

  setFeatureToDelete(featureId: number, featureName: string) {
    this.featureToDeleteId = featureId;
    this.featureToDeleteName = featureName;
  }

  deleteFeature() {
    this.feature.deleteFeature(this.featureToDeleteId).subscribe(
      (res) => {
        if (res.status === 200) {
          this.toastr.success(res.message, 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          console.log(res);
          this.getFeature();
          this.sidebarService.triggerReload();
          document.getElementById('exampleModal-2')?.click();
        } else {
          this.toastr.error(res.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
      },
      (error) => {
        console.error('Error:', error);
          this.toastr.error('An error occurred while deleting the feature.', 'Error', {
            timeOut: 4000,
            progressBar: true
        });
      }
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getFeature();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getFeature();
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }  

  calculateFirstItemIndex(): number {
    return (this.currentPage - 1) * this.perPage + 1;
  }
  
  calculateLastItemIndex(): number {
    const lastItem = this.currentPage * this.perPage;
    return lastItem > this.totalItems ? this.totalItems : lastItem;
  }
}
