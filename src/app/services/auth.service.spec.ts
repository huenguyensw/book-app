import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  provideHttpClient,
} from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/api/Auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Handle the automatic call from the constructor to /status
    const req = httpMock.expectOne(`${baseUrl}/status`);
    expect(req.request.method).toBe('GET');
    req.flush({ authenticated: false });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call login API and emit true', (done) => {
    service.login('test@example.com', 'password123').subscribe(() => {
      service.isLoggedIn().subscribe((val) => {
        expect(val).toBeTrue();
        done();
      });
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});
  });

  it('should call logout API and emit false', (done) => {
    // simulate initial login first
    (service as any).isAuthenticatedSubject.next(true);

    service.logout().subscribe(() => {
      service.isLoggedIn().subscribe((val) => {
        expect(val).toBeFalse();
        done();
      });
    });

    const req = httpMock.expectOne(`${baseUrl}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});
  });

  it('should reflect authenticated true from checkAuthStatus', (done) => {
    // manually trigger the internal method
    (service as any).checkAuthStatus().subscribe(() => {
      service.isLoggedIn().subscribe((authenticated) => {
        expect(authenticated).toBeTrue();
        done();
      });
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ authenticated: true });
  });

  it('should reflect authenticated false if /status returns false', (done) => {
    (service as any).checkAuthStatus().subscribe(() => {
      service.isLoggedIn().subscribe((authenticated) => {
        expect(authenticated).toBeFalse();
        done();
      });
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    req.flush({ authenticated: false });
  });

  it('should emit false if /status request fails', (done) => {
    (service as any).checkAuthStatus().subscribe(() => {
      service.isLoggedIn().subscribe((authenticated) => {
        expect(authenticated).toBeFalse();
        done();
      });
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    req.error(new ErrorEvent('Network error'), { status: 500 });
  });

  it('should register successfully', (done) => {
    service.register('user', 'user@example.com', 'password').subscribe((res) => {
      expect(res).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
    });
    req.flush({ success: true });
  });

  it('should throw error on failed register', (done) => {
    spyOn(console, 'error');

    service.register('user', 'bademail', 'pass').subscribe({
      next: () => fail('Should not succeed'),
      error: (errFn) => {
        expect(typeof errFn).toBe('function'); // Because it's `throw (() => error)`
        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    req.error(new ErrorEvent('Bad Request'), { status: 400 });
  });
});
