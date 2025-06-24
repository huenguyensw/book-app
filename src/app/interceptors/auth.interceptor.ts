import { inject } from "@angular/core";
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const cloned = req.clone({
    withCredentials: true
  });

  return next(cloned);
}