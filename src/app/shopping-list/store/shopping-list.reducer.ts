import { Ingredient } from 'src/app/shared/ingredient.model';
//importamos todo las acciones y tipos de Shopping-list.actions.ts
import * as ShoppingListActions from './shopping-list.actions';

//Definimnos el tipo (las propiedades que va a tener)  el State del reducer ShoppingList
export interface ShoppingListStateType {
  ingredients: Ingredient[];
  editedIngredient: Ingredient; //Almacenará los datos del ingrediente a modificar
  editedIngredientIndex: number; //Almacenará la posición del ingrediente a modificar
}

//Definimos el tipo del State de la aplicación, que será la unión de los states de todos los reducers
export interface AppStateType {
  shoppingList: ShoppingListStateType;
}

//Definimos el state inicial
const initialState: ShoppingListStateType = {
  ingredients: [new Ingredient('Ingrediente A', 23), new Ingredient('Ingrediente B', 2)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActionsTypes //Para que acepte cualquier tipo de acción implementada en el ShoppingListActions
) {
  switch (action.type) {
    //Implemanetation to add a new Ingredient
    case ShoppingListActions.ADD_INGREDIENT: //'ADD_INGREDIENT':
      return {
        ...state, //por si hubiese + propiedades
        ingredients: [...state.ingredients, action.payload], //añadimos a los ingredientes anteriore, el nuevo ingrediente
      };

    //Implementation to add several Ingredients
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state, //por si hubiese + propiedades
        ingredients: [state.ingredients, ...action.payload], //añadimos a los ingredientes anteriore, LOS nuevoS ingredienteS
      };

    // Start ingredient Update: sets state.editedIngredientIndex with the position of the ingredient to update
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }, //Desestructuramos para que haga una copia y no modifique el valor del state anterior
      };

    //Implementation to update an Ingredient
    case ShoppingListActions.UPDATE_INGREDIENT:
      //console.log('Ingrediente modificado ', action.payload);
      const ingredientToUpdate = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredientToUpdate,
        ...action.payload,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1, //to clear editedIngredientIndex after ingredient update
        editedIngredient: null, //to clear editedIngredient after ingredient update
      };

    //Implementation to delete an Ingredient
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, index) => {
          return index !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1, //to clear editedIngredientIndex after ingredient delete
        editedIngredient: null, //to clear editedIngredient after ingredient delete
      };

    // Stop ingredient Update or Delete in case of Cancel operation
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null,
      };

    //Para que en el caso por defecto, sin ninguna acción, devuelva el estado actual
    default:
      return state;
  }
}
