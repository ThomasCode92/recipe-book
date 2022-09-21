import { createReducer } from '@ngrx/store';

import { User } from '../user.model';

export interface State {
  user: User | null;
}

const initialState: State = {
  user: null,
};

export const authReducer = createReducer(initialState);
