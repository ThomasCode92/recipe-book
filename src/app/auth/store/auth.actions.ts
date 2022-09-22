import { createAction, props } from '@ngrx/store';

import { User } from '../user.model';

export const loginStart = createAction(
  '[Auth] Login start',
  props<{ email: string; password: string }>()
);

export const login = createAction('[Auth] Login', props<{ user: User }>());

export const logout = createAction('[Auth] Logout');
