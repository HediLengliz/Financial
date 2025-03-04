export interface Expense {
  description: string;
  amount: number;
  updatedAt: string;
  date : string;
  bugdetId: number;
  category: string;
  projectId: string;
  supplierId: number;
  status: 'Active'| ' Closed'| 'Adjusted'| 'Cancelled';
}
