import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]',
})
export class PlaceholderDirective {
  // Inyectamos ViewContainerRef que nos da un puntero a la posición dnd esta
  // directiva esta siendo usado
  //  IMP: lo añadimos como público para poder acceder a la posición desde fuera
  //     de la directiva
  constructor(public viewContainerRef: ViewContainerRef) {}
}
