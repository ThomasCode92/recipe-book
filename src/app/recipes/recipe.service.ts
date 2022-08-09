import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://i.pinimg.com/originals/8d/c5/31/8dc531fd1168a51c9e5bc9aca0d45051.jpg'
    ),
    new Recipe(
      'A Second Recipe',
      'This is simply is a 2nd test',
      'https://i.pinimg.com/originals/8d/c5/31/8dc531fd1168a51c9e5bc9aca0d45051.jpg'
    ),
  ];

  recipeSelected = new EventEmitter<Recipe>();

  getRecipes() {
    return [...this.recipes];
  }
}
