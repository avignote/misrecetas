import { templateJitUrl } from '@angular/compiler';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() itemSelected: EventEmitter<string> = new EventEmitter<string>();
  openDropdown: boolean = false;
  subcription: Subscription;
  userAuthenticated: boolean = false;

  constructor(private recipeService: RecipeService, private authService: AuthService) {}

  ngOnInit() {
    this.subcription = this.authService.user.subscribe((user) => {
      this.userAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  selectMenu(option: string) {
    console.log(option);
    this.itemSelected.emit(option);
  }

  saveOnServer() {
    this.recipeService.storageRecipesOnServer();
    this.openDropdown = false;
  }

  fecthFromServer() {
    this.recipeService.fetchRecipesFromServer();
    this.openDropdown = false;
  }

  logout() {
    if (this.userAuthenticated) {
      this.authService.logout();
    }
  }
}
