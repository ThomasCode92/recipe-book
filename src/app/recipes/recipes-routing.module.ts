import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes.component';

import { AuthGuard } from '../auth/auth.guard';
import { RecipeResolver } from './recipe.resolver';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipeResolver],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipeResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
