import { Component, OnInit } from '@angular/core';
import { ApprovalHistoryService } from '../../../services/approval-history.service';
import { ApprovalHistory } from '../../../models/approvalHistory';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-approval-history',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './approval-history.component.html',
  styleUrl: './approval-history.component.scss',
})
export class ApprovalHistoryComponent implements OnInit {
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
      },
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
          const message = error.error || 'An error occurred while restoring the approval';
          alert('Failed to restore approval: ' + message);
        },
      });
    } else {
      alert('Please enter both Approval ID and Performed By');
    }
  }

  goBack() {
    window.history.back();
  }

  // Determine badge color based on action
  getColor(action: string): string {
    switch (action.toUpperCase()) {
      case 'APPROVED':
        return 'success'; // Green
      case 'REJECTED':
        return 'danger'; // Red
      case 'DELETED':
        return 'warning'; // Yellow
      case 'RESTORED':
        return 'primary'; // Blue
      default:
        return 'secondary'; // Gray
    }
  }
}
