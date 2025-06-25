import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZone, ChangeDetectorRef } from '@angular/core';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteStub: Partial<ActivatedRoute>;
    let queryParamsSubject: Subject<any>;
    let ngZone: NgZone;
    let cd: ChangeDetectorRef;

    beforeEach(async () => {
        queryParamsSubject = new Subject();

        activatedRouteStub = {
            queryParams: queryParamsSubject.asObservable(),
        };

        authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'], { url: '/login' });

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule], // assuming LoginComponent is standalone
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        ngZone = TestBed.inject(NgZone); // ✅ Still fine to inject here
        cd = fixture.componentRef.injector.get(ChangeDetectorRef);

        fixture.detectChanges();
    });



    it('should create the component and initialize form', () => {
        expect(component).toBeTruthy();
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.get('useremail')).toBeDefined();
        expect(component.loginForm.get('password')).toBeDefined();
    });

    it('should update showAuthError based on queryParams', () => {
        expect(component.showAuthError).toBe(false);

        queryParamsSubject.next({ authError: 'true' });
        fixture.detectChanges();

        expect(component.showAuthError).toBe(true);

        queryParamsSubject.next({ authError: 'false' });
        fixture.detectChanges();

        expect(component.showAuthError).toBe(false);
    });

    it('should reset error flags on form value changes', () => {
        component.error = 'Some error';
        component.showAuthError = true;

        component.loginForm.setValue({ useremail: 'a@b.com', password: '123' });
        fixture.detectChanges();

        expect(component.error).toBeNull();
        expect(component.showAuthError).toBe(false);
    });


    it('should call authService.login and navigate on success', fakeAsync(() => {
        component.loginForm.setValue({ useremail: 'test@example.com', password: 'MySecret123!' });

        // Correctly configure the already-injected routerSpy
        routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
        authServiceSpy.login.and.returnValue(of({}));

        component.onSubmit();
        tick();

        expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'MySecret123!');
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/books');
    }));

    it('should show auth error and set error message on 401 error', fakeAsync(() => {
        component.loginForm.setValue({ useremail: 'test@example.com', password: 'wrongpass' });

        const errorResponse = { status: 401 };
        authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

        // Instead of assigning directly, define a variable for URL and override the getter
        let currentUrl = '/other-page';
        Object.defineProperty(routerSpy, 'url', {
            get: () => currentUrl,
            configurable: true,
        });

        routerSpy.navigate.and.returnValue(Promise.resolve(true));

        // Spy on zone.run to just call the function immediately
        spyOn(ngZone, 'run').and.callFake(fn => fn());

        component.onSubmit();
        tick();

        expect(component.showAuthError).toBeTrue();
        expect(component.error).toBe('Ogiltig e-postadress eller lösenord.');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { authError: true } });
    }));


    it('should show general error message on other errors', fakeAsync(() => {
        component.loginForm.setValue({ useremail: 'test@example.com', password: 'any' });

        const errorResponse = { status: 500 };
        authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

        spyOn(ngZone, 'run').and.callFake(fn => fn());

        component.onSubmit();
        tick();

        expect(component.showAuthError).toBeTrue();
        expect(component.error).toBe('Ett fel uppstod. Försök igen senare.');
    }));

    it('should mark all form fields as touched if form is invalid', () => {
        spyOn(component.loginForm, 'markAllAsTouched');
        component.loginForm.setValue({ useremail: '', password: '' });
        component.onSubmit();
        expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    });
});
