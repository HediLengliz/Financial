// src/app/models/approval.model.ts
import {ApprovalHistory} from "./approvalHistory";

export interface Approval {
  id: number;
  status: string; // e.g., 'PENDING', 'MANAGER_APPROVED', 'APPROVED'
  expenseId: number; // Optional, links to an expense if applicable
  invoiceId: number; // Optional, links to an invoice if applicable
  projectId: string;
  managerApprovalBy?: string; // Optional, ID of the manager who approved
  financeApprovalBy: string; // Optional, ID of the finance team member who approved
  requestedAt: string; // ISO date string, e.g., '2023-10-15T10:00:00Z'
  approvedAt: string; // ISO date string, optional as it’s set after approval
  approvalHistories: ApprovalHistory[]; // Array of history records

}
