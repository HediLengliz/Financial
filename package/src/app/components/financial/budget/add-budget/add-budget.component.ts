import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {BudgetService} from "../../../../services/budget.service";
import {v4, v4 as uuidv4} from 'uuid';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-add-budget',
  imports: [FormsModule,
    RouterLink, MatLabel, MatButton, MatDatepicker, MatFormField, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSelect, MatOption, MatCard, MatCardTitle, MatCardContent,  MatIconModule,

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
    this.budgetService.createBudget(budgetData).subscribe({
      next: () => {
        this.toastr.success('Budget created successfully!', 'Success', { timeOut: 2000, progressBar: true });
        this.budgetService.notifyBudgetUpdated();
        this.router.navigate(['/financial/budget']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Error creating budget', 'Error', { timeOut: 4000, progressBar: true });
        console.error(err);
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
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
}
