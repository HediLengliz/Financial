export interface Payment {
  id?: number;
  email: string;
  amount: number;
  paymentMethod: 'PAYPAL' | 'CARD' | string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  description: string;
  savePaymentInfo: boolean;
  
  // Additional frontend fields (not from backend)
  status?: 'Pending' | 'Completed' | 'Failed' | string;
  createdAt?: string;
  expenseId?: number;
  invoiceId?: number;
  reference?: string;
}
