import { createAction, props } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const setRecipes = createAction(
  '[Recipes] Set recipes',
  props<{ recipes: Recipe[] }>()
);
