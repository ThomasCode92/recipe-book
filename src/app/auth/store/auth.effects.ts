import { Actions, createEffect, ofType } from '@ngrx/effects';

import { LOGIN_START } from './auth.actions';

export class AuthEffects {
  authLogin = this.actions$.pipe(
    ofType(LOGIN_START)
  );

  constructor(private actions$: Actions) {}
}
