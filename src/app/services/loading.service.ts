import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = true;
  constructor(
    private load: LoadingController
  ) { }

  async mostra(messagem: string = 'Aguarde, carregando informações...') {
    this.loading = true;
    return await this.load.create({
      mode: 'ios',
      message: messagem,
    }).then(a => {
      a.present().then(() => {
        if (!this.loading) {
          a.dismiss().then(() => { });
        }
      });
    });
  }

  async fecha() {
    this.loading = false;
    return await this.load.dismiss().then(() => { });
  }
}
