import { createAction, props } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const fetchRecipes = createAction('[Recipes] Fetch recipes');

export const storeRecipes = createAction('[Recipes] Store recipes')

export const setRecipes = createAction(
  '[Recipes] Set recipes',
  props<{ recipes: Recipe[] }>()
);

export const addRecipe = createAction(
  '[Recipes] Add recipe',
  props<{ recipe: Recipe }>()
);

export const updateRecipe = createAction(
  '[Recipes] Update recipe',
  props<{ index: number; newRecipe: Recipe }>()
);

export const deleteRecipe = createAction(
  '[Recipes] Delete recipe',
  props<{ index: number }>()
);
