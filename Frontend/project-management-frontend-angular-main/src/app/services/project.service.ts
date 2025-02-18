import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProjectResponse } from '../models/project.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends AbstractService {

  constructor(http: HttpClient) { super(http);}

  getProject(): Observable<ProjectResponse>{
    return this.http.get<ProjectResponse>(`${this.baseUrl}/api/listprojects`);
  }

  // getProjects(keyword: string) {
  //   return this.http.get(`${this.baseUrl}/api/projects?keyword=${keyword}`);
  // }

  getProjects(keyword: string, status: string): Observable<ProjectResponse> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ProjectResponse>(`${this.baseUrl}/api/listprojects`, { params });
  }

  Project(keyword: string, status: string, page: number, perPage: number): Observable<ProjectResponse> {
    const params = {
      keyword: keyword,
      status: status,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<ProjectResponse>(`${this.baseUrl}/api/projects`, { params: params });
  }

  // addClient(client: Client): Observable<any>{
  //   return this.http.post<any>(`${this.baseUrl}/api/clients`, client);
  // }
  addProject(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/projects`, formData);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/projects/${id}/edit`);
  }

  // deleteProject(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/api/projects/${id}/delete`);
  // }

  deleteProject(id: number, projectName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/projects/${id}/delete`, {
      params: { project_name: projectName }
    });
  }

  showProject(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/projects/${id}`);
  }

  updateProject(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/projects/${id}/update`, formData);
  }

}
