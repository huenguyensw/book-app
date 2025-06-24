import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [provideHttpClientTesting()],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // make sure no request pending
    });

    it('should login and set authenticated flag', () => {
        service.login('test@example.com', 'MyScret123!').subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush({}); // fake success

        });
    

    it('should logout and reset authenticated flag', () => {
        service.logout().subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/logout`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('should return true if authenticated (isLoggedIn)', () => {
        service.isLoggedIn().subscribe(result => {
            expect(result).toBeTrue();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/status`);
        req.flush({ authenticated: true });
    });

    it('should return false if not authenticated (isLoggedIn)', () => {
        service.isLoggedIn().subscribe(result => {
            expect(result).toBeFalse();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/status`);
        req.flush({ authenticated: false });
    });
});