import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoResponse } from '../models/todo.response';
import { Todo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends AbstractService{

  constructor(http: HttpClient) { super(http);}

  getTasksByFeature(featureId: number, priority: string, status: string): Observable<TodoResponse> {
    let params = new HttpParams();
    if (priority) {
      params = params.set('priority', priority);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<TodoResponse>(`${this.baseUrl}/api/tasks/feature/${featureId}`, { params });
  }

  addTodo(todo: Todo): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/tasks`, todo);
  }

  getTodoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tasks/${id}/edit`);
  }

  showTodo(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tasks/${id}`);
  }

  updateTodo(id: number, todo: Todo): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/tasks/${id}/update`, todo);
  }

  updateUserIds(taskId: number, data: { member_id: number[] }): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/tasks/${taskId}/updateUser`, data);
  }
}
