import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { login, loginStart } from './auth.actions';

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

              return login({ user: user });
            }),
            catchError(error => {
              // ...
              return of();
            })
          );
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
