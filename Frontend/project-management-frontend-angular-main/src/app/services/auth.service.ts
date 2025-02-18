import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractService {

  userPermissions: string[] = []; // Store user permissions here

  constructor(http: HttpClient) { super(http); }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/api/login`, data).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          this.setUserPermissions(response.permissions); // Store user permissions upon login
          localStorage.setItem('token', response.access_token); // Store access token
        }
      })
    );
  }

  getUserProfile() {
    return this.http.get(`${this.baseUrl}/api/profile`);
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http.post(`${this.baseUrl}/api/logout`, {}).pipe(
        tap(() => {
          localStorage.removeItem('token');
        })
      );
    } else {
      return this.http.post(`${this.baseUrl}/api/logout`, {});
    }
  }

  setUserPermissions(permissions: string[]) {
    this.userPermissions = permissions;
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }
}
