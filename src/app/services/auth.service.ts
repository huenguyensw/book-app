import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private baseUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticated = true;
        console.log('Login successful, session cookie set by backend.');
      })
    );
  }

  logout() {
    //call the backend to clear the session cookie
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticated = false;
        console.log('Logout successful, session cookie cleared by backend.');
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    // Check if the user is authenticated by making a request to the backend
    return this.http.get<{ authenticated: boolean }>(`${this.baseUrl}/status`, { withCredentials: true }).pipe(
      map(res => res.authenticated),
      catchError(() => of(false))
    );
  }
}