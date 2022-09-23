import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, Observable, switchMap, take } from 'rxjs';

import { fetchRecipes, setRecipes } from './store/recipe.actions';
import { AppState } from '../store/app.reducer';

import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeResolver implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    this.store.dispatch(fetchRecipes());

    return this.actions$.pipe(
      ofType(setRecipes),
      take(1),
      switchMap(() => {
        return this.store.select('recipes').pipe(
          map(recipeState => {
            return recipeState.recipes;
          })
        );
      })
    );
  }
}
