import { authGuard } from './auth.guard';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow navigation if user is logged in', () => {
    authService.isLoggedIn.and.returnValue(of(true));
    const result = authGuard({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should redirect to login if not logged in', () => {
    authService.isLoggedIn.and.returnValue(of(false));
    const result = authGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { authError: 'true' } });
  });
});
