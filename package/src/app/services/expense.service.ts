import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Expense} from "../models/expense";
import { AbstractService } from './abstract-service';
import {Observable, Subject} from "rxjs";
import {Budget} from "../models/budget";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends AbstractService{
  private apiGatewayUrl = 'http://localhost:8080/financial/expenses';
  constructor(protected override http: HttpClient) {
    super(http);
  }
  private expenseUpdateSource = new Subject<void>();
  expenseUpdated$ = this.expenseUpdateSource.asObservable();

  notifyExpenseUpdated() {
    this.expenseUpdateSource.next();
  }
  getExpensesWithFilters(
    description?: string,
    amount?: number,
    createdAt?: string,
    updatedAt?: string,
    category?: string,
    status?: string
  ): Observable<Expense[]> {
    let params = new HttpParams();

    if (description) params = params.set('description', description);
    if (amount !== undefined && amount !== null) params = params.set('amount', amount.toString());
    if (createdAt) params = params.set('createdAt', createdAt); // Ensure format is YYYY-MM-DD
    if (updatedAt) params = params.set('updatedAt', updatedAt); // Ensure format is YYYY-MM-DD
    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);

    return this.http.get<Expense[]>(`${this.apiGatewayUrl}/load-with-filters`, { params });
  }
  createExpense(expenseData: any): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiGatewayUrl}/create`, expenseData);
  }
  getExpenseById(id: string | null): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiGatewayUrl}/get/${id}`);
  }

  updateExpense(id: string, expenseData: any): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiGatewayUrl}/update/${id}`, expenseData);
  }


  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiGatewayUrl}/delete/${id}`);
  }

}
