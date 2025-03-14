import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApprovalHistory} from "../models/approvalHistory";

@Injectable({
  providedIn: 'root'
})
export class ApprovalHistoryService {
  private historyApiUrl = 'http://localhost:8080/financial/approval-history';
  constructor(private http: HttpClient) {}
  getAllHistories(): Observable<ApprovalHistory[]> {
    return this.http.get<ApprovalHistory[]>(`${this.historyApiUrl}/histories`);
  }

  // Restore a deleted approval
  restoreApproval(approval_id: number, performedBy: string): Observable<any> {
    const url = `${this.historyApiUrl}/${approval_id}/restore`;
    const params = new HttpParams().set('performedBy', performedBy);
    return this.http.post(url, null, { params });
  }




}
