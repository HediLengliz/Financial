import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgCircleProgressModule } from "ng-circle-progress";
import { BudgetService } from "../../../../services/budget.service";
import { Budget } from "../../../../models/budget";
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-show-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgCircleProgressModule,
    RouterOutlet,
  ],
  templateUrl: './show-budget.component.html',
  styleUrls: ['./show-budget.component.scss']
})
export class ShowBudgetComponent implements OnInit {
  showtable: boolean = true;
  public chart: any;
  budget!: Budget;
  pieChartData: any[] = [];
  progress: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    const budgetId = this.route.snapshot.paramMap.get('id');
    if (budgetId) {
      this.loadBudget(budgetId);
    }
  }

  loadBudget(id: string): void {
    this.budgetService.getBudgetById(id).subscribe(
      (data) => {
        this.budget = data;
        this.calculateProgress();
        this.loadChart(); // Load the chart after fetching the budget
      },
      (error) => {
        console.error('Error fetching budget:', error);
      }
    );
  }

  calculateProgress(): void {
    const spent = this.budget.spentAmount;
    const allocated = this.budget.allocatedAmount;
    this.progress = allocated > 0 ? (spent / allocated) * 100 : 0;
  }

  loadChart(): void {
    const spent = this.budget.spentAmount;
    const remaining = this.budget.allocatedAmount - spent;

    this.chart = new Chart('budgetChart', {
      type: 'pie',
      data: {
        labels: ['Spent', 'Remaining'],
        datasets: [{
          data: [spent, remaining],
          backgroundColor: ['#78C000', '#C7E596'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          },
          datalabels: {
            formatter: (value, context) => {
              // @ts-ignore
              const total = context.chart.data.datasets[context.datasetIndex].data.reduce((a, b) => a + b, 0);
              // @ts-ignore
              return `${value} (${Math.round((value / total) * 100)}%)`;
            },
            color: '#fff',
          }
        }
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  goBack() {
    this.router.navigate(['/financial/budget']);
  }
}
