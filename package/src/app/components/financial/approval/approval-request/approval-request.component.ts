import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApprovalService } from '../../../../services/approval.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-approval-request',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.scss',
})
export class ApprovalRequestComponent implements OnInit {
  expenseId: string = '';
  invoiceId: string = '';
  projectId: string = '';
  managerId: string = '';
  errorMessage: string = ''; // Added to display errors

  constructor(private approvalService: ApprovalService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate required fields
    if (!this.managerId) {
      this.errorMessage = 'Manager ID is required.';
      return;
    }

    const expenseNum = this.expenseId ? parseInt(this.expenseId, 10) : undefined;
    const invoiceNum = this.invoiceId ? parseInt(this.invoiceId, 10) : undefined;

    this.approvalService.requestApproval(expenseNum, invoiceNum, this.projectId, this.managerId).subscribe({
      next: () => {
        this.router.navigate(['/financial/approval']);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error requesting approval:', err);
        this.errorMessage = err.error?.message || 'Failed to request approval. Please try again.';
      },
    });
  }

  private resetForm(): void {
    this.expenseId = '';
    this.invoiceId = '';
    this.projectId = '';
    this.managerId = '';
    this.errorMessage = '';
  }

  cancelRequest() {
    this.router.navigate(['/financial/approval']);
  }
}
