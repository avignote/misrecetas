import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.show') isShown: boolean = false;
  constructor() {}
  @HostListener('click') toggleMenu() {
    this.isShown = !this.isShown;
    console.log('btn pulsado');
  }
}
