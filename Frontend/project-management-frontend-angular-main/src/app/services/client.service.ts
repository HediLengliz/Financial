import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientResponse } from '../models/client.response';
import { Observable } from 'rxjs';
import { Client } from '../models/client.interface';
import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends AbstractService {

  constructor(http: HttpClient) { super(http);}

  getClient(): Observable<ClientResponse>{
    return this.http.get<ClientResponse>(`${this.baseUrl}/api/listclients`);
  }

  getClients(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/listclients?keyword=${keyword}`);
  }

  Client(keyword: string, page: number, perPage: number): Observable<ClientResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<ClientResponse>(`${this.baseUrl}/api/clients`, { params: params });
  }

  // addClient(client: Client): Observable<any>{
  //   return this.http.post<any>(`${this.baseUrl}/api/clients`, client);
  // }
  addClient(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/clients`, formData);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/clients/${id}/edit`);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/clients/${id}/delete`);
  }

  showClient(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/clients/${id}`);
  }

  updateClient(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/clients/${id}/update`, formData);
  }
}
