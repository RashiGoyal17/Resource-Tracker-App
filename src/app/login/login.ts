import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../Services/my-services';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private myServices: MyServices) {}
  login() {
    this.http.post<any>('https://localhost:7191/api/Auth/login', {
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
  }


}
