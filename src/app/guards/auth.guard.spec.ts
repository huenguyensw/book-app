import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { of, Observable } from 'rxjs';
import { provideLocationMocks } from '@angular/common/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injector, runInInjectionContext } from '@angular/core';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/dashboard' } as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
        provideLocationMocks(),
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access if user is authenticated', (done) => {
    mockAuthService.isLoggedIn.and.returnValue(of(true));

    runInInjectionContext(TestBed.inject(Injector), () => {
      (authGuard(mockRoute, mockState) as Observable<boolean | UrlTree>)
        .subscribe(result => {
          expect(result).toBeTrue();
          done();
        });
    });
  });

  it('should redirect to /login if user is not authenticated', (done) => {
    mockAuthService.isLoggedIn.and.returnValue(of(false));

    runInInjectionContext( TestBed.inject(Injector), () => {
      (authGuard(mockRoute, mockState) as Observable<boolean | UrlTree>)
        .subscribe(result => {
          expect(result instanceof UrlTree).toBeTrue();
          const urlTree = result as UrlTree;
          expect(urlTree.toString()).toContain('/login');
          expect(urlTree.queryParams['authError']).toBe('true');
          done();
        });
    });
  });
});
