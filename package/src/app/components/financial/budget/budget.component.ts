import { Component, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';

import { MatCardModule }          from '@angular/material/card';
import { MatMenuModule }          from '@angular/material/menu';
import { MatIconModule }          from '@angular/material/icon';
import { MatFormFieldModule }     from '@angular/material/form-field';   // ← add
import { MatInputModule }         from '@angular/material/input';         // ← add
import { MatSelectModule }        from '@angular/material/select';        // ← add
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule }        from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import * as XLSX from 'xlsx';

import { Budget }         from '../../../models/budget';
import { BudgetService }  from '../../../services/budget.service';
import { StatusPipe }     from '../../../pipe/status.pipe';
import {NgApexchartsModule} from "ng-apexcharts";
import {MatChip, MatChipsModule} from "@angular/material/chips";
import {MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput} from "@angular/material/datepicker";
import {MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StatusPipe,
    MatSortModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    StatusPipe,
    MatChip,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatNativeDateModule,
  ],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [provideNativeDateAdapter()]
})
export class BudgetComponent implements OnInit {
  dataSource = new MatTableDataSource<Budget>([]);
  displayedColumns = [
    'projectName',
    'amounts',
    'status',
    'transaction',
    'approval',
    'currency',
    'budgetStatus',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  statusOptions = ['Active', 'Closed', 'Adjusted', 'Cancelled'];
  budgetStatusOptions = ['Insufficient', 'Sufficient', 'Exceeded'];
  budgetChart: any = {
    series: [
      { name: 'Allocated', data: [] },
      { name: 'Spent',     data: [] },
      { name: 'Remaining', data: [] },
    ],
    chart: { type: 'bar', height: 250, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#fff'] },
    xaxis: { categories: [] },
    yaxis: { title: { text: 'Amount' } },
    tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
    legend: { position: 'bottom', horizontalAlign: 'center' },
    grid: { borderColor: '#e7e7e7' }
  };
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  budgetToDeleteId?: number;
  searchKeyword: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage?: string;
  sortColumn: string = '';
  amountSearch?: string; // Changed to number to match <input type="number">
  createdAt: string = '';
  updatedAt: string = '';
  selectedTransaction: string = '';
  selectedBudgetStatus: string = '';
  selectedApproval: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  private textSearch$   = new Subject<void>();
  private filterSearch$ = new Subject<void>();
  constructor(private budgetService: BudgetService, private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    // debounce search inputs
    this.textSearch$.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadBudgets());
    this.filterSearch$.subscribe(() => this.loadBudgets());

    // initial load
    this.loadBudgets();
  }
  searchFilters() { this.filterSearch$.next(); }

  clearSearch() {
    this.searchKeyword = '';
    this.createdAt = '';
    this.updatedAt = '';
    this.selectedStatus = '';
    this.loadBudgets();
  }






  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
      this.searchKeyword = '';
      this.search();
    }
  }
  loadBudgets(): void {
    this.isLoading = true;
    this.budgetService.getBudgets(
      this.searchKeyword || undefined,
      this.amountSearch !== undefined ? this.amountSearch.toString() : undefined, // Convert number to string
      this.createdAt || undefined,
      this.updatedAt || undefined,
      this.selectedStatus || undefined,
      this.selectedTransaction || undefined,
      this.selectedBudgetStatus || undefined,
      this.selectedApproval || undefined
    ).subscribe({
      next: (budgets) => {
        this.budgets = budgets;
        this.filteredBudgets = [...this.budgets];
        this.updateTableAndChart(budgets);// Refresh the displayed budgets
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
  }
  // loadBudgets(): void {
  //   this.isLoading = true;
  //   this.budgetService
  //     .getBudgets(
  //       this.searchKeyword || undefined,
  //       this.amountSearch !== undefined ? this.amountSearch.toString() : undefined, // Convert number to string
  //       this.createdAt || undefined,
  //       this.updatedAt || undefined,
  //       this.selectedStatus || undefined,
  //       this.selectedTransaction || undefined,
  //       this.selectedBudgetStatus || undefined,
  //       this.selectedApproval || undefined
  //     )
  //     .subscribe({
  //       next: (budgets) => {
  //         this.budgets = budgets;
  //         this.applyDynamicFilter();
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         this.handleError(error);
  //         this.isLoading = false;
  //       },
  //     });
  // }
  createBudget: any;
  search(): void {
    this.loadBudgets();
  }
  private applyDynamicFilter(): void {
    if (!this.searchKeyword) {
      this.filteredBudgets = [...this.budgets];
    } else {
      const keywordLower = this.searchKeyword.toLowerCase();
      this.filteredBudgets = this.budgets.filter(budget =>
        budget.projectName.toLowerCase().includes(keywordLower)
      );
    }
    this.applySort();
  }
  private updateTableAndChart(budgets: Budget[]) {
    this.dataSource.data = budgets;
    this.budgetChart = {
      series: [
        { name: 'Allocated', data: budgets.map(b => b.allocatedAmount), color: '#0085db' },
        { name: 'Spent',     data: budgets.map(b => b.spentAmount),    color: '#fb977d' },
        { name: 'Remaining', data: budgets.map(b => b.remainingAmount) }
      ],
      chart: {
        type: 'bar',
        height: 390,
        offsetY: 10,
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 4,
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      grid: { borderColor: 'rgba(0,0,0,0.1)', strokeDashArray: 3 },
      xaxis: {
        type: 'category',
        categories: budgets.map(b => b.projectName),
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: { style: { colors: '#adb0bb' } }
      },
      yaxis: { title: { text: 'Amount' } },
      stroke: { show: true, width: 5, colors: ['transparent'] },
      tooltip: { theme: 'light' },
      responsive: [
        { breakpoint: 600, options: { plotOptions: { bar: { borderRadius: 3 } } } }
      ]
    };
  }
  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'No budgets found';
      this.budgets = [];
      this.filteredBudgets = [];
    } else {
      this.errorMessage = 'An error occurred while fetching budgets';
      this.toastr.error('Failed to load budgets', 'Error', { timeOut: 4000, progressBar: true });
    }
  }

  setBudgetToDelete(budgetId?: number): void {
    this.budgetToDeleteId = budgetId;
  }

  confirmDeleteBudget(): void {
    if (this.budgetToDeleteId === undefined) return;

    this.budgetService.deleteBudget(this.budgetToDeleteId).subscribe({
      next: () => {
        this.toastr.success('Budget deleted successfully!', 'Success', { timeOut: 2000, progressBar: true });
        this.budgetToDeleteId = undefined;
        this.dataSource.data = this.filteredBudgets;
        this.loadBudgets();
      },
      error: (error) => {
        this.toastr.error('Failed to delete budget', 'Error', { timeOut: 4000, progressBar: true });
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

    this.filteredBudgets.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof Budget];
      const valueB = b[this.sortColumn as keyof Budget];

      if (['allocatedAmount', 'spentAmount', 'remainingAmount'].includes(this.sortColumn)) {
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


  viewDetailsAndForecast(id?: number) {
    if (!id) return;
    this.router.navigate(['/financial/budget', id]);
    this.budgetService.fetchForecast(id).subscribe(
      r => this.toastr.success(`Forecast: ${r.forecast}`),
      _ => this.toastr.error('Forecast failed')
    );

    // Navigate to the details page
    this.router.navigate(['/financial/budget', id]).then(success => {
      if (success) {
        console.log('Navigation to budget details succeeded');
      } else {
        console.log('Navigation to budget details failed');
      }
    }).catch(error => {
      console.error('Error during navigation:', error);
    });

    // Trigger the forecast request
    this.budgetService.fetchForecast(id).subscribe({
      next: (response) => {
        this.toastr.success(`Forecasted Budget: ${response.forecast}`, 'Success', {timeOut: 4000});
      },
      error: (error) => {
        this.toastr.error('Failed to fetch forecast', 'Error', { timeOut: 4000 });
        console.error('Forecast error:', error);
      }
    });
  }

  exportToCSV() {
    const csvData = this.dataSource.data.map(b => ({
      Project:         b.projectName,
      Allocated:       b.allocatedAmount,
      Spent:           b.spentAmount,
      Remaining:       b.remainingAmount,
      CreatedAt:       b.createdAt,
      Status:          b.status,
      BudgetStatus:    b.budgetStatus
    }));
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Budgets');
    XLSX.writeFile(wb, 'budgets.csv');
  }

  private convertToCSV(csvData: {
    ProjectName: string;
    AllocatedAmount: number;
    SpentAmount: number;
    RemainingAmount: number;
    CreatedAt: string;
    Status: any
  }[]) {
    return "";
  }

  getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':    return 'success';
      case 'CLOSED':    return 'primary';
      case 'ADJUSTED':  return 'warning';
      case 'CANCELLED': return 'danger';
      default:          return 'secondary';
    }
  }
  filterOptions = [
    {
      label: 'Status',
      model: this.selectedStatus,
      options: [
        { label: 'All Statuses', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Closed', value: 'Closed' },
        { label: 'Adjusted', value: 'Adjusted' },
        { label: 'Cancelled', value: 'Cancelled' }
      ]
    },
    {
      label: 'Transaction',
      model: this.selectedTransaction,
      options: [
        { label: 'All Transactions', value: '' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Success', value: 'Success' },
        { label: 'Pending', value: 'Pending' }
      ]
    },
    {
      label: 'Budget Status',
      model: this.selectedBudgetStatus,
      options: [
        { label: 'All Budget Statuses', value: '' },
        { label: 'Insufficient', value: 'Insufficient' },
        { label: 'Sufficient', value: 'Sufficient' },
        { label: 'Exceeded', value: 'Exceeded' }
      ]
    },
    {
      label: 'Approval',
      model: this.selectedApproval,
      options: [
        { label: 'All Approvals', value: '' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Rejected', value: 'REJECTED' }
      ]
    }
  ];
}
