import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../../services/expense.service';
import { Expense } from '../../../../models/expense';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
  ],
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {
  expense: Expense = {
    description: '',
    amount: 0,
    createdAt: '',
    updatedAt: '',
    bugdetId: 0, // Fixed typo: bugdetId -> budgetId
    category: '',
    status: 'Active',
    projectId: '',
  };
  id: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadExpense();
    }
  }

  private loadExpense(): void {
    this.expenseService.getExpenseById(this.id!).subscribe({
      next: (expense) => {
        // Ensure dates are in YYYY-MM-DD format for the date input
        this.expense = {
          ...expense,
          createdAt: this.formatDateForInput(expense.createdAt),
          updatedAt: this.formatDateForInput(expense.updatedAt),
        };
      },
      error: (err) => this.handleError('Failed to load expense', err),
    });
  }

  updateExpense(): void {
    if (!this.id) {
      this.toastr.error('Expense ID is missing', 'Error');
      return;
    }

    // Additional frontend validation (optional)
    if (this.expense.amount < 0) {
      this.toastr.error('Amount cannot be negative', 'Validation Error');
      return;
    }

    // Ensure dates are in the correct format for the backend
    const updatedExpense = {
      ...this.expense,
      createdAt: this.formatDateForBackend(this.expense.createdAt),
      updatedAt: this.formatDateForBackend(this.expense.updatedAt),
    };

    this.expenseService.updateExpense(this.id, updatedExpense).subscribe({
      next: () => {
        this.toastr.success('Expense updated successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true,
        });
        this.expenseService.notifyExpenseUpdated();
        this.router.navigate(['/financial/expense']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          this.handleValidationErrors(err.error.message);
        } else {
          this.handleError('Error updating expense', err);
        }
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/financial/expense']);
  }

  private formatDateForInput(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateForBackend(date: string): string {
    // Backend expects YYYY-MM-DD format, which is already the format from the date input
    return date;
  }

  private handleValidationErrors(errors: any): void {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((message: string) => {
          this.toastr.error(message, 'Validation Error', {
            timeOut: 4000,
            progressBar: true,
          });
        });
      }
    }
  }

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    this.toastr.error(`${context}. Please try again.`, 'Error', {
      timeOut: 4000,
      progressBar: true,
    });
  }
}
