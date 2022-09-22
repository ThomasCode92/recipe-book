import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { setRecipes } from '../recipes/store/recipe.actions';
import { AppState } from '../store/app.reducer';

import { RecipeService } from '../recipes/recipe.service';

import { Recipe } from '../recipes/recipe.model';

const BASE_URL =
  'https://ng-recipe-book-ffe59-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  fetchRecipes() {
    return this.http.get<Recipe[]>(BASE_URL + 'recipes.json').pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap(recipes => {
        this.store.dispatch(setRecipes({ recipes: recipes }));
      })
    );
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http.put(BASE_URL + 'recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }
}
