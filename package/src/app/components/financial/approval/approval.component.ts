import {Component, OnInit} from '@angular/core';
import {ApprovalService} from "../../../services/approval.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Approval} from "../../../models/approval";
import {ApprovalDetailsComponent} from "./approval-details/approval-details.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-approval',
  standalone: true,

  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ApprovalComponent implements OnInit{
  approvals: Approval[] = [];
  searchTerm = '';
  fullyApprovedCount = 0;
  DeletedCount = 0;
  pendingCount = 0;
  filteredApprovals: Approval[] = [];
  isApproving = false;

  approvalId: number;
  managerId: string;
  loading = false;
  errorMessage: string = '';

  constructor(
    private approvalService: ApprovalService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchApprovals();
    this.refreshApprovals();
    this.approvalService.approvals$.subscribe(approvals => {
      this.approvals = approvals;
    });
  }

  fetchApprovals(): void {
    this.loading = true;
    this.errorMessage = '';
    this.approvalService.getAllApprovals().subscribe({
      next: (data) => {
        this.approvals = data;
        this.filteredApprovals = data; // Initialize filtered approvals
        this.loading = false;
        this.updateCounts(); // Update counts after fetching
      },
      error: (err) => {
        console.error('Error fetching approvals:', err);
        this.errorMessage = 'Failed to load approvals. Please try again later.';
        this.loading = false;
      }
    });
  }
  filterApprovals() {
    const term = this.searchTerm.toLowerCase();
    this.filteredApprovals = this.approvals.filter(approval =>
      approval.id.toString().includes(term) ||
      approval.status.toLowerCase().includes(term)
    );
    this.updateCounts(); // Update counts based on filtered approvals
  }
  updateCounts() {
    this.pendingCount = this.filteredApprovals.filter(a => a.status === 'PENDING').length;
    this.fullyApprovedCount = this.filteredApprovals.filter(a => a.status === 'APPROVED').length;
  }



  openDetails(approval: any) {
    const dialogRef = this.dialog.open(ApprovalDetailsComponent, {
      data: { approval }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshApprovals(); // Refresh list if status was updated
      }
    });
  }

  refreshApprovals() {
    this.loading = true;
    this.approvalService.getAllApprovals().subscribe({
      next: (approvals) => {
        this.filteredApprovals = approvals;
        this.pendingCount = approvals.filter(a => a.status === 'PENDING').length;
        this.fullyApprovedCount = approvals.filter(a => a.status === 'APPROVED').length; // Adjust if 'FULLY_APPROVED' is used
        this.DeletedCount = approvals.filter(a => a.status === 'DELETED').length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error refreshing approvals', error);
        this.errorMessage = 'Failed to refresh approvals.';
        this.loading = false;
      }
    });
  }

  approve(approvalId: number): void {
    if (this.isApproving) return; // Prevent multiple clicks
    this.isApproving = true;

    this.approvalService.getApprovalById(approvalId).pipe(
      switchMap(approval => {
        const managerId = approval.managerApprovalBy;

        if (!managerId) {
          this.errorMessage = 'No manager assigned to this approval.';
          this.isApproving = false; // Reset the state
          return EMPTY; // Exit early if no manager
        }

        return this.approvalService.approveByManager(approvalId, managerId);
      })
    ).subscribe({
      next: () => {
        console.log('Manager approval successful');
        this.fetchApprovals(); // Refresh approvals
        this.refreshApprovals();
        // Navigate to /approval and handle the promise

        this.router.navigate(['/approval']).then(() => {
          console.log('Navigation successful');
        }).catch(err => {
          console.error('Navigation error:', err);
        });

        this.isApproving = false; // Reset the state after navigation logic
      },
      error: (err) => {
        console.error('Error during approval process:', err);
        this.errorMessage = err.error || 'An error occurred during the approval process.';
        this.isApproving = false; // Reset the state on error
      }
    });
  }

  // financeApprove(approvalId: number): void {
  //   const financeTeamId = 'finance456'; // Replace with dynamic value (e.g., from auth) later
  //   this.approvalService.approveByFinance(approvalId, financeTeamId).subscribe({
  //     next: () => {
  //       console.log('Finance approval successful');
  //       this.fetchApprovals(); // Refresh approvals to reflect new status
  //     },
  //     error: (err) => {
  //       console.error('Error approving by finance:', err);
  //       this.errorMessage = err.error || 'An error occurred during finance approval.';
  //     }
  //   });
  // }

  // refreshApprovals(): void {
  //   this.fetchApprovals();
  // }
  navigateToFinanceForm(approvalId: number): void {
    this.router.navigate(['/finance-approval-form', approvalId]);
  }
  goToHistory() {
    this.router.navigate(['/financial/approval/history']);
  }

  requestNewApproval() {
    this.router.navigate(['request'], { relativeTo: this.route });
  }

}
