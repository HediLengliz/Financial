import { Injectable } from '@angular/core';
import { EmployeeResponse } from '../models/employee.response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Employee } from '../models/employee.interface';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends AbstractService {

  private userProfileSource = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSource.asObservable();

  constructor(http: HttpClient) { super(http);}

  getEmployee(): Observable<EmployeeResponse>{
    return this.http.get<EmployeeResponse>(`${this.baseUrl}/api/listusers`);
  }

  getEmployees(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/listusers?keyword=${keyword}`);
  }

  Employee(keyword: string, page: number, perPage: number): Observable<EmployeeResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<EmployeeResponse>(`${this.baseUrl}/api/users`, { params: params });
  }

  addEmployee(formData: FormData): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/users`, formData);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/api/users/${id}/edit`)
  }
  

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/users/${id}/delete`);
  }

  showEmployee(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/${id}`);
  }

  updateEmployee(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/${id}/update`, formData);
  }

  getEmployeesByFeatureId(featureId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/members/feature/${featureId}`);
  }

  getEmployeesByFeatureIds(featureId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/members/feature/${featureId}`, {
      params: { keyword }
    });
  }

  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/update-profile-picture`, formData).pipe(
      tap((response) => {
        this.userProfileSource.next(response); // Notify subscribers
      })
    );
  }

}
