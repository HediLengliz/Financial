import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.css']
})
export class PageContentComponent implements OnInit {

  data: any;
  project: any;
  member: any;
  task: any;
  percent: any;

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Completed', 'In Progress', 'Behind' ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [ 0, 0, 0 ], label: 'Tasks' },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      console.log('PRODUCT FETCHING', response);
      const data = response.dashboard;

      // Extract and assign data to component properties
      this.data = data.dashboard;
      this.project = data.project.projects;
      this.member = data.user.member;
      this.task = data.task.task;
      this.percent = data.graph;

      // Update doughnut chart with graph data
      this.updateDoughnutChart(data.graph.completedTasks, data.graph.inProgressTasks, data.graph.behindTasks);

      console.log('PRODUCT FETCHED');
    });
  }

  updateDoughnutChart(completed: number, inProgress: number, behind: number) {
    this.doughnutChartDatasets = [
      { data: [ completed, inProgress, behind ], label: 'Tasks' },
    ];
  }
}
