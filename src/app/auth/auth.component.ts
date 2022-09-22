import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { clearError, loginStart, signupStart } from './store/auth.actions';
import { AppState } from '../store/app.reducer';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private closeSub?: Subscription;
  private storeSub!: Subscription;

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authData => {
      this.isLoading = authData.loading;
      this.error = authData.authError;

      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    this.closeSub?.unsubscribe();
    this.storeSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.store.dispatch(clearError());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(loginStart({ email: email, password: password }));
    } else {
      this.store.dispatch(signupStart({ email: email, password: password }));
    }

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
