import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [
    /*
    // Ya no usamos mock data, sino que los descargamos del servidor
    new recipe(
      'recetaa',
      'esta es la descripción de la receta a',
      'https://nosolodulces.es/wp-content/uploads/2016/01/receta-papas-alinadas-naranja-melva-1.jpg',
      [new ingredient('meat', 1), new ingredient('potatoes', 2)]
    ),
    new Recipe(
      'RecetaB',
      'Esta es la descripción de la receta B',
      'https://nosolodulces.es/wp-content/uploads/2016/01/receta-papas-alinadas-naranja-melva-1.jpg',
      [new Ingredient('Milk', 1), new Ingredient('Salt', 2)]
    ),
    new Recipe(
      'RecetaC',
      'Esta es la descripción de la receta C',
      'https://nosolodulces.es/wp-content/uploads/2016/01/receta-papas-alinadas-naranja-melva-1.jpg',
      [new Ingredient('Sugar', 1), new Ingredient('Pepper', 2)]
    ),
    new Recipe(
      'RecetaD',
      'Esta es la descripción de la receta D',
      'https://nosolodulces.es/wp-content/uploads/2016/01/receta-papas-alinadas-naranja-melva-1.jpg',
      [new Ingredient('Fish', 1), new Ingredient('Salad', 2)]
    ),*/
  ];

  //Para avisar a los componentes (recipe-list.component) de un cambio en el listado de recetas
  recipeChangesDetect: Subject<Recipe[]> = new Subject<Recipe[]>();

  constructor(
    private shoppingListService: ShoppingListService,
    private dataStorageService: DataStorageService
  ) {}

  //Almacenamos en el Servidor las recetas contenidas en memoria
  storageRecipesOnServer() {
    this.dataStorageService.storageData(this.recipes).subscribe(
      (result) => {
        console.log('Datos Almacenados Correctamente en el servidor', result);
      },
      (error) => {
        console.log('Error al Almacenar los datos en el Servidor', error);
      }
    );
  }

  //Recuperamos del Servidor las recetas almacenadas y las guardamos en memoria
  fetchRecipesFromServer() {
    this.dataStorageService.fecthData().subscribe((data) => {
      console.log('datos descargados', data);
      this.recipes = data;
      this.recipeChangesDetect.next(this.recipes.slice());
    });
  }

  //Modificamos las recetas cargadas en memoria
  setRecipes(recipes: Recipe[]) {
    console.log('setRecipes', recipes);
    this.recipes = recipes;
  }

  //Devuelve el listado de Recetas almacenadas en memora
  getRecipes() {
    return this.recipes.slice();
  }

  //Devuelve la Receta de posic index almacenada en memora
  getRecipe(index: number) {
    return { ...this.recipes[index] };
  }

  //Añade una Receta en la memoria
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    //Avisamos a los componentes subscritos al Subject del cambio en el listado
    this.recipeChangesDetect.next(this.recipes.slice());
  }

  //Actualiza los datos de una receta en la memoria
  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    //Avisamos a los componentes subscritos al Subject del cambio en el listado
    this.recipeChangesDetect.next(this.recipes.slice());
  }

  //Añade los ingredientes pasados a la lista de compra
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  //borra una receta de la memoria
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    //Avisamos a los componentes subscritos al Subject del cambio en el listado
    this.recipeChangesDetect.next(this.recipes.slice());
  }
}
