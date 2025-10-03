import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const skipAuth =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (!skipAuth) {
    const token = tokenService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !skipAuth) {
        tokenService.clearToken();
        router.navigate(['auth/login']);
      }
      return throwError(() => error);
    })
  );
};
