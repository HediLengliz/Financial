import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Budget } from "../../../../models/budget";
import { BudgetService } from "../../../../services/budget.service";
import { ToastrService } from "ngx-toastr";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-edit-budget',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, MatIconModule, MatDatepicker, MatButton, MatFormField, MatDatepickerInput, MatDatepickerToggle, MatInput, MatSelect, MatOption, MatCardContent, MatCardTitle, MatCard ,MatLabel],
  templateUrl: './edit-budget.component.html',
  styleUrl: './edit-budget.component.scss'
})
export class EditBudgetComponent {
  budget: Budget = {
    projectName: '',
    allocatedAmount: 0,
    spentAmount: 0,
    remainingAmount: 0,
    createdAt: new Date().toLocaleDateString('en-US'),
    updatedAt: new Date().toLocaleDateString('en-US'),
    status: 'ACTIVE',
    transaction: 'Pending',
    approval: 'PENDING',
    currency: 'USD',
    budgetStatus: 'Sufficient',
    projectId: '',
  };
  id: string | null = null;

  constructor(
    private budgetService: BudgetService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadBudget();
    }
  }
  goBack() {
    this.router.navigate(['/financial/budget']); // Adjust the route as necessary
  }

  private loadBudget(): void {
    this.budgetService.getBudgetById(this.id!).subscribe({
      next: (budget) => {
        this.budget = budget;
      },
      error: (err) => this.handleError('Failed to load budget', err)
    });
  }

  updateBudget(): void {
    if (!this.id){
      return;
    }

    this.budgetService.updateBudget(this.id, this.budget).subscribe({
      next: () => {
        this.toastr.success('Budget updated successfully!');
        this.budgetService.notifyBudgetUpdated(); // Notify the update
        this.router.navigate(['/financial/budget']);
      },
      error: (err) => {
        if (err.status === 422 && err.error.message) {
          this.handleValidationErrors(err.error.message);
        } else {
          this.handleError('Error updating budget', err);
        }
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

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    this.toastr.error(`${context}. Please try again.`, 'Error', {
      timeOut: 4000,
      progressBar: true
    });
  }
}
