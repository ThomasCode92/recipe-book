import { createAction, props } from '@ngrx/store';

import { User } from '../user.model';

export const LOGIN_START = '[Auth] Login start';

export const loginStart = createAction(
  LOGIN_START,
  props<{ email: string; password: string }>()
);

export const login = createAction('[Auth] Login', props<{ user: User }>());

export const logout = createAction('[Auth] Logout');
