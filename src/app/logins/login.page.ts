import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  login() {
    this.router.navigate([`/home`]);
  }
}
