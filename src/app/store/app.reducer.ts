import { ActionReducerMap } from '@ngrx/store';

import { State as AuthState, authReducer } from '../auth/store/auth.reducer';
import {
  State as ShoppingListState,
  shoppingListReducer,
} from '../shopping-list/store/shopping-list.reducer';

export interface AppState {
  auth: AuthState;
  shoppingList: ShoppingListState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  shoppingList: shoppingListReducer,
};
