import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeId!: number;
  recipeForm!: FormGroup;
  editMode = false;
  canAddIngredient = true;

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipeId = parseInt(params['id']);
      this.editMode = params['id'] != null;

      console.log('Edit Mode', this.editMode);

      this.initForm();
    });
  }

  onAddIngredient() {
    const ingredientControls = this.ingredientControls;
    const lastControlIndex = ingredientControls.length - 1;
    const lastControl = ingredientControls[lastControlIndex];

    if (!lastControl.value.name && !lastControl.value.amount) return;

    ingredientControls.push(
      new FormGroup({
        name: new FormControl(),
        amount: new FormControl(),
      })
    );

    this.canAddIngredient = false;
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<FormGroup>([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.recipeId);

      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          const recipeIngredient = new FormGroup({
            name: new FormControl(ingredient.name),
            amount: new FormControl(ingredient.amount),
          });

          recipeIngredients.push(recipeIngredient);
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName),
      imagePath: new FormControl(recipeImagePath),
      description: new FormControl(recipeDescription),
      ingredients: recipeIngredients,
    });
  }
}
