import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Details } from './Components/details/details';
import { Form } from './Components/form/form';
import { Login } from './login/login';
import { AuthGuard } from './auth-guard';
import { Parent } from './Components/parent/parent';
import { roleguardGuard } from './Guards/roleguard-guard';
import { CreateUser } from './create-user/create-user';
import { Dashboard } from './Components/dashboard/dashboard';
import { AdminUserManagement } from './Components/admin-user-management/admin-user-management';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: Login },

  // Protected routes under a shared parent (with header/nav/etc.)
  {
    path: '',
    component: Parent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'Home', component: Home },
      { path: 'Details', component: Details },
      { path: 'Details/:empId', component: Details },
      { path: 'Add', component: Form, canActivate: [roleguardGuard], data: { allowedRoles: ['Admin', 'Manager'] } },
      // { path: 'Edit', component: Form, canActivate: [roleguardGuard], data: { allowedRoles: ['Admin', 'Manager'] } },
      { path: 'CreateUser', component: CreateUser, canActivate: [roleguardGuard], data: { allowedRoles: ['Admin'] } },
      { path: 'Edit/:empId', component: Form, canActivate: [roleguardGuard], data: { allowedRoles: ['Admin', 'Manager'] } },
      { path: 'user-management', component: AdminUserManagement, canActivate: [roleguardGuard], data: { allowedRoles: ['Admin'] } },
      { path: '', redirectTo: '/Home', pathMatch: 'full' }
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' }

];


//  { path: 'Home', component: Home, canActivate: [AuthGuard] },