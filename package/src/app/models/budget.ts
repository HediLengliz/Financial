export interface Budget {
  id?: number;
  projectName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  createdAt: string;  // Date as string (ISO format)
  updatedAt: string;
  status: any;
  transaction: "Failed" | "Success" | "Pending"; // Adjust based on your model
  approval: "PENDING" | "APPROVED" | "REJECTED";
  currency: string;
  budgetStatus: "Sufficient" | "Insufficient" | "Exceeded";
  projectId: string; // UUID as string

}

