import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const roleguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const allowedRoles = route.data['allowedRoles'] as string[];
  const role = authService.getRole();
  console.log(allowedRoles, role);
  
  if (!role || !allowedRoles.includes(role)) {
    return false;
  }
  return true;
};
