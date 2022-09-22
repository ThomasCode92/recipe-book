import { createAction, props } from '@ngrx/store';

import { User } from '../user.model';

export const LOGIN_START = '[Auth] Login start';

export const login = createAction('[Auth] Login', props<{ user: User }>());

export const logout = createAction('[Auth] Logout');
