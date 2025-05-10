import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Expense } from '../../../models/expense';
import { StatusPipe } from '../../../pipe/status.pipe';
import { ExpenseService } from '../../../services/expense.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { ShowExpenseComponent } from "./show-expense/show-expense.component";
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatButtonModule } from '@angular/material/button';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow,
  MatRowDef,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatChip, MatChipsModule} from "@angular/material/chips";

// Chart interfaces
export interface CategoryChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
}

export interface StatusChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
}

export interface TimeChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    StatusPipe,
    TablerIconsModule,
    MatButtonModule,
    NgApexchartsModule,
    MatMenu,
    MatMenuTrigger,
    MatCardTitle,
    MatCardContent,
    MatCard,
    MatHeaderRow,
    MatRowDef,
    MatMenuItem,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatIconModule, // Corrected
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatProgressSpinner,
    MatChipsModule, // For mat-chip-list
    MatHeaderRowDef,
    MatRow,
    MatNoDataRow,

  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [DatePipe]
})
export class ExpenseComponent implements OnInit {
  @ViewChild('categoryChartElement') categoryChartElement!: ChartComponent;
  @ViewChild('statusChartElement') statusChartElement!: ChartComponent;
  @ViewChild('timeChartElement') timeChartElement!: ChartComponent;

  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  expenseToDeleteId?: number;
  searchKeyword: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage?: string;
  sortColumn: string = '';
  amountSearch?: number;
  createdAt: string = '';
  updatedAt: string = '';
  selectedCategory: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  timeViewMode: 'weekly' | 'monthly' = 'monthly';

  // Chart configurations
  public categoryChart!: Partial<CategoryChartOptions>;
  public statusChart!: Partial<StatusChartOptions>;
  public timeChart!: Partial<TimeChartOptions>;

