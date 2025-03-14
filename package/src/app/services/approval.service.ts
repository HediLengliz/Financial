import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Approval} from "../models/approval";
@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiGatewayUrl = 'http://localhost:8080/financial/approvals';
  private approvalsSubject = new BehaviorSubject<Approval[]>([]);
  approvals$ = this.approvalsSubject.asObservable();
  constructor(private http: HttpClient) {
    this.loadApprovals();
  }
  private loadApprovals() {
    this.getAllApprovals().subscribe(approvals => {
      this.approvalsSubject.next(approvals);
    });
  }
  // Request approval for an expense, invoice, or project
  // Request a new approval
  requestApproval(expenseId?: number, invoiceId?: number, projectId?: string, managerId?: string): Observable<Approval> {
    let params = new HttpParams();
    if (expenseId) params = params.set('expenseId', expenseId.toString());
    if (invoiceId) params = params.set('invoiceId', invoiceId.toString());
    if (projectId) params = params.set('projectId', projectId);
    if (managerId) params = params.set('managerId', managerId);
    return this.http.post<Approval>(`${this.apiGatewayUrl}/request`, null, { params });
  }

  // Approve as manager
  approveByManager(approvalId: number, managerId: string): Observable<any> {
    return this.http.put(`${this.apiGatewayUrl}/${approvalId}/manager-approve`, null, {
      params: { managerId }
    });
  }
  // Approve as finance team
  approveByFinance(approvalId: number, financeTeamId: string): Observable<Approval> {
    const params = new HttpParams().set('financeTeamId', financeTeamId);
    return this.http.put<Approval>(`${this.apiGatewayUrl}/${approvalId}/finance-approve`, null, { params });
  }

  // Fetch all approvals
  getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.apiGatewayUrl);
  }

  // Check if fully approved
  isFullyApproved(approvalId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiGatewayUrl}/${approvalId}/status`);
  }
  // Fetch a single approval by ID
  getApprovalById(approvalId: number): Observable<any> {
    return this.http.get(`${this.apiGatewayUrl}/${approvalId}`);
  }
  updateStatus(approvalId: number, newStatus: string): Observable<any> {
    const url = `${this.apiGatewayUrl}/${approvalId}/status`;
    const params = new HttpParams().set('approvalStatus', newStatus);
    return this.http.put(url, null, { params });
  }
  softDelete(approvalId: number, performedBy: string): Observable<any> {
    const url = `${this.apiGatewayUrl}/${approvalId}/soft-delete`;
    const params = new HttpParams().set('performedBy', performedBy);
    return this.http.put(url, null, { params }).pipe(
      tap(() => this.loadApprovals()) // Refresh approvals after successful delete
    );
  }
}
