import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  //ingredients: Ingredient[];
  shoppingListData: Observable<fromShoppingList.ShoppingListStateType>;

  //subcription: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppStateType>
  ) {}

  ngOnInit(): void {
    this.shoppingListData = this.store.select('shoppingList');
    /*
    this.ingredients = this.shoppingListService.getIngredients();
    this.subcription = this.shoppingListService.ingredientsChange.subscribe((newIngredients) => {
      this.ingredients = newIngredients;
    });
    */
  }
  ngOnDestroy() {
    // this.subcription.unsubscribe();
  }

  editIngredient(index: number) {
    console.log('Edit ingredient: ', index);
    //Ya no usamos el Servicio para indicar que ingrediente actualizar
    //this.shoppingListService.ingredientChangeIndex.next(index);

    //LLamamos al action StartEdit para que cargue en el State el ingrediente y el index a actualizar
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
