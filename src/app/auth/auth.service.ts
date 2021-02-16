import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user-model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private tokenTimeOut: any;

  constructor(private http: HttpClient, private router: Router) {
    //Trying to get Auth Token from localStorage
    this.getTokenFromStorage();
  }

  handleError(errorResponse) {
    let error = 'An unknown error occurred!';
    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          error = 'This email already exists in the system';
          break;
        case 'WEAK_PASSWORD':
          error = 'The password must be at least 6 characters long';
          break;
        case 'EMAIL_NOT_FOUND':
          error = 'This email does not belong to our system';
          break;
        case 'INVALID_PASSWORD':
          error = 'The password is not correct';
          break;
        case 'USER_DISABLED':
          error = 'The user has been disabled';
          break;
        default:
          error = 'An unknown error occurred!';
      }
    }
    return throwError(error);
  }

  getUserData(responseData: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
    const userLogged = new User(
      responseData.email,
      responseData.localId,
      responseData.idToken,
      expirationDate
    );
    //Broadcast login user data
    this.user.next(userLogged);
    //Store login user data to localStorage
    this.storeToken(userLogged);
    //Set expiration TimeOut
    this.setTokenExpirationDateTimeOut(expirationDate);
  }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return this.handleError(errorResponse);
        }),
        tap((responseData) => {
          this.getUserData(responseData);
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return this.handleError(errorResponse);
        }),
        tap((responseData) => {
          this.getUserData(responseData);
        })
      );
  }

  logout() {
    //Broadcast no user in memory
    this.user.next(null);
    //Delete Token from local Storage
    this.deleteTokenFromStorage();
    //Clear token expiration date timeout
    if (this.tokenTimeOut) {
      clearTimeout(this.tokenTimeOut);
    }
    //go to login page
    this.router.navigate(['/login']);
  }

  storeToken(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /* TRY TO GET VALID TOKEN FROM STORAGE*/
  getTokenFromStorage() {
    //Definimos el tipo de datos que vamos a recibir ya que no es de tipo <User> esactamente. El motivo es que _tokenExpirationDate es almacenado como string y no como de tipo <Date>
    let storedData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string; //Esta campo es Date en <User> pero en localStorage esta almacenado como String
    };

    //Comprobamos si tenemos datos del token en localStorage
    storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      //Comprobamos si aún el token es vigente
      const tokenExpirationDate = new Date(storedData._tokenExpirationDate);
      if (new Date() < tokenExpirationDate) {
        const userData = new User(
          storedData.email,
          storedData.id,
          storedData._token,
          tokenExpirationDate
        );
        this.user.next(userData);
        this.setTokenExpirationDateTimeOut(tokenExpirationDate);
      }
    }
  }

  /* COUNTER TO LOGOUT AUTMATICALLY WHEN EXPIRATIONDATE ARRIVES */
  setTokenExpirationDateTimeOut(expirationDate: Date) {
    //get number of milliseconds between now and expiration date
    const milliseconds = expirationDate.getTime() - new Date().getTime();
    console.log('milisegundos', milliseconds);
    this.tokenTimeOut = setTimeout(() => {
      this.logout();
    }, milliseconds);
  }

  deleteTokenFromStorage() {
    localStorage.removeItem('userData');
  }
}
