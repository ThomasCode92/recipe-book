import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { deleteRecipe } from '../store/recipe.actions';
import { AppState } from '../../store/app.reducer';

import { Recipe } from '../recipe.model';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  recipeId!: number;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => {
          return parseInt(params['id']);
        }),
        switchMap(id => {
          this.recipeId = id;
          return this.store.select('recipes');
        }),
        map(recipeData => {
          return recipeData.recipes.find((recipe, index) => {
            return index === this.recipeId;
          });
        })
      )
      .subscribe(recipe => {
        if (!recipe) return;
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      addIngredients({ ingredients: this.recipe.ingredients })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ index: this.recipeId }));
    this.router.navigate(['/recipes']);
  }
}
