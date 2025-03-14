import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from '../../../models/budget';
import { StatusPipe } from '../../../pipe/status.pipe';
import { BudgetService } from '../../../services/budget.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    StatusPipe,
  ],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit {
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
  private searchTextSubject = new Subject<void>();
  private searchFilterSubject = new Subject<void>();

  constructor(private budgetService: BudgetService, private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadBudgets();
    // Subscribe to budget updates
    this.budgetService.budgetUpdated$.subscribe(() => {
      this.loadBudgets(); // Reload budgets when notified
    });
  }
  clearSearch(): void {
    this.searchKeyword = '';
    this.amountSearch = undefined; // Clear the amount search as well
    this.createdAt = '';
    this.updatedAt = '';
    this.selectedStatus = '';
    this.selectedTransaction = '';
    this.selectedBudgetStatus = '';
    this.selectedApproval = '';
    this.loadBudgets(); // Reload budgets without any filters
  }
  private setupSearchDebounce(): void {
    this.searchTextSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadBudgets());

    this.searchFilterSubject.subscribe(() => this.loadBudgets());
  }

  search(): void {
    this.loadBudgets();
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
        this.filteredBudgets = [...this.budgets]; // Refresh the displayed budgets
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

  viewDetailsAndForecast(id: number | undefined): void {
    // Check if id is undefined
    if (id === undefined) {
      console.error('Budget ID is undefined');
      this.toastr.error('Cannot fetch forecast without a valid ID', 'Error');
      return;
    }

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
}
