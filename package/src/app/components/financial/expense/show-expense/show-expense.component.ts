import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgStyle, TitleCasePipe} from "@angular/common";
import {Budget} from "../../../../models/budget";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {BudgetService} from "../../../../services/budget.service";
import {Expense} from "../../../../models/expense";
import {ExpenseService} from "../../../../services/expense.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-show-expense',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NgStyle,
    NgClass,
    RouterOutlet,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './show-expense.component.html',
  styleUrl: './show-expense.component.scss'
})
export class ShowExpenseComponent implements OnInit {
  expense!: Expense;
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
  private toastr: ToastrService

) {}
  viewExpense(expenseId: string) {
    this.showtable = false; // Hide the budget table
    // this.router.navigate(['/show-budget', budgetId]); // Navigate to Show Budget component
  }
  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.expenseService.getExpenseById(expenseId).subscribe({
        next: (expense) => {
          this.expense = expense;
          // Calculate progress (example: based on amount vs. budget)
          this.progress = 75; // Replace with actual calculation if needed
        },
        error: (error) => {
          this.toastr.error('Failed to load expense', 'Error', { timeOut: 4000, progressBar: true });
          console.error('Error loading expense:', error);
        },
      });
    }
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

  calculateProgress(): void {
    const category = this.expense.category;
    const status = this.expense.status;
    const amount = this.expense.amount;

    this.pieChartData = [
      { name: 'Amount', value: amount },
      { name: 'Status', value: status },
      { name: 'Category', value: category }
    ];

    // Calculate the progress percentage
    this.progress = amount;
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'Ative':
        return 'badge-success';
      case 'Closed':
        return 'badge-danger';
      case 'Adjusted':
        return 'badge-warning';
      case 'Cancelled':
        return 'badge-secondary';
      default:
        return 'badge-info';
    }
  }

  goBack() {
    this.router.navigate(['/financial/expense']); // Adjust the route as necessary
  }

}
