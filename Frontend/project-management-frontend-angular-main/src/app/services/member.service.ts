import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberResponse } from '../models/member.response';
import { Observable } from 'rxjs';
import { Member } from '../models/member.interface';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends AbstractService {

  constructor(http: HttpClient) { super(http);}

  getMember(): Observable<MemberResponse>{
    return this.http.get<MemberResponse>(`${this.baseUrl}/api/listmembers`);
  }

  addMember(member: Member): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/members`, member);
  }

  getMembers(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/listmembers?keyword=${keyword}`);
  }

  Member(keyword: string, page: number, perPage: number): Observable<MemberResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<MemberResponse>(`${this.baseUrl}/api/members`, { params: params });
  }

  getMemberById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/members/${id}/edit`);
  }

  deleteMember(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/members/${id}/delete`);
  }

  showMember(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/members/${id}`);
  }

  updateMember(id: number, member: Member): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/members/${id}/update`, member);
  }
}
