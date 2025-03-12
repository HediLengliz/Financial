export interface Invoice {
  id?:number;
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
  approvalStatus: 'APPROVED' |'PENDING'|'REJECTED';
  project_id : number;
}
