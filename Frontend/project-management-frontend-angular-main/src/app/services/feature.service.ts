import { Injectable } from '@angular/core';
import { AbstractService } from './abstract-service';
import { HttpClient } from '@angular/common/http';
import { FeatureResponse } from '../models/feature.response';
import { Observable } from 'rxjs';
import { Feature } from '../models/feature.interface';

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends AbstractService {

  constructor(http: HttpClient) { super(http);}

  getFeature(): Observable<FeatureResponse>{
    return this.http.get<FeatureResponse>(`${this.baseUrl}/api/features`);
  }

  getFeatures(keyword: string) {
    return this.http.get(`${this.baseUrl}/api/features?keyword=${keyword}`);
  }

  Feature(keyword: string, page: number, perPage: number): Observable<FeatureResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.http.get<FeatureResponse>(`${this.baseUrl}/api/features`, { params: params });
  }

  getFeatureByProject(projectId: number): Observable<FeatureResponse>{
    return this.http.get<FeatureResponse>(`${this.baseUrl}/api/features/project/${projectId}`);
  }

  addFeature(feature: Feature): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/api/features`, feature);
  }

  getFeatureById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/features/${id}/edit`);
  }

  showFeature(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/features/${id}`);
  }

  deleteFeature(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/features/${id}/delete`);
  }

  updateFeature(id: number, feature: Feature): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/features/${id}/update`, feature);
  }

  getFeaturesByProject(projectId: string): Observable<FeatureResponse> {
    return this.http.get<FeatureResponse>(`${this.baseUrl}/api/features/project/${projectId}`);
  }
}
