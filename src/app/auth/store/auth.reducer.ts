import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

import { User } from '../user.model';

export interface State {
  loading: boolean;
  user: User | null;
  authError: string | null;
}

const initialState: State = {
  loading: false,
  user: null,
  authError: null,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.loginStart,
    AuthActions.signupStart,
    (state, { email, password }) => ({
      ...state,
      loading: true,
      authError: null,
    })
  ),
  on(AuthActions.authenticateFail, (state, { message }) => ({
    ...state,
    loading: false,
    user: null,
    authError: message,
  })),
  on(AuthActions.authenticateSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user: user,
    authError: null,
  })),
  on(AuthActions.logout, state => ({
    ...state,
    user: null,
  })),
  on(AuthActions.clearError, state => ({
    ...state,
    authError: null,
  }))
);
