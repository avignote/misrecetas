//import { Action } from "rxjs/internal/scheduler/Action";
//Actión no proviene de rxjs sino de ngrx
import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

//Action to add a new Ingredient
export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  //payload: Ingredient; //creamos var que contenga el ingrediente a añadir
  constructor(public payload: Ingredient) {}
}

//Action to add several new Ingredients
export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

//Action to start update or delete action setting the ingredient index to update or delete
export class StartEdit implements Action {
  type = START_EDIT;
  constructor(public payload: number) {} //payload will be the ingredient index to edit
}

//Action to update the data of an ingredient of the shopping-list
export class Updatengredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {} //Datos del nuevo ingrediente. Nota: No hace falta la posic pq esta indicada con el StartEdit
}

//Action to end the update process
export class StopEdit implements Action {
  type = STOP_EDIT;
  payload = null; //en este caso no se utilizará payload
}

//Action to delete an ingredient of the shopping-list
export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
  payload = null; //No se usa pq el elemento a modificar ya se ha indicado en la acción StartEdit
}

//Creamos un tipo con todas las Actions que se implementan en este fichero para shopping list
// En el reducer, para el parámetro action, indicaremos este tipo para q acepte cualquier acción de estos tipos
export type ShoppingListActionsTypes =
  | AddIngredient
  | AddIngredients
  | StartEdit
  | Updatengredient
  | DeleteIngredient
  | StopEdit;