  private searchTextSubject = new Subject<void>();
  private searchFilterSubject = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.initCharts();
  }

  initCharts(): void {
    // Initialize Category Chart
    this.categoryChart = {
      series: [],
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
      },
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
          },
        },
      },
      tooltip: {
        theme: 'light',
        fillSeriesColor: false,
      },
      legend: {
        position: 'bottom',
        formatter: function(seriesName, opts) {
          return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex];
        }
      },
      colors: ['#0085db', '#fb977d', '#03c9d7', '#fec90f', '#1e4db7', '#ff5c8e', '#2cabe3']
    };

    // Initialize Status Chart
    this.statusChart = {
      series: [],
      chart: {
        type: 'pie',
        height: 300,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
      },
      labels: [],
      tooltip: {
        theme: 'light',
        fillSeriesColor: false,
      },
      legend: {
        position: 'bottom',
        formatter: function(seriesName, opts) {
          return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex];
        }
      },
      colors: ['#13deb9', '#fa896b', '#ffd16e', '#8a95ab'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: false,
          donut: {
            size: '0%',
          },
        },
      },
    };

    // Initialize Time Chart
    this.timeChart = {
      series: [],
      chart: {
        type: 'area',
        height: 350,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
        type: 'category',
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return '$' + val.toFixed(0);
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      tooltip: {
        theme: 'light',
        x: {
          format: 'MMM yyyy',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      colors: ['#0085db', '#fb977d', '#03c9d7'],
    };
  }

  openExpenseDetails(expenseId: number): void {
    this.dialog.open(ShowExpenseComponent, {
      width: '800px',
      data: { id: expenseId },
      panelClass: 'expense-dialog-container'
    });
  }

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadExpenses();
    // Subscribe to expense updates
    this.expenseService.expenseUpdated$.subscribe(() => {
      this.loadExpenses(); // Reload expenses when notified
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.amountSearch = undefined;
    this.createdAt = '';
    this.updatedAt = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.loadExpenses(); // Reload expenses without any filters
  }

  private setupSearchDebounce(): void {
    this.searchTextSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadExpenses());

    this.searchFilterSubject.subscribe(() => this.loadExpenses());
  }

  search(): void {
    this.loadExpenses();
  }

  searchText(): void {
    this.searchTextSubject.next();
  }

  searchFilters(): void {
    this.searchFilterSubject.next();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
      this.searchKeyword = '';
      this.search();
    }
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.expenseService.getExpensesWithFilters(
      this.searchKeyword || undefined,
      this.amountSearch || undefined,
      this.createdAt || undefined,
      this.updatedAt || undefined,
      this.selectedCategory || undefined,
      this.selectedStatus || undefined
    ).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.filteredExpenses = [...this.expenses]; // Refresh the displayed expenses
        this.isLoading = false;
        this.filterByCreatedAt();
        this.filterByUpdatedAt();
        this.updateCharts();
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
  }

  updateCharts(): void {
    this.updateCategoryChart();
    this.updateStatusChart();
    this.updateTimeChart();
  }

  updateCategoryChart(): void {
    // Group expenses by category
    const categoryMap = new Map<string, number>();

    this.expenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + expense.amount);
    });

    const categories: string[] = [];
    const amounts: number[] = [];

    // Sort categories by total amount (descending)
    Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, amount]) => {
        categories.push(category);
        amounts.push(Number(amount.toFixed(2)));
      });

    // Update chart data
    this.categoryChart.labels = categories;
    this.categoryChart.series = amounts;
  }

  updateStatusChart(): void {
    // Group expenses by status
    const statusMap = new Map<string, number>();

    this.expenses.forEach(expense => {
      const status = expense.status || 'Unknown';
      const currentAmount = statusMap.get(status) || 0;
      statusMap.set(status, currentAmount + expense.amount);
    });

    const statuses: string[] = [];
    const amounts: number[] = [];

    // Sort statuses by total amount (descending)
    Array.from(statusMap.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, amount]) => {
        statuses.push(status);
        amounts.push(Number(amount.toFixed(2)));
      });

    // Update chart data
    this.statusChart.labels = statuses;
    this.statusChart.series = amounts;
  }

  updateTimeChart(): void {
    if (this.timeViewMode === 'monthly') {
      this.updateMonthlyTimeChart();
    } else {
      this.updateWeeklyTimeChart();
    }
  }

  updateMonthlyTimeChart(): void {
    // Group expenses by month
    const monthlyMap = new Map<string, number>();

    // Sort expenses by date
    const sortedExpenses = [...this.expenses].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group by month
    sortedExpenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const monthYear = this.datePipe.transform(date, 'MMM yyyy') || 'Unknown';
      const currentAmount = monthlyMap.get(monthYear) || 0;
      monthlyMap.set(monthYear, currentAmount + expense.amount);
    });

    const months: string[] = [];
    const amounts: number[] = [];

    // Preserve chronological order
    Array.from(monthlyMap.entries())
      .forEach(([month, amount]) => {
        months.push(month);
        amounts.push(Number(amount.toFixed(2)));
      });

    // Update chart data
    this.timeChart.xaxis = {
      categories: months,
      type: 'category',
      labels: {
        style: {
          cssClass: 'grey--text lighten-2--text fill-color',
        },
      },
    };

    this.timeChart.series = [
      {
        name: 'Monthly Expenses',
        data: amounts,
        color: '#0085db',
      }
    ];
  }

  updateWeeklyTimeChart(): void {
    // Group expenses by week
    const weeklyMap = new Map<string, number>();

    // Sort expenses by date
    const sortedExpenses = [...this.expenses].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group by week
    sortedExpenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

      const weekStart = this.datePipe.transform(startOfWeek, 'MMM d') || '';
      const weekEnd = this.datePipe.transform(new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy') || '';
      const weekLabel = `${weekStart} - ${weekEnd}`;

      const currentAmount = weeklyMap.get(weekLabel) || 0;
      weeklyMap.set(weekLabel, currentAmount + expense.amount);
    });

    const weeks: string[] = [];
    const amounts: number[] = [];

    // Preserve chronological order
    Array.from(weeklyMap.entries())
      .forEach(([week, amount]) => {
        weeks.push(week);
        amounts.push(Number(amount.toFixed(2)));
      });

    // Update chart data
    this.timeChart.xaxis = {
      categories: weeks,
      type: 'category',
      labels: {
        style: {
          cssClass: 'grey--text lighten-2--text fill-color',
        },
        rotate: -45,
        rotateAlways: true,
      },
    };

    this.timeChart.series = [
      {
        name: 'Weekly Expenses',
        data: amounts,
        color: '#fb977d',
      }
    ];
  }

  toggleTimeViewMode(): void {
    this.timeViewMode = this.timeViewMode === 'monthly' ? 'weekly' : 'monthly';
    this.updateTimeChart();
  }

  refreshCharts(): void {
    this.updateCharts();
  }

  exportChartData(chartType: 'category' | 'status' | 'time'): void {
    let data: any = {};
    let filename = '';

    switch(chartType) {
      case 'category':
        data = this.prepareCategoryExportData();
        filename = 'expenses_by_category';
        break;
      case 'status':
        data = this.prepareStatusExportData();
        filename = 'expenses_by_status';
        break;
      case 'time':
        data = this.prepareTimeExportData();
        filename = `expenses_by_${this.timeViewMode}_period`;
        break;
    }

    this.downloadCSV(data, filename);
  }

  prepareCategoryExportData(): any[] {
    const result: any[] = [];

    // Get data from chart
    const categories = this.categoryChart.labels || [];
    const amounts = this.categoryChart.series || [];

    for (let i = 0; i < categories.length; i++) {
      result.push({
        Category: categories[i],
        Amount: amounts[i]
      });
    }

    return result;
  }

  prepareStatusExportData(): any[] {
    const result: any[] = [];

    // Get data from chart
    const statuses = this.statusChart.labels || [];
    const amounts = this.statusChart.series || [];

    for (let i = 0; i < statuses.length; i++) {
      result.push({
        Status: statuses[i],
        Amount: amounts[i]
      });
    }

    return result;
  }

  prepareTimeExportData(): any[] {
    const result: any[] = [];

    // Get data from chart
    const periods = this.timeChart.xaxis?.categories || [];
    const amounts = this.timeChart.series?.[0]?.data || [];

    for (let i = 0; i < periods.length; i++) {
      const periodLabel = this.timeViewMode === 'monthly' ? 'Month' : 'Week';

      const entry: any = {};
      entry[periodLabel] = periods[i];
      entry['Amount'] = amounts[i];

      result.push(entry);
    }

    return result;
  }

  downloadCSV(data: any[], filename: string): void {
    if (data.length === 0) {
      this.toastr.warning('No data to export', 'Warning');
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle values with commas by quoting them
        const value = String(item[header]);
        return value.includes(',') ? `"${value}"` : value;
      });
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter by createdAt
  filterByCreatedAt(): void {
    if (!this.createdAt) {
      // If createdAt is empty, reset to all expenses (but apply updatedAt filter if applicable)
      this.filteredExpenses = [...this.expenses];
      this.filterByUpdatedAt(); // Reapply updatedAt filter
      return;
    }

    const filterDate = new Date(this.createdAt);
    this.filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
      // Compare year, month, and day for exact match
      return (
        expenseDate.getFullYear() === filterDate.getFullYear() &&
        expenseDate.getMonth() === filterDate.getMonth() &&
        expenseDate.getDate() === filterDate.getDate()
      );
    });

    // Reapply updatedAt filter to ensure both filters are respected
    this.filterByUpdatedAt();
  }

  // Filter by updatedAt
  // expense.component.ts
  displayedColumns = ['description', 'amount', 'createdAt', 'category', 'updatedAt', 'status', 'actions'];
  filterByUpdatedAt(): void {
    if (!this.updatedAt) {
      // If updatedAt is empty, keep the current filteredExpenses (already filtered by createdAt if applicable)
      return;
    }

    const filterDate = new Date(this.updatedAt);
    this.filteredExpenses = this.filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.updatedAt);
      // Compare year, month, and day for exact match
      return (
        expenseDate.getFullYear() === filterDate.getFullYear() &&
        expenseDate.getMonth() === filterDate.getMonth() &&
        expenseDate.getDate() === filterDate.getDate()
      );
    });
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'No expenses found';
      this.expenses = [];
      this.filteredExpenses = [];
    } else {
      this.errorMessage = 'An error occurred while fetching expenses';
      this.toastr.error('Failed to load expenses', 'Error', { timeOut: 4000, progressBar: true });
    }
  }

  setExpenseToDelete(expenseId?: number): void {
    this.expenseToDeleteId = expenseId;
  }

  confirmDeleteExpense(): void {
    if (this.expenseToDeleteId === undefined) return;

    this.expenseService.deleteExpense(this.expenseToDeleteId).subscribe({
      next: () => {
        this.toastr.success('Expense deleted successfully!', 'Success', { timeOut: 2000, progressBar: true });
        this.expenseToDeleteId = undefined;
        this.loadExpenses();
      },
      error: (error) => {
        this.toastr.error('Failed to delete expense', 'Error', { timeOut: 4000, progressBar: true });
        console.error('Delete error:', error);
      },
    });
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  private applySort(): void {
    if (!this.sortColumn) return;

    this.filteredExpenses.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof Expense];
      const valueB = b[this.sortColumn as keyof Expense];

      if (['amount'].includes(this.sortColumn)) {
        return this.sortDirection === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }
      if (['createdAt', 'updatedAt'].includes(this.sortColumn)) {
        const dateA = new Date(valueA as string).getTime();
        const dateB = new Date(valueB as string).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      const comparison = String(valueA).localeCompare(String(valueB), undefined, { sensitivity: 'base' });
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
