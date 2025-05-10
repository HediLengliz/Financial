import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProjectComponent } from './components/project/project.component';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { ShowProjectComponent } from './components/project/show-project/show-project.component';
import { EditProjectComponent } from './components/project/edit-project/edit-project.component';
import { BudgetComponent } from './components/financial/budget/budget.component';
import { FinancialComponent } from './components/financial/financial.component';
import { ExpenseComponent } from './components/financial/expense/expense.component';
import { ApprovalComponent } from './components/financial/approval/approval.component';
import { InvoiceComponent } from './components/financial/invoice/invoice.component';
import { AddBudgetComponent } from './components/financial/budget/add-budget/add-budget.component';
import { ShowBudgetComponent } from './components/financial/budget/show-budget/show-budget.component';
import { EditBudgetComponent } from './components/financial/budget/edit-budget/edit-budget.component';
import { AddExpenseComponent } from './components/financial/expense/add-expense/add-expense.component';
import { ShowExpenseComponent } from './components/financial/expense/show-expense/show-expense.component';
import { EditExpenseComponent } from './components/financial/expense/edit-expense/edit-expense.component';
import { AddInvoiceComponent } from './components/financial/invoice/add-invoice/add-invoice.component';
import { EditInvoiceComponent } from './components/financial/invoice/edit-invoice/edit-invoice.component';
import { ShowInvoiceComponent } from './components/financial/invoice/show-invoice/show-invoice.component';
// import { ManagerApprovalComponent } from './components/financial/approval/manager-approval/manager-approval.component';
import { ApprovalRequestComponent } from './components/financial/approval/approval-request/approval-request.component';
import { FinanceApprovalComponent } from './components/financial/approval/finance-approval/finance-approval.component';
import {
  FinanceApprovalFormComponent
} from "./components/financial/approval/finance-approval-form/finance-approval-form.component";
import {ApprovalHistoryComponent} from "./components/financial/approval-history/approval-history.component";
import {PaymentComponent} from "./components/payment/payment.component";
// import {
//   ApprovalDashboardComponent
// } from "./components/financial/approval/approval-dashbaord/approval-dashboard.component";

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // Default redirect
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },

      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },

      // Projects Section
      {
        path: 'projects',
        children: [
          { path: '', component: ProjectComponent },
          { path: 'new', component: AddProjectComponent },
          { path: ':id', component: ShowProjectComponent },
          { path: 'edit/:id', component: EditProjectComponent },
        ],
      },

      {
        path: 'financial',
        component: FinancialComponent,
        children: [
          { path: 'payment', component: PaymentComponent},
          { path: 'budget', component: BudgetComponent, children: [
              { path: 'new', component: AddBudgetComponent },
              { path: ':id', component: ShowBudgetComponent },
              { path: 'edit/:id', component: EditBudgetComponent },
            ]},
          { path: 'expense', component: ExpenseComponent, children: [
              { path: 'new', component: AddExpenseComponent },
              { path: ':id', component: ShowExpenseComponent },
              { path: 'edit/:id', component: EditExpenseComponent },
            ]},
          { path: 'invoice', component: InvoiceComponent, children: [
              { path: 'new', component: AddInvoiceComponent },
              { path: 'edit/:id', component: EditInvoiceComponent },
              { path: ':id', component: ShowInvoiceComponent },
            ]},
          {
            path: 'approval',
            component: ApprovalComponent,
            children: [
              // { path: 'Dash', component: ApprovalDashboardComponent },
              // { path: ':approvalId/manager-approve', component: ManagerApprovalComponent },
              // { path: ':approvalId/finance-approve', component: FinanceApprovalComponent },
              {path: 'history', component: ApprovalHistoryComponent},
              { path: 'request', component: ApprovalRequestComponent },
              { path: 'finance-approve/:approvalId/:financeTeamId', component: FinanceApprovalComponent },
              { path: 'finance-approval-form/:approvalId', component: FinanceApprovalFormComponent },


            ],
          },
        ],
      },

      // UI Components
      {
        path: 'ui-components',
        loadChildren: () => import('./pages/ui-components/ui-components.routes').then((m) => m.UiComponentsRoutes),
      },

      // Extra Pages
      {
        path: 'extra',
        loadChildren: () => import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },

  // Authentication Layout (Blank)
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },
    ],
  },

  // Wildcard Route (Must be last)
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
