import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StripeService } from 'src/app/recipes/recipe-list/stripe.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit, AfterViewInit {
  public recipeSelected: Recipe;
  public displayMenuManageRecipe: boolean = false;
  public recipeID: number;

  //Propiedades creadas para insertar el pago
  @ViewChild('cardInfo') cardInfo: ElementRef; //<-  Referencia a un elemento del template para añadir el recuadro de la tarjeta
  cardError: string = ''; //<- Contiene los mensajes de error
  card: any; //<- El elemento que contendrá nuestra tarjeta

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone, //<- Para poder forzar a que se muestren datos en el template desde el AfterViewInit
    private stripeService: StripeService
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

  /* MOSTRAR EL RECUADRO PARA INTRODUCIR LA TARJETA */
  ngAfterViewInit() {
    //Creo la tarjeta una vez que la página se ha renderizado => lo meto en el método ngAfterViewInit
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement); //indicamos donde cargar el recuadro de stripe
    this.card.addEventListener('change', this.onChange.bind(this)); //Añadimos un listener para que ejecute el método onChange cndo haya un cambio
  }

  /* CÓDIGO PARA CND YA HEMOS INTRODUCIDO EL NÚM DE TARJETA */
  onChange($event) {
    //onChange({error})<- "Object descructury: solo nos quedamos con el parametro que pedimos". En este caso en lugar de poner $event que devuelve todo sacamos solo error

    this.ngZone.run(() => {
      //<- Para que fuerce a actualizar el template pq con el string interpolation no esta mostrandose.
      if ($event.error && $event.error.message) {
        console.log('error tarjeta', $event.error.message);
        this.cardError = $event.error.message;
      } else {
        this.cardError = null;
      }
    });
  }

  //METODO PARA REALIZAR EL PAGO
  async payProduct() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      console.log(token);

      const price = 25.35;
      //this.stripeService.chargePayment(price, token.id);
    } else {
      //Tenemos un error => mostrar el error
      this.ngZone.run(() => {
        this.cardError = error.message;
      });
    }
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
