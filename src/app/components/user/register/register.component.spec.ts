import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    const form = component.registerForm;
    expect(form).toBeDefined();
    expect(form.get('username')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  it('should not submit the form if invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call authService.register if form is valid', () => {
    const mockResponse = of({});
    authServiceSpy.register.and.returnValue(mockResponse);

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
  });

  it('should show success message and redirect on successful registration', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of({}));

    spyOn(component, 'onSubmit').and.callThrough();

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();
    tick(); // simulate async
    expect(component.successMessage).toContain('Registration successful');
    expect(component.errorMessage).toBe('');
    
    tick(2000); // simulate 2s delay for redirect
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error message on registration failure', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Registration failed. Please try again.');
    expect(component.successMessage).toBe('');
  });
});
