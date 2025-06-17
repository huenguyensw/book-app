import { inject  } from "@angular/core";
import { HttpInterceptorFn , HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    const token = localStorage.getItem('token');
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(clonedRequest);
    }
  }
  return next(req);
}