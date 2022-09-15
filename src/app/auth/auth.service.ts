import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

import { User } from './user.model';

import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const FIREBASE_API_KEY = environment.firebaseAPIKey;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokeExpirationTimer: any;

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.localId,
            resData.email,
            resData.idToken,
            parseInt(resData.expiresIn) * 1000
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.localId,
            resData.email,
            resData.idToken,
            parseInt(resData.expiresIn) * 1000
          );
        })
      );
  }

  autoLogin() {
    const loadedUser = localStorage.getItem('userData');
    if (!loadedUser) return;

    const userData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(loadedUser);

    const user = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (user.token) {
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.user.next(user);
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');

    if (this.tokeExpirationTimer) {
      clearTimeout(this.tokeExpirationTimer);
    }

    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokeExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    userId: string,
    email: string,
    token: string,
    expiresIn: number
  ) {
    const currentTime = new Date().getTime(); // current time in milliseconds
    const expirationDate = new Date(currentTime + expiresIn);

    const user = new User(userId, email, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (!errorRes.error || !errorRes.error.error)
      return throwError(() => errorRes);

    const errorMessage = errorRes.error.error.message;
    let error: string;

    switch (errorMessage) {
      case 'EMAIL_EXISTS':
        error = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        error = 'Invalid credentials!';
        break;
      default:
        error = 'An unkown error occurred!';
    }

    return throwError(() => error);
  }
}
