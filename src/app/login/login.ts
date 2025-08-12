import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../Services/my-services';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Environment } from '../../environments/environment';
import { AuthService } from '../Services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  form!: FormGroup;
  errorMessage = '';
  // mode: 'login' | 'signup' = 'login';
  // roleOptionList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    // this.GetRoleOptions();
  }

  // GetRoleOptions() {
  //   this.http.get(Environment.URI + 'Auth/RoleOptions').subscribe({
  //     next: (response: any) => {
  //       this.roleOptionList = response.roleOptionList;
  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     }
  //   })
  // }

  initForm() {
    // if (this.mode === 'login') {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    // }
    //  else {
    //   this.form = this.fb.group({
    //     username: ['', Validators.required],
    //     email: ['', [Validators.required, Validators.email]],
    //     password: ['', [Validators.required, Validators.minLength(5)]],
    //     confirmPassword: ['', Validators.required],
    //     roleId: [null, Validators.required]
    //   });
    // }

    // Add confirmPassword validator only in signup mode
    // if (this.mode === 'signup') {
    //   this.form.get('confirmPassword')?.setValidators([Validators.required]);
    // }

  }

  // switchMode(mode: 'login' | 'signup') {
  //   this.mode = mode;
  //   this.errorMessage = '';
  //   this.form.reset();
  //   this.initForm();
  // }

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    // , email, confirmPassword, roleId 

    // if (this.mode === 'signup' && password !== confirmPassword) {
    //   this.errorMessage = 'Passwords do not match';
    //   return;
    // }

    // if (this.mode === 'login') {
    this.authService.Login({
      username,
      password
    }).subscribe({
      next: res => {
        this.authService.login(res.token);
        this.authService.decodeToken();
        this.router.navigate(['/Home']);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Login failed';
      }
    });
    // } 
    // else {
    //   let payload: any = {
    //     username,
    //     password,
    //     email,
    //     roleId
    //   };
    //   console.log(payload);

    //  

    // }
  }

}