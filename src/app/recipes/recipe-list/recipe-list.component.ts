import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  //@Output() private recipeToDisplayId: EventEmitter<number>;
  recipes: Recipe[];
  subcription: Subscription;

  constructor(private recipeService: RecipeService) {
    //this.recipeToDisplayId = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.subcription = this.recipeService.recipeChangesDetect.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
