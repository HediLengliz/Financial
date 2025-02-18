import { Component, OnInit } from '@angular/core';
import { FeatureService } from 'src/app/services/feature.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-feature-report',
  templateUrl: './feature-report.component.html',
  styleUrls: ['./feature-report.component.css']
})
export class FeatureReportComponent implements OnInit {

  features: any;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private featureReport: ReportService) { }

  ngOnInit(): void {
    this.getFeature();
  }

  getFeature(){
    return this.featureReport.Feature(this.currentPage, 5).subscribe((res) => {
      console.log(res);
      this.features = res.features.data;
      this.totalPages = res.features.last_page;
      this.totalItems = res.features.total;
    })
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
