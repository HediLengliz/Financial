import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardsResolverService implements Resolve<any> {

  constructor(private dashboard: DashboardService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    console.log('Call Get Dashboard in resolver...', route);
    
    // Call all functions in parallel using forkJoin
    return forkJoin({
      project: this.dashboard.getProject(),
      user: this.dashboard.getMember(),
      task: this.dashboard.getTask(),
      graph: this.dashboard.getGraph(),
      dashboard: this.dashboard.getDashboard()
    }).pipe(
      catchError(error => {
        console.error('Error resolving data:', error);
        return of('No data');
      })
    );
  }
}
