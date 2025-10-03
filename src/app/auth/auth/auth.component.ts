import { Component, inject, input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService, LoginResponse, User } from '../auth.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, SidebarComponent, RouterLink, LoaderComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  errorMessage = signal<string | null>(null);
  type = input();
  isLoading = signal(false);
  private router = inject(Router);
  private authService = inject(AuthService);
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  clearErrorMessage() {
    this.errorMessage.set(null);
  }

  onSubmit() {
    if (this.type() === 'register' && this.authForm.invalid) return;
    if (
      this.type() === 'login' &&
      (this.authForm.controls.email.invalid ||
        this.authForm.controls.password.invalid)
    )
      return;
    this.isLoading.set(true);
    const { email, password } = this.authForm.value;
    let authObs!: Observable<LoginResponse | User>;

    this.type() === 'login'
      ? (authObs = this.authService.login({
          email: email!,
          password: password!,
        }))
      : (authObs = this.authService.register({
          email: email!,
          password: password!,
        }));

    authObs.subscribe({
      next: (resData) => {
        this.isLoading.set(false);
        if (this.type() === 'login') {
          this.router.navigate(['dashboard']);
        } else {
          this.errorMessage.set(
            'Konto zostało utworzone. Skontaktuj się z administratorem w celu aktywacji.'
          );
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.authForm.reset();
        this.errorMessage.set(
          'Logowanie nieudane. Wprowadź prawidłowy email i hasło.'
        );
      },
    });
    this.authForm.reset();
  }
}
