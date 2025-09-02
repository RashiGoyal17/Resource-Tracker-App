import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MyServices } from './Services/my-services';
import { AuthService } from './Services/auth-service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private myService: MyServices, private authService: AuthService) { }

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedInValue();

    if (isLoggedIn) return true;
    // const token = localStorage.getItem('token');
    // if (token) return true;

    this.authService.removeToken();
    this.router.navigate(['/login']);
    return false;
  }
}
