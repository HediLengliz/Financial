import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { TaskResponse } from '../models/task.response';
import { Observable } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends AbstractService {

  constructor(http: HttpClient) { super(http);}

  getTask(): Observable<TaskResponse>{
    return this.http.get<TaskResponse>(`${this.baseUrl}/api/tasks`);
  }

  getTasks(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/tasks?keyword=${keyword}`);
  }

  Task(keyword: string, page: number, perPage: number): Observable<TaskResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<TaskResponse>(`${this.baseUrl}/api/tasks`, { params: params });
  }

  addTask(task: Task): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/tasks`, task);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tasks/${id}/edit`);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/tasks/${id}/delete`);
  }

  showTask(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tasks/${id}`);
  }

  updateTask(id: number, task: Task): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/tasks/${id}/update`, task);
  }

  getTaskByFeature(featureId: string): Observable<TaskResponse>{
    return this.http.get<TaskResponse>(`${this.baseUrl}/api/tasks/feature/${featureId}`);
  }

}
