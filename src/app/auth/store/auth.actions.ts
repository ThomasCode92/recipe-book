import { createAction, props } from '@ngrx/store';

import { User } from '../user.model';

export const signupStart = createAction(
  '[Auth] Signup start',
  props<{ email: string; password: string }>()
);

export const loginStart = createAction(
  '[Auth] Login start',
  props<{ email: string; password: string }>()
);

export const authenticateSuccess = createAction(
  '[Auth] Authenticate success',
  props<{ user: User }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate fail',
  props<{ message: string }>()
);

export const logout = createAction('[Auth] Logout');
