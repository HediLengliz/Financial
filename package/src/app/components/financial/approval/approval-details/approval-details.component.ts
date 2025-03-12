import {Component, Inject} from '@angular/core';
import {Approval} from "../../../../models/approval";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {ApprovalService} from "../../../../services/approval.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-approval-details',
  imports: [
    FormsModule
  ],
  templateUrl: './approval-details.component.html',
  styleUrl: './approval-details.component.scss'
})
export class ApprovalDetailsComponent {
  newStatus: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { approval: any },
    private dialogRef: MatDialogRef<ApprovalDetailsComponent>,
    private approvalService: ApprovalService,
    private  router: Router,
  ) {
    this.newStatus = data.approval.status; // Initialize with current status
  }

  updateStatus() {
    const approvalId = this.data.approval.id;
    const updatedStatus = this.newStatus;

    this.approvalService.updateStatus(approvalId, updatedStatus).subscribe({
      next: (response) => {
        console.log('Status updated successfully', response);
        this.dialogRef.close(true); // Close the modal
        this.dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/approval'])
            .then(success => {
              if (!success) {
                console.error('Navigation to /approval failed');
              }
            })
            .catch(error => {
              console.error('Error during navigation:', error);
            });
        });
      },
      error: (error) => {
        console.error('Error updating status', error);
      }
    });
  }
  closeModal() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/approval'])
        .then(success => {
          if (!success) {
            console.error('Navigation to /approval failed');
          }
        })
        .catch(error => {
          console.error('Error during navigation:', error);
        });
    });
  }
}
