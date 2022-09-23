import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';

import { fetchRecipes, setRecipes, storeRecipes } from './recipe.actions';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';

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

  storeRecipes = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesData]) => {
          const recipes = recipesData.recipes;
          return this.http.put(BASE_URL + 'recipes.json', recipes);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
