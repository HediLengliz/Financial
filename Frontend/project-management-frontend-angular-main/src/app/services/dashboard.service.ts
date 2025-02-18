import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends AbstractService{

  constructor(http: HttpClient) { super(http);}

  getDashboard(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/dashboard`);
  }

  getProject(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/project`);
  }

  getMember(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/member`);
  }

  getTask(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/task`);
  }

  getGraph(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/graph`);
  }

}
