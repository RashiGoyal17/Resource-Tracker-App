import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Details } from './Components/details/details';
import { Form } from './Components/form/form';
import { Login } from './login/login';
import { AuthGuard } from './auth-guard';
import { Parent } from './Components/parent/parent';

export const routes: Routes = [
    // Public routes
  { path: 'login', component: Login },

  // Protected routes under a shared parent (with header/nav/etc.)
  {
    path: '',
    component: Parent,
    canActivate: [AuthGuard],
    children: [
      { path: 'Home', component: Home },
      { path: 'Details', component: Details },
      { path: 'Details/:empId', component: Details },
      { path: 'Add', component: Form },
      { path: 'Edit', component: Form },
      { path: 'Edit/:empId', component: Form },
      { path: '', redirectTo: 'Home', pathMatch: 'full' }
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' }

];


//  { path: 'Home', component: Home, canActivate: [AuthGuard] },