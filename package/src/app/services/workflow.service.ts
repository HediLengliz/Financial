// workflow.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  CreateWorkflowRequest } from '../models/CreateWorkflowRequest';
import { Workflow } from '../models/workflow';

import {  WorkflowUpdateRequest } from '../models/workflowUpdateRequest';

import { AbstractService } from './abstract-service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends AbstractService {

  constructor(http: HttpClient) {
    super(http);
  }

  // CREATE WORKFLOW
  createWorkflow(request: CreateWorkflowRequest): Observable<Workflow> {
    return this.http.post<Workflow>(`${this.baseUrl}/api/workflows`, request);
  }

  // GET WORKFLOWS FOR A PROJECT
  getWorkflowsByProjectId(projectId: number, keyword?: string, status?: string): Observable<Workflow[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (status) params = params.set('status', status);

    return this.http.get<Workflow[]>(`${this.baseUrl}/api/workflows/project/${projectId}`, { params });
  }

  // GET SINGLE WORKFLOW
  getWorkflowById(id: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.baseUrl}/api/workflows/${id}`);
  }

  // UPDATE WORKFLOW
  updateWorkflow(id: number, request: WorkflowUpdateRequest): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.baseUrl}/api/workflows/${id}`, request);
  }

  // DELETE WORKFLOW
  deleteWorkflow(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/workflows/${id}`);
  }
}
