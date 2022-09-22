import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import {
  authenticateSuccess,
  authenticateFail,
  loginStart,
  signupStart,
  logout,
  autoLogin,
} from './auth.actions';

import { User } from '../user.model';

import { environment } from '../../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const FIREBASE_API_KEY = environment.firebaseAPIKey;

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupStart),
      switchMap(authData => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(responseData => {
              return this.handleAuthentication(responseData);
            }),
            catchError(errorRes => {
              return this.handleError(errorRes);
            })
          );
      })
    );
  });

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      switchMap(authData => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(responseData => {
              return this.handleAuthentication(responseData);
            }),
            catchError(errorRes => {
              return this.handleError(errorRes);
            })
          );
      })
    );
  });

  authAutoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(autoLogin),
      map(() => {
        const loadedUser = localStorage.getItem('userData');
        if (!loadedUser) return { type: 'DUMMY' };

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
          // const expirationDuration =
          //   new Date(userData._tokenExpirationDate).getTime() -
          //   new Date().getTime();

          return authenticateSuccess({ user: user });
        }

        return { type: 'DUMMY' };
      })
    );
  });

  authLogout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('userData');
        })
      );
    },
    { dispatch: false }
  );

  authRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authenticateSuccess, logout),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  private handleAuthentication(responseData: AuthResponseData) {
    const expiresIn = parseInt(responseData.expiresIn);
    const userId = responseData.localId;
    const email = responseData.email;
    const token = responseData.idToken;

    const currentTime = new Date().getTime(); // current time in milliseconds
    const expirationDate = new Date(currentTime + expiresIn * 1000);

    const user = new User(userId, email, token, expirationDate);

    localStorage.setItem('userData', JSON.stringify(user));

    return authenticateSuccess({ user: user });
  }

  private handleError(errorRes: HttpErrorResponse) {
    let error = 'An unkown error occurred!';

    if (!errorRes.error || !errorRes.error.error)
      return of(authenticateFail({ message: error }));

    const errorMessage = errorRes.error.error.message;

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

    return of(authenticateFail({ message: error }));
  }
}
