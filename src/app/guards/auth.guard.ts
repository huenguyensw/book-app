import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { map, Observable } from "rxjs";

export const authGuard: CanActivateFn = (
  route,
  state
): Observable<boolean | UrlTree> => {  // explicitly return Observable
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(['/login'], { queryParams: { authError: 'true' } });
    })
  );
};