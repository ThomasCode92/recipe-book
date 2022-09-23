import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import { addRecipe, updateRecipe } from '../store/recipe.actions';
import { AppState } from 'src/app/store/app.reducer';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private storeSub: Subscription | undefined;

  recipeId!: number;
  recipeForm!: FormGroup;
  editMode = false;

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipeId = parseInt(params['id']);
      this.editMode = params['id'] != null;

      console.log('Edit Mode', this.editMode);

      this.initForm();
    });
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }

  onAddIngredient() {
    const ingredients = <FormArray>this.recipeForm.get('ingredients');

    ingredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    const ingredients = <FormArray>this.recipeForm.get('ingredients');
    ingredients.removeAt(index);
  }

  onDeleteAllIngredient() {
    const ingredients = <FormArray>this.recipeForm.get('ingredients');
    ingredients.clear();
  }

  onSubmit() {
    const name = this.recipeForm.value.name;
    const description = this.recipeForm.value.description;
    const imagePath = this.recipeForm.value.imagePath;
    const ingredients = this.recipeForm.value.ingredients;

    const newRecipe = new Recipe(name, description, imagePath, ingredients);

    if (this.editMode) {
      this.store.dispatch(
        updateRecipe({ index: this.recipeId, newRecipe: newRecipe })
      );
    } else {
      this.store.dispatch(addRecipe({ recipe: newRecipe }));
    }

    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<FormGroup>([]);

    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map(recipeData => {
            return recipeData.recipes.find((recipe, index) => {
              return index === this.recipeId;
            });
          })
        )
        .subscribe(recipe => {
          if (!recipe) return;

          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          if (recipe.ingredients) {
            for (let ingredient of recipe.ingredients) {
              const recipeIngredient = new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
              });

              recipeIngredients.push(recipeIngredient);
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
}
