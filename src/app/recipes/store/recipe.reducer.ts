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
  })),
  on(RecipeActions.addRecipe, (state, { recipe }) => ({
    ...state,
    recipes: [...state.recipes, recipe],
  })),
  on(RecipeActions.updateRecipe, (state, { index, newRecipe }) => {
    const updatedRecipe = { ...state.recipes[index], ...newRecipe };
    const updatedRecipes = [...state.recipes];

    updatedRecipes[index] = updatedRecipe;

    return { ...state, recipes: updatedRecipes };
  }),
  on(RecipeActions.deleteRecipe, (state, { index }) => {
    const updatedRecipes = state.recipes.filter((recipe, idx) => idx !== index);
    return { ...state, recipes: updatedRecipes };
  })
);
