import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { AdminResponse } from '../models/admin.response';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends AbstractService{

  constructor(http: HttpClient) { super(http);}

  getAdmin(): Observable<AdminResponse>{
    return this.http.get<AdminResponse>(`${this.baseUrl}/api/listadmins`);
  }

  getAdmins(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/listadmins?keyword=${keyword}`);
  }

  Admin(keyword: string, page: number, perPage: number): Observable<AdminResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<AdminResponse>(`${this.baseUrl}/api/admins`, { params: params });
  }

  addAdmin(admin: Admin): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/admins`, admin);
  }

  getAdminById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/admins/${id}/edit`);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/admins/${id}/delete`);
  }

  showAdmin(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/admins/${id}`);
  }

  updateAdmin(id: number, admin: Admin): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/admins/${id}/update`, admin);
  }
}
