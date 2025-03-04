import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiGatewayUrl = 'http://localhost:8080/api/financial/expenses';
  constructor() { }
}
