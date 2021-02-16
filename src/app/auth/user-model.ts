export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    //<- De esta forma no se puede modificar directamente el token
    //Comprobamos si el token ha expirado
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null; // Si ha expirado => es como si no lo tuviesemos
    }
    return this._token;
  }
}
