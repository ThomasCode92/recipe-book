import { createReducer, on } from '@ngrx/store';

import * as RecipeActions from './recipe.actions';

import { Recipe } from '../recipe.model';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export const recipeReducer = createReducer(
  initialState,
  on(RecipeActions.setRecipes, (state, { recipes }) => ({
    ...state,
    recipes: [...recipes],
  }))
);
