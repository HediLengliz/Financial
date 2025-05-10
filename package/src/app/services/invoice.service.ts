import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {AbstractService} from "./abstract-service";
import {Invoice} from "../models/invoice";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends AbstractService{
  private apiGatewayUrl = 'http://localhost:8080/financial/invoices';
  constructor(protected override http: HttpClient) {
    super(http);
  }
  private invoiceUpdateSource = new Subject<void>();
  invoiceUpdateSource$ = this.invoiceUpdateSource.asObservable();

  notifyInvoiceUpdated() {
    this.invoiceUpdateSource.next();
  }

  getInvoicesWithFilters(
    invoiceNumber?: string,
    totalAmount?: number,
    issueDate?: string | undefined,
    budgetId?: undefined,
    status?: "Active" | "Closed" | "Adjusted" | "Cancelled" | undefined,
    tax?: undefined,
    dueDate?: string | undefined,
    createdAt?: undefined,
    issuedBy?: undefined,
    issuedTo?: undefined,
    amount?: undefined,
    approvalStatus?: undefined,
    projectId?: undefined
  ): Observable<Invoice[]> {
    let params = new HttpParams();

    // Add filters to query parameters if provided
    if (invoiceNumber) params = params.set('invoiceNumber', invoiceNumber);
    if (totalAmount !== undefined && totalAmount !== null) params = params.set('totalAmount', totalAmount.toString());
    if (issueDate) params = params.set('issueDate', issueDate);
    if (budgetId !== undefined) params = params.set('budgetId', budgetId);
    if (status) params = params.set('status', status);
    if (tax !== undefined) params = params.set('tax', tax);
    if (dueDate) params = params.set('dueDate', dueDate);
    if (createdAt) params = params.set('created_at', createdAt);
    if (issuedBy) params = params.set('issued_by', issuedBy);
    if (issuedTo) params = params.set('issued_to', issuedTo);
    if (amount !== undefined) params = params.set('amount', amount);
    if (approvalStatus) params = params.set('approvalStatus', approvalStatus);
    if (projectId !== undefined) params = params.set('project_id', projectId);

    return this.http.get<Invoice[]>(`${this.apiGatewayUrl}/load-with-filters`, { params });
  }
  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.apiGatewayUrl}/delete/${id}`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiGatewayUrl}/get/${id}`);
  }
  createInvoice(invoiceData: any): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiGatewayUrl}/create`, invoiceData);
  }
  updateInvoice(id: number, invoiceData: any): Observable<Invoice> {
    if (!id) {
      throw new Error('Invoice ID must not be null');
    }
    return this.http.put<Invoice>(`${this.apiGatewayUrl}/update/${id}`, invoiceData);
  }
  exportAsPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiGatewayUrl}/export/pdf/${id}`, { responseType: 'blob' });
  }
  exportAsExcel(id: string): Observable<Blob> {
    return this.http.get(`${this.apiGatewayUrl}/export/excel/${id}`, { responseType: 'blob' });
  }
  getAllInvoicesPdfQrCode(): Observable<Blob> {
    return this.http.get(`${this.apiGatewayUrl}/all/pdf/qrcode`, {
      responseType: 'blob'
    });
  }
}
