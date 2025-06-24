// csrf.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Read the cookie (simple helper function below)
    const csrfToken = this.getCookie('XSRF-TOKEN');

    // Clone request and add CSRF header if token exists
    if (csrfToken) {
      const cloned = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', csrfToken)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return matches ? decodeURIComponent(matches[2]) : null;
  }
}
