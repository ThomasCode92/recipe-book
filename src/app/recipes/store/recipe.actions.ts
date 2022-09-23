import { createAction, props } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const fetchRecipes = createAction('[Recipes] Fetch recipes');

export const setRecipes = createAction(
  '[Recipes] Set recipes',
  props<{ recipes: Recipe[] }>()
);
