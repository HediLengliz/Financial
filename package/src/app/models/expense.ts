export interface Expense {
  id?: number;
  description: string;
  amount: number;
  updatedAt: string;
  createdAt : string;
  bugdetId: number;
  category: string;
  projectId: string;
  // supplierId: string;
  status: 'Active'| ' Closed'| 'Adjusted'| 'Cancelled';
}
