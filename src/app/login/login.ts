import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../Services/my-services';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  username = '';
  password = '';
  confirmPassword = '';
  email = ''; // for signup only
  errorMessage = '';
  mode: 'login' | 'signup' = 'login'; // default is login

  constructor(private http: HttpClient, private router: Router, private myServices: MyServices) { }
  login() {
    if (this.mode === 'login') {
      this.http.post<any>(Environment.URI + '/Auth/login', {
        username: this.username,
        password: this.password
      }).subscribe({
        next: res => {
          this.myServices.login(res.token); // <-- Save token & update state
          this.router.navigate(['/Home']);
        },
        error: err => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    } else {
      this.signup();
    }
  }

signup() {
  if (this.password !== this.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  this.http.post<any>(Environment.URI + '/Auth/signup', {
    username: this.username,
    password: this.password,
    email: this.email
  }).subscribe({
    next: res => {
      this.myServices.login(res.token);
      this.router.navigate(['/Home']);
    },
    error: err => {
      this.errorMessage = err.error?.message || 'Signup failed';
    }
  });
}


}
