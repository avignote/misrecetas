import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth.guard.service';
import { ShoppingListComponent } from './shopping-list.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: ShoppingListComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListRoutingModule {}
