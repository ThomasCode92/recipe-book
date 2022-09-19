import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as ShoppingListActions from '../store/shopping-list.actions';

import { ShoppingListService } from '../shopping-list.service';

import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private startedEditingSub!: Subscription;
  private editedItemIndex!: number;
  private editedItem!: Ingredient;

  editMode = false;

  @ViewChild('form') shoppingListForm!: NgForm;

  constructor(
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit(): void {
    this.startedEditingSub = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);

        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.startedEditingSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const ingredientName = form.value.name;
    const ingredientAmount = form.value.amount;

    const ingredient = new Ingredient(ingredientName, ingredientAmount);

    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        ingredient
      );
    } else {
      this.store.dispatch(
        ShoppingListActions.addIngredient({ ingredient: ingredient })
      );
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onDeleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClearForm();
  }

  onClearForm() {
    this.editMode = false;
    this.shoppingListForm.reset();
  }
}
