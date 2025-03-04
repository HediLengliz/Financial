import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {BudgetComponent} from "./budget/budget.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {ApprovalComponent} from "./approval/approval.component";
import {ExpenseComponent} from "./expense/expense.component";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
@Component({
  selector: 'app-financial',
  imports: [
    FormsModule,
    RouterOutlet,
    NgIf,
  ],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.scss'
})
export class FinancialComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate(path: string) {
    this.router.navigate([]); // Ensure it navigates within financial
  }

  isChildRoute(): boolean {
    return this.router.url !== '/financial'; // Hides the title if navigating to a child
  }
}
