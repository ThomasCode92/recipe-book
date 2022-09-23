import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';

import { fetchRecipes, setRecipes } from './recipe.actions';

import { Recipe } from '../recipe.model';

const BASE_URL =
  'https://ng-recipe-book-ffe59-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchRecipes),
      switchMap(recipeData => {
        return this.http.get<Recipe[]>(BASE_URL + 'recipes.json');
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes: Recipe[]) => {
        return setRecipes({ recipes: recipes });
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
