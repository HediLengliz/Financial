import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {Budget} from "../../../../models/budget";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {BudgetService} from "../../../../services/budget.service";
import {Expense} from "../../../../models/expense";
import {ExpenseService} from "../../../../services/expense.service";
import {ToastrService} from "ngx-toastr";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers,
  ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis,
  ApexYAxis,
  ChartComponent, NgApexchartsModule
} from "ng-apexcharts";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TablerIconsModule} from "angular-tabler-icons";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {productsalesChart} from "../../../product-sales/product-sales.component";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
export interface ExpenseChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
}


@Component({
  selector: 'app-show-expense',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NgStyle,
    NgClass,
    DatePipe,
    TitleCasePipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    NgApexchartsModule,
    TablerIconsModule,
    MatMenuTrigger,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatIcon,
    MatCardHeader,
    MatFabButton,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './show-expense.component.html',
  styleUrl: './show-expense.component.scss'
})
export class ShowExpenseComponent implements OnInit {
  public expenseChart!: Partial<ExpenseChart> | any;




  chartSeries: ApexAxisChartSeries = [];
  chart: ApexChart = { type: 'bar', height: 350 };
  dataLabels: ApexDataLabels = { enabled: false };
  plotOptions: ApexPlotOptions = { bar: { horizontal: false } };
  yaxis: ApexYAxis = { title: { text: 'Amount' } };
  legend: ApexLegend = { position: 'top' };
  grid: ApexGrid = { row: { colors: ['#f3f3f3', 'transparent'] } };
  expense: any;

  showtable: boolean = true;
  pieChartData: any[] = [];
  colorScheme = {
    domain: ['#78C000', '#C7E596']
  };
  progress: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private toastr: ToastrService ,
    public dialogRef: MatDialogRef<ShowExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.initChart();
  }
  private initChart(): void {
    this.expenseChart = {
      series: [{
        name: 'Amount',
        data: [],
        color: '#fb977d'
      }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM'
        }
      },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%'
        }
      }
    };
  }
  viewExpense(expenseId: string) {
    this.showtable = false; // Hide the budget table
    // this.router.navigate(['/show-budget', budgetId]); // Navigate to Show Budget component
  }


  private loadExpenseData(): void {
    if (this.data.id) {
      this.expenseService.getExpenseById(this.data.id.toString()).subscribe({
        next: (expense) => {
          this.expense = expense;
          this.updateChartData();
          this.calculateProgress();
        },
        error: (error) => {
          console.error('Error loading expense:', error);
          this.toastr.error('Failed to load expense details');
          this.dialogRef.close();
        }
      });
    }
  }
  private updateChartData(): void {
    if (this.expense) {
      this.expenseChart.series = [{
        name: 'Amount',
        data: [{
          x: new Date(this.expense.createdAt),
          y: this.expense.amount
        }]
      }];
    }
  }


  private generateChartData(): number[] {
    if (!this.expense) return [];
    // Replace with actual data logic
    return [this.expense.amount, ...Array(6).fill(0).map(() =>
      Math.floor(Math.random() * (this.expense.amount + 100))
    )];
  }



  ngOnInit(): void {
    this.loadExpenseData();
  }

  loadExpense(id: string): void {
    this.expenseService.getExpenseById(id).subscribe(
      (data) => {
        this.expense = data;
        this.calculateProgress(); // Call calculateProgress after loading the budget
      },
      (error) => {
        console.error('Error fetching budget:', error);
      }
    );
  }
  getStatusPercentage(): number {
    return this.expense ? Math.floor((this.expense.amount / 1000) * 100) : 0;
  }

  calculateProgress(): void {
    if (this.expense) {
      this.progress = this.expense.amount;
    }
  }

  getStatusClass(expense: any): string {
    if (!expense) return 'badge-info';

    // Calculate days since creation
    const createdAt = new Date(expense.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Determine status based on amount and age
    if (expense.amount > 1000) {
      return diffDays > 30 ? 'badge-danger' : 'badge-warning';
    } else if (expense.amount > 500) {
      return diffDays > 60 ? 'badge-warning' : 'badge-info';
    }
    return 'badge-success';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
