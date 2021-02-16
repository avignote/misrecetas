import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth.guard.service';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipe-resolver.service';
import { RecipesComponent } from './recipes.component';
import { SelectItemComponent } from './select-item/select-item.component';
const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    resolve: [RecipeResolverService],
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: SelectItemComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: 'recipe/:id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
      { path: 'recipe/:id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
