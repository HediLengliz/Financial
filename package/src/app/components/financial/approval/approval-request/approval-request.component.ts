import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ApprovalService} from "../../../../services/approval.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-approval-request',
  imports: [
    FormsModule
  ],
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.scss'
})
export class ApprovalRequestComponent implements OnInit{
  expenseId: string = '';
  invoiceId: string = '';
  projectId: string = '';
  managerId: string = '';

  constructor(private approvalService: ApprovalService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const expenseNum = this.expenseId ? parseInt(this.expenseId, 10) : undefined;
    const invoiceNum = this.invoiceId ? parseInt(this.invoiceId, 10) : undefined;
    this.approvalService.requestApproval(expenseNum, invoiceNum, this.projectId, this.managerId).subscribe({
      next: () => {
        this.router.navigate(['/financial/approval']);
        this.resetForm(); // Reset form after successful submission
      },
      error: (err) => {
        console.error('Error requesting approval:', err);
        // Optionally show an error message to the user
      }
    });
  }

  private resetForm(): void {
    this.expenseId = '';
    this.invoiceId = '';
    this.projectId = '';
    this.managerId = '';
  }

  cancelRequest() {
    this.router.navigate(['/financial/approval']);
  }
}
