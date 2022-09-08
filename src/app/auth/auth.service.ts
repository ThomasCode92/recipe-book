import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(BASE_URL + 'accounts:signUp?key=' + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        BASE_URL + 'accounts:signInWithPassword?key=' + API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(catchError(this.handleError));
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
