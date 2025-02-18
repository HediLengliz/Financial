import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends AbstractService {

  constructor(http: HttpClient) { super(http); }

  getProject(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/userProject`);
  }

  getUserdetail(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/userDetail`);
  }

  getUserproject(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/projectUser`);
  }

  getUserteam(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/userTeam`);
  }
  
}
