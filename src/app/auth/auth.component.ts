import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  private closeSub?: Subscription;

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.closeSub?.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: errorMessage => {
        console.log(errorMessage);
        this.isLoading = false;
        this.showErrorAlert(errorMessage);
      },
    });

    form.reset();
  }

  private showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    const alertComponent = componentRef.instance;

    alertComponent.message = message;
    this.closeSub = alertComponent.close.subscribe(() => {
      this.closeSub!.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
