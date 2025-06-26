import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn']);
    mockAuthService.isLoggedIn.and.returnValue(of(true)); // ✅ mock login observable
    mockAuthService.logout.and.returnValue(of({})); // ✅ mock logout observable

    await TestBed.configureTestingModule({
      imports: [
        App, // ✅ Import the standalone component directly
        RouterTestingModule,
        CommonModule,
        MatDialogModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with theme from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dark');

    component.ngOnInit();

    expect(component.isDarkMode).toBeTrue();
  });

  it('should toggle theme and update localStorage', () => {
    spyOn(localStorage, 'setItem');
    const addSpy = spyOn(document.documentElement.classList, 'add');
    const removeSpy = spyOn(document.documentElement.classList, 'remove');

    component.isDarkMode = false;
    component.toggleTheme();

    expect(component.isDarkMode).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(addSpy).toHaveBeenCalledWith('dark-theme');

    // Toggle again
    component.toggleTheme();
    expect(component.isDarkMode).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(removeSpy).toHaveBeenCalledWith('dark-theme');
  });

  it('should logout and navigate to /login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const fakeEvent = new Event('click');
    spyOn(fakeEvent, 'preventDefault');

    component.logout(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
