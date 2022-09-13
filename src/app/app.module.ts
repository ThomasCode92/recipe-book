import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';

import { DropdownDirective } from './shared/dropdown.directive';
import { PlaceholderDirective } from './shared/placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    PlaceholderDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RecipesModule,
  ],
  providers: [
    RecipeService,
    ShoppingListService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
