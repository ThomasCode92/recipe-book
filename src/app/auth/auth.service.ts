import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { logout } from './store/auth.actions';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
