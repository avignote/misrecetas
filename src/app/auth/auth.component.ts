import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  loginMode: boolean = true;
  isLoading: boolean = false;
  error: string = '';
  signCorrect: boolean = false;
  subscription: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get username() {
    return this.formulario.get('username');
  }
  get password() {
    return this.formulario.get('password');
  }

  onSubmit() {
    this.error = '';
    this.isLoading = true;
    this.signCorrect = false;
    let observable: Observable<AuthResponseData>;

    if (!this.loginMode) {
      observable = this.authService.signUp(this.username.value, this.password.value);
    } else {
      observable = this.authService.signIn(this.username.value, this.password.value);
    }

    observable.subscribe(
      (response) => {
        console.log(response);
        this.signCorrect = true;
        this.formulario.reset();
        this.isLoading = false;
        this.router.navigate(['recipes']);
      },
      (error) => {
        //console.log('error: ', error);
        //this.error = error;
        this.showErrorComponent(error);
        this.isLoading = false;
      }
    );
  }

  showErrorComponent(errorMsg: string) {
    //Obtenemos el punto del template donde vamos a insertar el alertComponent
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); //<- Limpiampos por si hubiera algo anterior

    //creamos un Factory con el que luego crearemos el AlertComponent
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    //Creamos el componente
    const conmponentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    //Añadimos el mensaje a mostrar al componente
    conmponentRef.instance.message = errorMsg;
    //Ponemos el listener a su Emitter
    this.subscription = conmponentRef.instance.closeModal.subscribe(() => {
      //nos desuscribimos
      this.subscription.unsubscribe();
      //liberamos el espacio
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    //Por si se cierra el componente sin cerrar el modal
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
