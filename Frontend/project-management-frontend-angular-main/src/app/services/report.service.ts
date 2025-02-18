import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends AbstractService{

  constructor(http: HttpClient) { super(http);}

  getProject(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/Reportproject`);
  }

  Project(page: number, perPage: number): Observable<any> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<any>(`${this.baseUrl}/api/Reportproject`, { params: params });
  }

  getFeature(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/Reportfeature`);
  }

  Feature(page: number, perPage: number): Observable<any> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<any>(`${this.baseUrl}/api/Reportfeature`, { params: params });
  }
}
