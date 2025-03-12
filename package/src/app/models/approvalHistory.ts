// src/app/models/approval-history.model.ts
export interface ApprovalHistory {
  id?: number;
  action: string; // e.g., 'Created', 'Manager Approved', 'Finance Approved'
  performedBy: string; // ID or name of the user who performed the action
  timestamp: string; // ISO date string, e.g., '2023-10-15T10:05:00Z'
}
