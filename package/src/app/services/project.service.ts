import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends AbstractService {

  constructor(http: HttpClient) {
    super(http);
  }


  // Get all projects (no pagination)
  getProjects(keyword?: string, status?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (status) params = params.set('status', status);

    return this.http.get<Project[]>(`${this.baseUrl}/api/projects`, { params });
  }

  // Create project
  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/api/projects`, formData);
  }

  // Update project
  updateProject(id: number, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/api/projects/${id}`, formData);
  }

  // Delete project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/projects/${id}`);
  }

  // Get single project
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/api/projects/${id}`);
  }
}
