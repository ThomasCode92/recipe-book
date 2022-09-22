import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { LOGIN_START } from './auth.actions';

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

export class AuthEffects {
  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOGIN_START),
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
            catchError(error => {
              // ...
              of();
            }),
            map(responseData => {
              of();
            })
          );
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
