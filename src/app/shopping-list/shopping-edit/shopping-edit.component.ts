import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import {
  addIngredient,
  updateIngredient,
  deleteIngredient,
  cancelEdit,
} from '../store/shopping-list.actions';
import { AppState } from '../../store/app.reducer';

import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private storeSub!: Subscription;
  private editedItem!: Ingredient;

  editMode = false;

  @ViewChild('form') shoppingListForm!: NgForm;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient!;

        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(cancelEdit());
  }

  onSubmit(form: NgForm) {
    const ingredientName = form.value.name;
    const ingredientAmount = form.value.amount;

    const ingredient = new Ingredient(ingredientName, ingredientAmount);

    if (this.editMode) {
      this.store.dispatch(
        updateIngredient({
          ingredient: ingredient,
        })
      );
    } else {
      this.store.dispatch(addIngredient({ ingredient: ingredient }));
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onDeleteItem() {
    this.store.dispatch(deleteIngredient());

    this.onClearForm();
  }

  onClearForm() {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(cancelEdit());
  }
}
