import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private baseUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{token: string}>(`${this.baseUrl}/login`, {email, password}).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Login successful, token stored:', response.token);
          this.isAuthenticated = true;
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
  }

  isLoggedIn() {
    if (typeof window !== 'undefined') {
    return this.isAuthenticated || !!localStorage.getItem('token');
  }
  return false;
  }
}