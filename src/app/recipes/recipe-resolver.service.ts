import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private recipeService: RecipeService,
    private dataStorageService: DataStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const localRecipes = this.recipeService.getRecipes();
    if (localRecipes.length === 0) {
      return this.dataStorageService.fecthData().pipe(
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
    } else {
      return localRecipes;
    }
  }
}
