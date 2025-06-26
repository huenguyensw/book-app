import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/Auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }
  private checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.baseUrl}/status`, { withCredentials: true }).pipe(
      map(res => res.authenticated),
      tap(isAuth => this.isAuthenticatedSubject.next(isAuth)),
      catchError(err => {
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }


  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, email, password }, { withCredentials: true }).pipe(
      tap(() => console.log('Registration successful.')),
      catchError(error => {
        console.error('Registration failed:', error);
        throw (() => error);
      })
    );
  }


  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
        console.log('Login successful, session cookie set by backend.');
      })
    );
  }

  logout() {
    //call the backend to clear the session cookie
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        console.log('Logout successful, session cookie cleared by backend.');
      })
    );
  }

  // isLoggedIn(): Observable<boolean> {
  //   // Check if the user is authenticated by making a request to the backend
  //   return this.http.get<{ authenticated: boolean }>(`${this.baseUrl}/status`, { withCredentials: true }).pipe(
  //     map(res => res.authenticated),
  //     catchError(() => of(false))
  //   );
  // }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$; 
  }
}


