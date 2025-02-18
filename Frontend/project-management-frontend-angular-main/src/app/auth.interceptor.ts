import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './services/token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token:TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.token.get();
    if (authToken) {
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}