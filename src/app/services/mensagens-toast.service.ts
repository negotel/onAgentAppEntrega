import { Injectable } from '@angular/core';
import { AlertController, ToastController, ToastOptions } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class MensagensToastService {

  constructor(public toastController: ToastController) { }


  async view(tmessage, tcolor: string = 'primary', tposition: any = 'top', tduration: number = 3000) {

    const toast = await this.toastController.create({
      message: tmessage,
      duration: tduration,
      color: tcolor,
      cssClass: 'my-custom-class',
      position: tposition,
      mode: 'ios',
      buttons: [
        {
          side: 'end',
          icon: 'close-circle-outline',
          role: 'cancel'
        },
      ]
    });

    toast.present();
  }

  async fecha() {
    return await this.toastController.dismiss().then(() => { });
  }

  async messageJsonErro(r) {
    return await r.error.message;
  }
}
