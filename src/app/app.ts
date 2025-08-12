import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Parent } from './Components/parent/parent';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyServices } from './Services/my-services';
import { AuthService } from './Services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastrModule, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isLoggedIn = false;
  protected title = 'final';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }
}
