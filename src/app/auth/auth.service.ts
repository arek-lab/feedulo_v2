import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string; // FastAPI-Users expects 'username' field
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private readonly API_URL = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'auth_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.loadCurrentUser().subscribe();
    }
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  logout(): void {
    this.http
      .post(`${this.API_URL}/logout`, {})
      .pipe(catchError(() => of(null)))
      .subscribe();

    this.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['auth/login']);
  }

  private loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((err) => {
        this.logout();
        return of();
      })
    );
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  private setToken(token: string): void {
    this.tokenService.setToken(token);
  }

  private removeToken(): void {
    this.tokenService.clearToken();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }
}
