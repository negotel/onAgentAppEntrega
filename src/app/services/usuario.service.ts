import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface IUsuario {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_motorist: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private userData = new BehaviorSubject<IUsuario>(undefined);


  constructor() {
    this.setUsuario(JSON.parse(localStorage.getItem('user')));
  }

  setUsuario(user) {
    this.userData.next(user);
  }

  getUsuario(): Observable<IUsuario> {
    return this.userData.asObservable();
  }

  getToken() {
    return this.userData.getValue()['data'].token;
  }

}
