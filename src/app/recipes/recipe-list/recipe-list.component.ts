import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.reducer';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private recipesChangedSub!: Subscription;

  recipes: Recipe[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipesChangedSub = this.store
      .select('recipes')
      .pipe(
        map(recipeData => {
          return recipeData.recipes;
        })
      )
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

  ngOnDestroy(): void {
    this.recipesChangedSub.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
