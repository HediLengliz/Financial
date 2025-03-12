import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Expense } from '../../../models/expense';
import { StatusPipe } from '../../../pipe/status.pipe';
import { ExpenseService } from '../../../services/expense.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    StatusPipe,
  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  expenseToDeleteId?: number;
  searchKeyword: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage?: string;
  sortColumn: string = '';
  amountSearch?: number; // Changed to number to match <input type="number">
  createdAt: string = '';
  updatedAt: string = '';
  selectedCategory: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  private searchTextSubject = new Subject<void>();
  private searchFilterSubject = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private router: Router
  ) {}

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
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
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
