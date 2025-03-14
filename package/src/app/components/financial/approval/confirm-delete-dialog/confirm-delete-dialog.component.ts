import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [FormsModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss'
})
export class ConfirmDeleteDialogComponent {
  performedBy: string = '';
  private router: Router;

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onConfirm() {
    if (this.performedBy.trim()) {
      this.dialogRef.close(this.performedBy);
      this.dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/approval']);
      });
    } else {
      alert('Please enter a valid "Performed By" value.');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
