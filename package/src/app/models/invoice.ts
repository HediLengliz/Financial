export interface Invoice {
  invoiceNumber: string;
  totalAmount: number;
  issueDate: string;
  budgetId : number;
  status : 'Active'| ' Closed'| 'Adjusted'| 'Cancelled';
  tax: number;
  dueDate: string;
  created_at : string;
  issued_by : string;
  issued_to : string;
  amount : number;
  project_id : number;
  supplier_id : number;
}
