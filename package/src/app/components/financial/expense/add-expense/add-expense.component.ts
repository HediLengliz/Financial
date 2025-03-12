import {Component, OnInit} from '@angular/core';
import {Expense} from "../../../../models/expense";

import {ExpenseService} from "../../../../services/expense.service";
import {Router, RouterLink} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent implements OnInit{
  newExpense: {
    description: string;
    amount: number;
    updatedAt: string;
    createdAt: string;
    budgetId: number;
    category: string;
    status: string
  } = {
    description: '',
    amount: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString().split('T')[0], // Set to today's date
    budgetId: 0,
    category: '',
    // supplierId: '',
    status: 'Active',
  };
  budgets: any;
  selectedBudgetId: any;
  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.newExpense.createdAt = today;
    this.newExpense.updatedAt = today;
  }
  addExpense(): void {
    const expenseData = {
      description: this.newExpense.description,
      amount: this.newExpense.amount,
      updatedAt: this.newExpense.updatedAt,
      createdAt: this.newExpense.createdAt,
      budgetId: this.newExpense.budgetId,
      category: this.newExpense.category,
      projectId: uuidv4(),
      // supplierId: uuidv4(),
      status: this.newExpense.status,
    };
    this.expenseService.createExpense(expenseData).subscribe({
      next: (res) => {
        this.toastr.success('Expense created successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/financial/expense/new']);
        this.expenseService.notifyExpenseUpdated(); // Notify the creation
        this.router.navigate(['/financial/expense']); // Navigate to budget list

      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          this.handleValidationErrors(err.error.message);
        } else {
          this.toastr.error('Error creating budget: ' + err.message, 'Error', {
            timeOut: 4000,
            progressBar: true
          });
        }
        console.error('Error creating budget:', err);
      }
    });
  }
  private handleValidationErrors(errors: any): void {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errors[key].forEach((message: string) => {
          this.toastr.error(message, 'Validation Error', {
            timeOut: 4000,
            progressBar: true
          });
        });
      }
    }
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as yyyy-MM-dd

  }

  goBack() {
    this.router.navigate(['/financial/expense']);

  }
}
