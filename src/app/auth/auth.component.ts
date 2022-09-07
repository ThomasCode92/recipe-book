import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
    } else {
      this.authService.signup(email, password).subscribe({
        next: responseData => {
          this.isLoading = false;
          console.log(responseData);
        },
        error: error => {
          this.isLoading = false;
          this.error = 'An error occurred!';
          console.log(error);
        },
      });
    }

    form.reset();
  }
}
