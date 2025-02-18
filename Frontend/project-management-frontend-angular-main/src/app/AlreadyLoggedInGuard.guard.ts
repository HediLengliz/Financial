import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // Check if the token is present
    if (!this.tokenService.isTokenPresent()) {
      // If the token is not present, allow access to the login page
      return of(true);
    }

    // If the token is present, validate the token
    return this.tokenService.validateToken().pipe(
      map(response => {
        // If the token is valid, redirect to the dashboard
        if (response) {
          return this.router.createUrlTree(['/dashboard']);
        }
        // If the token is not valid, allow access to the login page
        return true;
      }),
      catchError(error => {
        return of(true);
      })
    );
  }
}
