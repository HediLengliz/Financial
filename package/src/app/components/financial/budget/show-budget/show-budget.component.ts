import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgCircleProgressModule } from "ng-circle-progress";
import { BudgetService } from "../../../../services/budget.service";
import { Budget } from "../../../../models/budget";

@Component({
  selector: 'app-show-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgCircleProgressModule,
    RouterOutlet,
  ],
  templateUrl: './show-budget.component.html',
  styleUrls: ['./show-budget.component.scss'] // Fixed typo (styleUrl to styleUrls)
})
export class ShowBudgetComponent implements OnInit {
  showtable: boolean = true;
  budget!: Budget; // No need for @Input() here
  pieChartData: any[] = [];
  colorScheme = {
    domain: ['#78C000', '#C7E596']
  };
  progress: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private budgetService: BudgetService
  ) {}
  viewBudget(budgetId: string) {
    this.showtable = false; // Hide the budget table
    // this.router.navigate(['/show-budget', budgetId]); // Navigate to Show Budget component
  }
  ngOnInit(): void {
    // Retrieve the budget ID from the route parameters
    const budgetId = this.route.snapshot.paramMap.get('id');
    if (budgetId) {
      this.loadBudget(budgetId); // Call loadBudget with the ID
    }
  }

  loadBudget(id: string): void {
    this.budgetService.getBudgetById(id).subscribe(
      (data) => {
        this.budget = data;
        this.calculateProgress(); // Call calculateProgress after loading the budget
      },
      (error) => {
        console.error('Error fetching budget:', error);
      }
    );
  }

  calculateProgress(): void {
    const spent = this.budget.spentAmount;
    const allocated = this.budget.allocatedAmount;
    const remaining = allocated - spent;

    this.pieChartData = [
      { name: 'Spent', value: spent },
      { name: 'Remaining', value: remaining }
    ];

    // Calculate the progress percentage
    this.progress = allocated > 0 ? (spent / allocated) * 100 : 0;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  goBack() {
    this.router.navigate(['/budget-management']); // Adjust the route as necessary
  }
}
