import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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
  editIngredientIndex: number;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subcription = this.shoppingListService.ingredientChangeIndex.subscribe((index: number) => {
      console.log('Edit Ingredient');
      const ingredient = this.shoppingListService.getIngredient(index);
      this.editMode = true;
      this.editIngredientIndex = index;
      this.formulario.form.setValue({ name: ingredient.name, amount: ingredient.amount });
    });
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  onSubmit(formulario: NgForm) {
    /*const ingredient = new Ingredient(
      this.nameInputRef.nativeElement.value,
      this.amountInputRef.nativeElement.value
    );*/
    console.log(formulario.value);
    const ingredient = new Ingredient(formulario.value['name'], formulario.value['amount']);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editIngredientIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.onClear();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editIngredientIndex);
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.formulario.reset();
  }
}
