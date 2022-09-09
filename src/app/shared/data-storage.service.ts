import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';

import { Recipe } from '../recipes/recipe.model';

const BASE_URL =
  'https://ng-recipe-book-ffe59-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private recipeService: RecipeService
  ) {}

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user || !user.token) return throwError(() => 'Invalid user');
        console.log(user)
        return this.http.get<Recipe[]>(BASE_URL + 'recipes.json', {
          params: new HttpParams().set('auth', user.token),
        });
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap(recipes => {
        this.recipeService.updateRecipes(recipes);
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
