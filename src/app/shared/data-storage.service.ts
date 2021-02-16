import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Almacenamos los datos en Firebase y devolvemos un Observable con los resultados
  storageData(recipes: Recipe[]) {
    return this.http.put(
      'https://recipes-b8acd-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      recipes
    );
  }

  // Recuperamos los datos de Firebase y devolvemos un Observable con los resultados
  fecthData() {
    return this.http
      .get<Recipe[]>(
        'https://recipes-b8acd-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          //Capturamos la respuesta antes del subscribe para que si una receta no tiene el atributo ingredients, añadirle el atributo con el valor de array vacio.
          return recipes.map((recipe) => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        })
      );
  }
}
