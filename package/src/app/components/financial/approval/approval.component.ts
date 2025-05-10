import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../../services/approval.service';
import { Approval } from '../../../models/approval';
import { ApprovalDetailsComponent } from './approval-details/approval-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinner, MatSpinner} from '@angular/material/progress-spinner';
import {DatePipe, NgIf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSpinner,
    NgIf,
    DatePipe,
    TitleCasePipe,
    MatProgressSpinner,
  ],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ApprovalComponent implements OnInit {
  approvals: Approval[] = [];
  filteredApprovals: Approval[] = [];
  dataSource = new MatTableDataSource<Approval>([]);
  displayedColumns: string[] = ['id', 'status', 'requestedAt', 'projectId', 'actions'];
  searchTerm = '';
  fullyApprovedCount = 0;
  DeletedCount = 0;
  pendingCount = 0;
  loading = false;
  errorMessage: string = '';
  isApproving = false;

  constructor(
    private approvalService: ApprovalService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchApprovals();
    this.approvalService.approvals$.subscribe((approvals) => {
      this.approvals = approvals;
      this.dataSource.data = this.filteredApprovals;
    });
  }

  fetchApprovals(): void {
    this.loading = true;
    this.errorMessage = '';
    this.approvalService.getAllApprovals().subscribe({
      next: (data) => {
        this.approvals = data;
        this.filteredApprovals = data;
        this.dataSource.data = data; // Set table data
        this.updateCounts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching approvals:', err);
        this.errorMessage = 'Failed to load approvals. Please try again later.';
        this.loading = false;
      },
    });
  }

  filterApprovals() {
    const term = this.searchTerm.toLowerCase();
    this.filteredApprovals = this.approvals.filter(
      (approval) =>
        approval.id.toString().includes(term) ||
        approval.status.toLowerCase().includes(term)
    );
    this.dataSource.data = this.filteredApprovals; // Update table data
    this.updateCounts();
  }

  updateCounts() {
    this.pendingCount = this.filteredApprovals.filter((a) => a.status === 'PENDING').length;
    this.fullyApprovedCount = this.filteredApprovals.filter((a) => a.status === 'APPROVED').length;
    this.DeletedCount = this.filteredApprovals.filter((a) => a.status === 'DELETED').length;
  }

  openDetails(approval: Approval) {
    const dialogRef = this.dialog.open(ApprovalDetailsComponent, {
      data: { approval },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshApprovals();
      }
    });
  }

  refreshApprovals() {
    this.loading = true;
    this.approvalService.getAllApprovals().subscribe({
      next: (approvals) => {
        this.approvals = approvals;
        this.filteredApprovals = approvals;
        this.dataSource.data = approvals;
        this.updateCounts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error refreshing approvals', error);
        this.errorMessage = 'Failed to refresh approvals.';
        this.loading = false;
      },
    });
  }

  approve(approvalId: number): void {
    if (this.isApproving) return;
    this.isApproving = true;

    this.approvalService.getApprovalById(approvalId).pipe(
      switchMap((approval) => {
        const managerId = approval.managerApprovalBy;

        if (!managerId) {
          this.errorMessage = 'No manager assigned to this approval.';
          this.isApproving = false;
          return EMPTY;
        }

        return this.approvalService.approveByManager(approvalId, managerId);
      })
    ).subscribe({
      next: () => {
        console.log('Manager approval successful');
        this.fetchApprovals();
        this.refreshApprovals();
        this.router.navigate(['/approval']).then(() => {
          console.log('Navigation successful');
        }).catch((err) => {
          console.error('Navigation error:', err);
        });
        this.isApproving = false;
      },
      error: (err) => {
        console.error('Error during approval process:', err);
        this.errorMessage = err.error || 'An error occurred during the approval process.';
        this.isApproving = false;
      },
    });
  }

  navigateToFinanceForm(approvalId: number): void {
    this.router.navigate(['/finance-approval-form', approvalId]);
  }

  goToHistory() {
    this.router.navigate(['/financial/approval/history']);
  }

  requestNewApproval() {
    this.router.navigate(['request'], { relativeTo: this.route });
  }

  // Determine status color for styling
  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'MANAGER_APPROVED':
        return 'primary';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'DELETED':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
