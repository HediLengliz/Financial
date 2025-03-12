import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApprovalService} from "../../../../services/approval.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-finance-approval',
  imports: [
    FormsModule
  ],
  templateUrl: './finance-approval.component.html',
  styleUrl: './finance-approval.component.scss'
})
export class FinanceApprovalComponent implements OnInit{
  approvalId: number | null = null;
  financeTeamId: string | null = null;
  additionalInput: string = ''; // Example additional input field

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    const approvalIdParam = this.route.snapshot.paramMap.get('approvalId');
    this.approvalId = approvalIdParam ? +approvalIdParam : null;
    this.financeTeamId = this.route.snapshot.paramMap.get('financeTeamId');
  }

  approve(): void {
    if (this.approvalId && this.financeTeamId) {
      this.approvalService.approveByFinance(this.approvalId, this.financeTeamId).subscribe({
        next: () => this.router.navigate(['/approval']),
        error: (err) => console.error('Error approving by finance:', err)
      });
    } else {
      console.error('Approval ID or Finance Team ID is missing');
    }
  }
}
