import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import {
  authenticateSuccess,
  authenticateFail,
  loginStart,
  signupStart,
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
    return this.actions$.pipe(ofType(signupStart));
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
              const expiresIn = parseInt(responseData.expiresIn);
              const userId = responseData.localId;
              const email = responseData.email;
              const token = responseData.idToken;

              const currentTime = new Date().getTime(); // current time in milliseconds
              const expirationDate = new Date(currentTime + expiresIn);

              const user = new User(userId, email, token, expirationDate);

              return authenticateSuccess({ user: user });
            }),
            catchError(errorRes => {
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
            })
          );
      })
    );
  });

  authSucces = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authenticateSuccess),
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
}
