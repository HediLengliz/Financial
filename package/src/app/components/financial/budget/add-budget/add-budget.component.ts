import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {BudgetService} from "../../../../services/budget.service";
import {v4, v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-add-budget',
  imports: [ FormsModule,
    RouterLink,

  ],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.scss',
  standalone: true,
})
export class AddBudgetComponent implements OnInit{
  newBudget = {
    projectName: '',
    allocatedAmount: 0,
    spentAmount: 0,
    remainingAmount: 0,
    createdAt: '',
    updatedAt: '',
    status: 'Active',
    currency: 'USD',
    transaction: '',
    approval: '',
    budgetStatus: '',
  };
  constructor(
    private budgetService: BudgetService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    // Initialize createdAt and updatedAt with today’s date
    const today = new Date().toISOString().split('T')[0];
    this.newBudget.createdAt = today;
    this.newBudget.updatedAt = today;
  }
  addBudget(): void {
    const budgetData = {


      projectName: this.newBudget.projectName,
      allocatedAmount: this.newBudget.allocatedAmount,
      spentAmount: this.newBudget.spentAmount,
      remainingAmount: this.newBudget.remainingAmount,
      currency: this.newBudget.currency,
      status: this.newBudget.status,
      createdAt: this.formatDate(this.newBudget.createdAt),
      updatedAt: this.formatDate(this.newBudget.updatedAt),
      projectId: uuidv4(),
      approval: this.newBudget.approval,
      transaction: this.newBudget.transaction,
      budgetStatus: this.newBudget.budgetStatus

    };
    this.budgetService.createBudget(budgetData ).subscribe({
      next: (res) => {
        this.toastr.success('Budget created successfully!', 'Success', {
          timeOut: 2000,
          progressBar: true
        });
        this.router.navigate(['/financial/budget/new']);
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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}/${year}`;
  }
}
