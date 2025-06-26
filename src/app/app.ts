import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, MatDialogModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'book-app';

  // Define dark mode toggle
  isDarkMode = false;
  isLoggedIn$!: Observable<boolean>; 

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }




  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    
  this.isLoggedIn$.subscribe(status => {
    console.log('Login status:', status);
  });

    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('theme');
      this.isDarkMode = theme === 'dark';
      this.updateThemeClass();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      this.updateThemeClass();
    }
  }

  updateThemeClass() {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.documentElement;
      if (this.isDarkMode) {
        el.classList.add('dark-theme');
      } else {
        el.classList.remove('dark-theme');
      }
    }
  }
}
