import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formulario', { static: false }) formulario: NgForm;
  //@ViewChild('name', { static: false }) nameInputRef: ElementRef;
  //@ViewChild('amount', { static: false }) amountInputRef: ElementRef;
  subcription: Subscription;
  editMode: boolean = false;
  //editIngredientIndex: number;

  constructor(
    //private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppStateType>
  ) {}

  ngOnInit(): void {
    /*  // Ya no nos suscribimos para obtener el ingrediente a modificar, sino que usamos el store 
    this.subcription = this.shoppingListService.ingredientChangeIndex.subscribe((index: number) => {
      console.log('Edit Ingredient SHOPPING-EDIT');
      const ingredient = this.shoppingListService.getIngredient(index);
      this.editMode = true;
      this.editIngredientIndex = index;
      this.formulario.form.setValue({ name: ingredient.name, amount: ingredient.amount });
    }); */

    //Nos subscribimos al store de shoppingList para ver que ingrediente queremos cambiar
    this.subcription = this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;

        this.formulario.form.setValue({
          name: stateData.editedIngredient.name,
          amount: stateData.editedIngredient.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();

    //Para parar la edición del ingrediente por si cerramos el componente
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(formulario: NgForm) {
    /*const ingredient = new Ingredient(
      this.nameInputRef.nativeElement.value,
      this.amountInputRef.nativeElement.value
    );*/

    const ingredient = new Ingredient(formulario.value['name'], formulario.value['amount']);
    if (this.editMode) {
      //Estamos editando el ingrediente
      this.onEdit(ingredient);
    } else {
      //Estamos añadiendo el ingrediente
      this.onAdd(ingredient);
    }
    this.onClear();
  }

  onAdd(ingredient: Ingredient) {
    //Ya no usamos el Servicio para añadir y consultar datos
    //this.shoppingListService.addIngredient(ingredient);

    //Llamamos al método dispatch del store para dispatch actions
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  onEdit(updatedIngredient: Ingredient) {
    //Ya no actualizamos la lista de ingredientes almacenada en el servicio
    //this.shoppingListService.updateIngredient(this.editIngredientIndex, updatedIngredient);

    //Actualizamos los datos del Store
    this.store.dispatch(new ShoppingListActions.Updatengredient(updatedIngredient));
  }

  onDelete() {
    //Ya no borramos el ingrediente de los datos del almacenados en el Servicio, sino que lo hacemos del Store
    //this.shoppingListService.deleteIngredient(this.editIngredientIndex);

    //Eliminamos el dato del store
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.formulario.reset();
    //Para parar la edición del ingrediente
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
