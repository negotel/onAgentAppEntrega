import { MensagensToastService } from './../services/mensagens-toast.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  carregar = true;
  public userLogged = null;
  public logado;

  constructor(
    public mostraMensagem: MensagensToastService,
    private router: Router,
    private fb: FormBuilder,
    private login: LoginService) {
    this.formLogin = this.fb.group({
      placa: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.verificaLogado();
    if (this.logado !== false) {
      this.login.autenticaUsuario();
      this.router.navigate(['/home']);
    }
  }

  async ngOnInit() {
    await this.getDadosUsuarios();
  }

  get getPlaca() {
    return this.formLogin.controls.placa;
  }

  get getSenha() {
    return this.formLogin.controls.senha;
  }

  async logar() {
    this.carregar = false;
    await this.login.auth(this.formLogin.value).subscribe(response => {
      localStorage.setItem('logado', 'true');
      this.setSession(response);
      this.login.autenticaUsuario();
      this.router.navigate(['/home']);
      this.carregar = true;
    }, (e) => {
      this.carregar = true;
      this.mostraMensagem.view(e.error.message, 'danger', 'bottom');
    });
  }

  setSession(user) {
    this.userLogged = JSON.stringify(user);
    localStorage.setItem('user', this.userLogged);
  }

  getDadosUsuarios() {
    this.userLogged = JSON.parse(localStorage.getItem('user'));
  }

  verificaLogado() {
    const logadoTxt = localStorage.getItem('logado');
    this.logado = false;
    if (logadoTxt != null && logadoTxt !== undefined) {
      this.logado = true;
    }
  }
}
