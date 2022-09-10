import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/';
const API_KEY = 'AIzaSyAn_4DJnapj3CknGFqPWmJgmwd73gWfrHM';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(BASE_URL + 'accounts:signUp?key=' + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
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
        BASE_URL + 'accounts:signInWithPassword?key=' + API_KEY,
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
      this.user.next(user);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    
    this.router.navigate(['/auth']);
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
