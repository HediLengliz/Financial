import { Component } from '@angular/core';
import {ApprovalService} from "../../../services/approval.service";
import {ApprovalHistory} from "../../../models/approvalHistory";
import {ApprovalHistoryService} from "../../../services/approval-history.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-approval-history',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './approval-history.component.html',
  styleUrl: './approval-history.component.scss'
})
export class ApprovalHistoryComponent {
  histories: ApprovalHistory[] = [];
  approvalIdToRestore: number | null = null;
  performedBy: string = '';

  constructor(private approvalHistoryService: ApprovalHistoryService) {}

  ngOnInit() {
    this.loadHistories();
  }

  loadHistories() {
    this.approvalHistoryService.getAllHistories().subscribe({
      next: (data) => {
        this.histories = data;
      },
      error: (error) => {
        console.error('Error fetching histories', error);
        alert('Failed to load approval history');
      }
    });
  }

  restoreApproval() {
    if (this.approvalIdToRestore && this.performedBy) {
      this.approvalHistoryService.restoreApproval(this.approvalIdToRestore, this.performedBy).subscribe({
        next: () => {
          alert('Approval restored successfully');
          this.loadHistories(); // Refresh the history list
          this.approvalIdToRestore = null; // Clear inputs
          this.performedBy = '';
        },
        error: (error) => {
          console.error('Error restoring approval', error);
          // Display error message from backend (e.g., "Approval is not deleted")
          const message = error.error || 'An error occurred while restoring the approval';
          alert('Failed to restore approval: ' + message);
        }
      });
    } else {
      alert('Please enter both Approval ID and Performed By');
    }
  }

  goBack() {
    window.history.back();
  }
}
