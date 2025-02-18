import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService extends AbstractService {
  constructor(http: HttpClient) { super(http); }

  handle(token: any): void {
    this.set(token);
    console.log('Token set, validity:', this.isValid());
  }

  set(token: any): void {
    localStorage.setItem('token', token);
  }

  get(): string | null {
    return localStorage.getItem('token');
  }

  remove(): void {
    localStorage.removeItem('token');
  }

  isValid(): boolean {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return (payload.iss === "http://127.0.0.1:8000/api/login");
      }
    }
    return false;
  }

  payload(token: any): any {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload: any): any {
    return JSON.parse(atob(payload));
  }

  loggedIn(): boolean {
    return this.isValid();
  }

  isTokenExpired(): boolean {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload && payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        const now = new Date();
        return now.getTime() >= expirationDate.getTime();
      }
    }
    return true;
  }

  validateToken(): Observable<any> {
    const token = this.get();
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get(`${this.baseUrl}/api/validateToken`, { headers });
    } else {
      return new Observable(observer => {
        observer.error('Token not found');
      });
    }
  }

  isTokenPresent(): boolean {
    return !!this.get();
  }
}
