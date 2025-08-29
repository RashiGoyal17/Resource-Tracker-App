import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-create-user',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser implements OnInit {

  form!: FormGroup;
  errorMessage = '';
  successMessage = '';
  roleOptionList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.GetRoleOptions();
    
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      roleId: [null, Validators.required]
    });
  }

GetRoleOptions() {
  this.http.get(Environment.URI + 'Auth/RoleOptions').subscribe({
    next: (response: any) => {
      this.roleOptionList = response.roleOptionList.map((r: any) => ({
        id: r.Id,
        name: r.Name
      }));
    },
    error: (err: any) => {
      console.error(err);
    }
  });
}


  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    const { username, password, email, confirmPassword, roleId } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    let payload: any = {
      username,
      password,
      email,
      roleId
    };

    this.http.post<any>(Environment.URI + 'Auth/signup', payload).subscribe({
      next: res => {
        this.successMessage = 'User created successfully. Credentials have been sent to the user via email.';
        this.form.reset();
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Signup failed';
      }
    });
  }

}
