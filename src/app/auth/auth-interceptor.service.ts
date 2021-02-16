import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, resp: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((userData) => {
        if (!userData) {
          return resp.handle(req);
        } else {
          const reqAuthenticated = req.clone({
            params: new HttpParams().set('auth', userData.token),
          });

          return resp.handle(reqAuthenticated);
        }
      })
    );
  }
}
