import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-finance-approval-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './finance-approval-form.component.html',
  styleUrl: './finance-approval-form.component.scss'
})
export class FinanceApprovalFormComponent  implements OnInit{
  approvalId: number | null = null;
  financeTeamId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const approvalIdParam = this.route.snapshot.paramMap.get('approvalId');
    this.approvalId = approvalIdParam ? +approvalIdParam : null;
  }

  submitForm(): void {
    if (this.approvalId && this.financeTeamId) {
      this.router.navigate(['/finance-approve', this.approvalId, this.financeTeamId]);
    } else {
      console.error('Approval ID or Finance Team ID is missing');
    }
  }
}
