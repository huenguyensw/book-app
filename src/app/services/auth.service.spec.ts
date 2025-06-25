import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  provideHttpClient,
} from '@angular/common/http';
import {  HttpTestingController } from '@angular/common/http/testing';
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
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });


  it('should call login API and set isAuthenticated to true', () => {
    service.login('test@example.com', 'password123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(req.request.withCredentials).toBeTrue();

    req.flush({}); // Simulate success response
  });


  it('should call logout API and set isAuthenticated to false', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });


  it('should return true if backend says authenticated', (done) => {
    service.isLoggedIn().subscribe((authenticated) => {
      expect(authenticated).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({ authenticated: true });
  });

  it('should return false if backend says not authenticated', (done) => {
    service.isLoggedIn().subscribe((authenticated) => {
      expect(authenticated).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    req.flush({ authenticated: false });
  });


  it('should return false if the request fails (e.g. 500)', (done) => {
    service.isLoggedIn().subscribe((authenticated) => {
      expect(authenticated).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/status`);
    req.error(new ErrorEvent('Network error'), { status: 500 });
  });
});
