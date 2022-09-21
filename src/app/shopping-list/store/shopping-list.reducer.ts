import { createReducer, on } from '@ngrx/store';

import * as ShoppingListActions from './shopping-list.actions';

import { Ingredient } from '../../shared/ingredient.model';

export interface AppState {
  shoppingList: State;
}

export interface State {
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number;
  ingredients: Ingredient[];
}

const initialState: State = {
  editedIngredient: null,
  editedIngredientIndex: -1,
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.startEdit, (state, { index }) => ({
    ...state,
    editedIngredient: { ...state.ingredients[index] },
    editedIngredientIndex: index,
  })),
  on(ShoppingListActions.cancelEdit, state => ({
    ...state,
    editedIngredient: null,
    editedIngredientIndex: -1,
  })),
  on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient],
  })),
  on(ShoppingListActions.addIngredients, (state, { ingredients }) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
    const ingredientIndex = state.editedIngredientIndex;
    const oldIngredient = state.ingredients[ingredientIndex];
    const updatedIngredient = { ...oldIngredient, ...ingredient };
    const updatedIngredients = [...state.ingredients];

    updatedIngredients[ingredientIndex] = updatedIngredient;

    return {
      ...state,
      editedIngredient: null,
      editedIngredientIndex: -1,
      ingredients: updatedIngredients,
    };
  }),
  on(ShoppingListActions.deleteIngredient, state => {
    const ingredientIndex = state.editedIngredientIndex;
    const updatedIngredients = state.ingredients.filter(
      (ingredient, idx) => idx !== ingredientIndex
    );

    return {
      ...state,
      editedIngredient: null,
      editedIngredientIndex: -1,
      ingredients: updatedIngredients,
    };
  })
);
