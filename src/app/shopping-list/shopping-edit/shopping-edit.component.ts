import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { ShoppingListService } from '../shopping-list.service';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private startedEditingSub!: Subscription;
  private editMode = false;
  private editedItemIndex!: number;
  private editedItem!: Ingredient;

  @ViewChild('form') shoppingListForm!: NgForm;

  constructor(private shoppingListService: ShoppingListService) {}

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

  onAddItem(form: NgForm) {
    const ingredientName = form.value.name;
    const ingredientAmount = form.value.amount;

    const ingredient = new Ingredient(ingredientName, ingredientAmount);

    this.shoppingListService.addIngredient(ingredient);
  }
}
