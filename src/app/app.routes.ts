import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthComponent } from './auth/auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { guestGuard } from './auth/guest.guard';
import { authGuard } from './auth/auth.guard';
import { EmailGeneratorComponent } from './email-generator/email-generator.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'auth/:type', component: AuthComponent, canActivate: [guestGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'email-generator',
    component: EmailGeneratorComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/home' },
];
