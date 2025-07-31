import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MyServices } from './Services/my-services';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router,private myService: MyServices) {}

  canActivate(): boolean {
    const isLoggedIn = this.myService.isLoggedInValue();

    if (isLoggedIn) return true;
    // const token = localStorage.getItem('token');
    // if (token) return true;

    this.router.navigate(['/login']);
    return false;
  }
}
