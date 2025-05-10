import { Component, Inject } from '@angular/core';
import { Approval } from '../../../../models/approval';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApprovalService } from '../../../../services/approval.service';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-approval-details',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    NgForOf,
  ],
  templateUrl: './approval-details.component.html',
  styleUrl: './approval-details.component.scss',
})
export class ApprovalDetailsComponent {
  newStatus: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { approval: Approval },
    private dialogRef: MatDialogRef<ApprovalDetailsComponent>,
    private approvalService: ApprovalService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.newStatus = data.approval.status; // Initialize with current status
  }

  updateStatus() {
    const approvalId = this.data.approval.id;
    const updatedStatus = this.newStatus;

    this.approvalService.updateStatus(approvalId, updatedStatus).subscribe({
      next: (response) => {
        console.log('Status updated successfully', response);
        this.dialogRef.close(true);
        this.dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/approval']).then(success => {
            if (!success) {
              console.error('Navigation to /approval failed');
            }
          }).catch(error => {
            console.error('Error during navigation:', error);
          });
        });
      },
      error: (error) => {
        console.error('Error updating status', error);
        alert('Failed to update status. Please try again.');
      },
    });
  }

  confirmSafeDelete() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const approvalId = this.data.approval.id;
        const performedBy = result; // Get the performedBy value from the dialog

        this.approvalService.softDelete(approvalId, performedBy).subscribe({
          next: (response) => {
            console.log('Approval soft-deleted successfully', response);
            this.dialogRef.close(true);
            this.dialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/approval']).then(success => {
                if (!success) {
                  console.error('Navigation to /approval failed');
                }
              }).catch(error => {
                console.error('Error during navigation:', error);
              });
            });
          },
          error: (error) => {
            console.error('Error soft-deleting approval', error);
            alert('Failed to delete approval. Please try again or contact support.');
          },
        });
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/approval']).then(success => {
        if (!success) {
          console.error('Navigation to /approval failed');
        }
      }).catch(error => {
        console.error('Error during navigation:', error);
      });
    });
  }

  // Determine badge color based on action
  getActionColor(action: string): string {
    switch (action.toUpperCase()) {
      case 'CREATED':
        return 'primary'; // Blue
      case 'APPROVED':
      case 'MANAGER_APPROVED':
        return 'success'; // Green
      case 'REJECTED':
        return 'danger'; // Red
      case 'DELETED':
        return 'warning'; // Yellow
      default:
        return 'secondary'; // Gray
    }
  }
}
