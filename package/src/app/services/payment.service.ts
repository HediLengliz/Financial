import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, map, catchError, timeout, retry, throwError, of } from 'rxjs';
import { Payment } from '../models/payment';

// Backend payment response/request interface
interface BackendPayment {
  id?: number;
  email: string;
  amount: number;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  description: string;
  savePaymentInfo: boolean;
  // Backend may include additional fields
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Try direct connection to the service
  private apiUrl = 'http://localhost:8080/financial/payments';
  private paymentUpdated = new Subject<void>();
  
  paymentUpdated$ = this.paymentUpdated.asObservable();

  constructor(private http: HttpClient) { }
  
  // Convert backend payment to frontend model
  private toFrontendPayment(backendPayment: BackendPayment): Payment {
    return {
      id: backendPayment.id,
      email: backendPayment.email,
      amount: backendPayment.amount,
      paymentMethod: backendPayment.paymentMethod,
      cardNumber: backendPayment.cardNumber,
      expiryDate: backendPayment.expiryDate,
      cvv: backendPayment.cvv,
      description: backendPayment.description,
      savePaymentInfo: backendPayment.savePaymentInfo,
      status: backendPayment.status || 'Pending',
      createdAt: backendPayment.createdAt
    };
  }
  
  // Convert frontend payment to backend request
  private toBackendPayment(payment: Payment): BackendPayment {
    const backendPayment: BackendPayment = {
      email: payment.email,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod.toUpperCase(), // Backend expects uppercase
      description: payment.description,
      savePaymentInfo: payment.savePaymentInfo
    };
    
    // Only include card details if payment method is CARD
    if (payment.paymentMethod.toUpperCase() === 'CARD') {
      if (payment.cardNumber) backendPayment.cardNumber = payment.cardNumber;
      if (payment.expiryDate) backendPayment.expiryDate = payment.expiryDate;
      if (payment.cvv) backendPayment.cvv = payment.cvv;
    }
    
    // Do not include frontend-only fields in backend request
    
    return backendPayment;
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<BackendPayment[]>(`${this.apiUrl}`).pipe(
      map(payments => payments.map(p => this.toFrontendPayment(p)))
    );
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<BackendPayment>(`${this.apiUrl}/${id}`).pipe(
      map(payment => this.toFrontendPayment(payment))
    );
  }

  getPaymentsByProject(projectId: string): Observable<Payment[]> {
    return this.http.get<BackendPayment[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      map(payments => payments.map(p => this.toFrontendPayment(p)))
    );
  }

  getPaymentsByExpense(expenseId: number): Observable<Payment[]> {
    return this.http.get<BackendPayment[]>(`${this.apiUrl}/expense/${expenseId}`).pipe(
      map(payments => payments.map(p => this.toFrontendPayment(p)))
    );
  }

  getPaymentsByInvoice(invoiceId: number): Observable<Payment[]> {
    return this.http.get<BackendPayment[]>(`${this.apiUrl}/invoice/${invoiceId}`).pipe(
      map(payments => payments.map(p => this.toFrontendPayment(p)))
    );
  }

  // Handle HTTP errors consistently
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    // Network or client-side error
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } 
    // Backend returned unsuccessful response code
    else {
      if (error.status === 0) {
        errorMessage = 'Server is unreachable. Please check your connection or the server status.';
      } else if (error.status === 504) {
        errorMessage = 'Server timeout. The request took too long to process.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    
    console.error('Payment processing error:', errorMessage, error);
    return throwError(() => ({ error, message: errorMessage }));
  }

  processPayment(paymentData: Payment): Observable<any> {
    const backendPayment = this.toBackendPayment(paymentData);
    console.log('Sending payment data:', backendPayment);
    
    // Set headers to ensure proper content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Use any type for response since we might get different response types
    return this.http.post<any>(`${this.apiUrl}/process`, backendPayment, { headers }).pipe(
      // Reduce timeout to prevent long waiting times
      timeout(15000), // 15 seconds timeout
      // Add retry logic with exponential backoff
      retry({ count: 2, delay: (error, retryCount) => {
        // Don't retry for client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }
        // Exponential backoff for other errors
        const delay = retryCount * 1000;
        console.log(`Retrying payment request in ${delay}ms (attempt ${retryCount})...`);
        return of(null).pipe(timeout(delay));
      }}),
      map(response => {
        console.log('Payment response:', response);
        return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  updatePayment(id: number, paymentData: Payment): Observable<Payment> {
    const backendPayment = this.toBackendPayment(paymentData);
    return this.http.put<BackendPayment>(`${this.apiUrl}/${id}`, backendPayment).pipe(
      map(response => this.toFrontendPayment(response)),
      catchError(error => this.handleError(error))
    );
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  notifyPaymentUpdate(): void {
    this.paymentUpdated.next();
  }
}
