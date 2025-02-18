import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from 'src/app/services/feature.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-show-feature',
  templateUrl: './show-feature.component.html',
  styleUrls: ['./show-feature.component.css']
})
export class ShowFeatureComponent implements OnInit {

  id: any;
  data: any;
  totalTask: any;
  completeTask: any;
  incompleteTask: any;
  overdueTask: any;

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Completed', 'Incomplete', ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [ 0, 0 ], label: 'Tasks' },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false
  };

  constructor(private feature: FeatureService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.showProjectById();
  }

  showProjectById() {
    this.feature.showFeature(this.id).subscribe(res => {
      console.log("Hello");
      console.log(res);
      console.log("end");
      this.data = res.feature;
      this.totalTask = res.task_count;
      this.completeTask = res.task_complete;
      this.incompleteTask = res.task_incomplete;
      this.overdueTask = res.task_overdue;
      this.updateDoughnutChart(res.feature_progress , res.incompleteProgress);
    });
  }

  updateDoughnutChart(completed: number, incompleted: number) {
    this.doughnutChartDatasets = [
      { data: [ completed, incompleted, ], label: 'Tasks' },
    ];
  }
}
