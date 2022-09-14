import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ShoppingEditComponent, ShoppingListComponent],
  imports: [FormsModule, ShoppingListRoutingModule, SharedModule],
})
export class ShoppingListModule {}
