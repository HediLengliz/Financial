import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Budget} from "../models/budget";
@Injectable({
  providedIn: 'root'
})
export class BudgetService extends AbstractService{
  private apiGatewayUrl = 'http://localhost:8080/financial/budgets';
  constructor(protected override http: HttpClient) {
    super(http);
  }
  private budgetUpdatedSource = new Subject<void>();
  budgetUpdated$ = this.budgetUpdatedSource.asObservable();

  notifyBudgetUpdated() {
    this.budgetUpdatedSource.next();
  }
  getBudgets(
    projectName?: string,
    amount?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    transaction?: string,
    budgetStatus?: string,
    approval?: string
  ): Observable<Budget[]> {
    let params = new HttpParams();
    if (projectName) params = params.set('projectName', projectName);
    if (amount) params = params.set('amount', amount);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (status) params = params.set('status', status);
    if (transaction) params = params.set('transaction', transaction);
    if (budgetStatus) params = params.set('budgetStatus', budgetStatus);
    if (approval) params = params.set('approval', approval);


    return this.http.get<Budget[]>(`${this.apiGatewayUrl}/load-with-filters`, { params });
  }

  getBudgetById(id: string | null): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiGatewayUrl}/get/${id}`);
  }
  getbudgetById(id: number | null): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiGatewayUrl}/get/${id}`);
  }

  createBudget(budgetData: any): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiGatewayUrl}/create`, budgetData);
  }

  updateBudget(id: string, budgetData: any): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiGatewayUrl}/update/${id}`, budgetData);
  }


  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGatewayUrl}/delete/${id}`);
  }

  fetchForecast(budgetId: number): Observable<{ forecast: number }> {
    return this.http.get<{ forecast: number }>(`${this.apiGatewayUrl}/forecast/${budgetId}`);
  }
}
