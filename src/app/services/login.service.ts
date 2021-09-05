import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  usuarioAtenticado = false;

  public methodApi = 'auth';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  auth(login): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.methodApi}`, JSON.stringify(login));
  }

  autenticaUsuario() {
    this.usuarioAtenticado = true;
  }

  usuarioLogado() {
    this.usuarioAtenticado = false;
  }

  getUsuarioAutenticado() {
    return this.usuarioAtenticado;
  }
}
