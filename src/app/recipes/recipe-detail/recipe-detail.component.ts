import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  public recipeSelected: Recipe;
  public displayMenuManageRecipe: boolean = false;
  public recipeID: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* this.recipeID = +this.route.snapshot.params['id'];
    this.recipeSelected = this.recipeService.getRecipe(this.recipeID);
    console.log(this.recipeSelected); */

    this.route.params.subscribe((data) => {
      this.recipeID = +data['id'];
      console.log(this.recipeID);
      this.recipeSelected = this.recipeService.getRecipe(this.recipeID);
    });
  }

  addIngredients() {
    this.recipeService.addIngredientsToShoppingList(this.recipeSelected.ingredients);
  }

  deleteRecipe() {
    const confirmDelete = window.confirm('Are you sure of deleting this recipe?');
    if (confirmDelete) {
      this.recipeService.deleteRecipe(this.recipeID);
      this.router.navigate(['/recipes']);
    }
  }
}
