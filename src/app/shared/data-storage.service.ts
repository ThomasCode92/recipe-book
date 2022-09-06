import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';

import { Recipe } from '../recipes/recipe.model';

const BASE_URL =
  'https://ng-recipe-book-ffe59-default-rtdb.europe-west1.firebasedatabase.app/';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  fetchRecipes() {
    this.http.get<Recipe[]>(BASE_URL + 'recipes.json').subscribe(recipes => {
      this.recipeService.updateRecipes(recipes);
    });
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http.put(BASE_URL + 'recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }
}
