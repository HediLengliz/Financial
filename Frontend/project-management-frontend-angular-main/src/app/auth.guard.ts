import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.tokenService.validateToken().pipe(
      map(response => {
        console.log('Token is valid:', response);
        return true;
      }),
      catchError(error => {
        console.error('Token validation failed:', error);
        this.tokenService.remove();
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}