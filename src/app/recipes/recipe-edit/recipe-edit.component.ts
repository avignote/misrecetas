import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeID: number;
  message: string;
  editMode = false;
  formulario: FormGroup;

  //INYECTAMOS LAS DEPENDENCIAS EN EL CONSTRUCTOR
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {}

  //COMPROBAMOS SI EN LA URL SE LE HA PASADO UN ID DE RECETA, EN CUYO
  // CASO ESTAREMOS EDITANDO UNA RECETA, Y EN CASO CONTRARIO CREANDO UNA NUEVA
  ngOnInit(): void {
    this.recipeID = +this.route.snapshot.params['id'];
    if (isNaN(this.recipeID)) {
      this.message = 'Add New Recipe';
    } else {
      this.message = 'Edit Recipe ' + this.recipeID;
      this.editMode = true;
    }

    //Creamos el formulario typescript
    this.createForm();
  }

  //CREACIÓN DEL FORMULARIO TYPESCRIPT
  createForm() {
    let recipeName = '';
    let recipeDescription = '';
    let imagePath = '';
    //Creamos un formarray para los ingredientes vacio
    let recipeIngredients = this.fb.array([]);

    //Si estamos editando => recuperamos los datos de la receta
    // haciendo consulta al Servicio
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.recipeID);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      imagePath = recipe.imagePath;

      //Si estamos editando una receta, para cada ingrediente existente creamos
      //  un formgroup con los campos del ingrediente y lo añadimos al FormArray
      recipe.ingredients.forEach((ingredient: Ingredient) => {
        recipeIngredients.push(
          this.fb.group({
            name: [ingredient.name, Validators.required],
            amount: [
              ingredient.amount,
              [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)],
            ],
          })
        );
      });
    }

    //Creamos el formulario typescript con los datos correspondientes
    this.formulario = this.fb.group({
      name: [recipeName, Validators.required],
      description: [recipeDescription, Validators.required],
      imagePath: [imagePath, Validators.required],
      ingredients: recipeIngredients,
    });
  }

  //CREAMOS GET PARA PODER ESCRIBIR DIRECTAMENTE formArrayIngredients EN EL TEMPLATE
  // Y QUE NOS DEVUELVA EL FORMARRAY
  get formArrayIngredients(): FormArray {
    return this.formulario.get('ingredients') as FormArray;
  }

  //formulario.get('ingredients').controls NO funciona en modo producción
  //  desde el template porque no sabe que get('ingredients') es un FormArray
  // => lo modificamos de esta forma para que compile en modo producción
  get ingredientsControls() {
    return (this.formulario.get('ingredients') as FormArray).controls;
  }

  //METODO A EJECUTAR AL PULSAR AÑADIR INGREDIENTE: CREA UN FORMGROUP VACIO Y LO AÑADE
  // AL FORMARRAY PARA QUE ESCRIBAMOS LOS DATOS
  addIngredient() {
    this.formArrayIngredients.push(
      this.fb.group({
        name: ['', Validators.required],
        amount: [null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]],
      })
    );
  }

  deleteIngredient(index: number) {
    console.log(this.formulario);
    // this.formulario.value['ingredients'].splice(index, 1); <-- NO FUNCIONA
    //(<FormArray>this.formulario.value['ingredients']).removeAt(index);<-- NO FUNCIONA
    (<FormArray>this.formulario.get('ingredients')).removeAt(index); // <- IMP: USAMOS REMOVEAT(INDEX)
  }

  //MÉTODO PARA GUARDAR LA RECETA NUEVA O LA RECETA EDITADA
  onSubmit() {
    /*
    //Opción A para obtener los datos de la receta: Recuperamos los valores individualmente 
    const recipe: Recipe = new Recipe(
      this.formulario.value['name'],
      this.formulario.value['description'],
      this.formulario.value['imagePath'],
      this.formulario.value['ingredients']
    );
    */

    //Opción B para obtener los datos de la receta: Puesto que los formControls del
    // formulario se llaman igual que los campos de la Recipe => con formulario.value
    // obtenemos directamente un objeto de tipo receta
    const recipe = this.formulario.value;

    //Usamos el Servicio para notificarle el cambio y que este además de guardar el
    //cambio también avise a los observers de los cambios realizados en las recetas.
    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeID, recipe);
    } else {
      this.recipeService.addRecipe(recipe);
    }

    //return to previous page
    this.goUp();
  }

  //MÉTODO PARA EJECUTAR AL PULSAR EL BOTÓN CANCEL
  cancel() {
    this.goUp();
  }

  //IR A LA PÁGINA SUPERIOR
  goUp() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
