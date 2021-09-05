import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';
import { MensagensToastService } from '../services/mensagens-toast.service';
import { UsuarioService } from '../services/usuario.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  listaEntrega: any;
  totalEntrega = 0;
  totalEntregaFinalizada = 0;
  totalEntregaDevolucao = 0;
  totalEntregaRestante = 0;

  carregarSkeleton = false;

  token;

  constructor(
    public actionSheetController: ActionSheetController,
    public router: Router,
    private api: ApiService,
    private mostrarToast: MensagensToastService,
    private loading: LoadingService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    App.addListener('backButton', () => {
      App.exitApp();
    });
  }

  ionViewWillEnter() {
    this.carregarEntregas();
    console.log(App.getInfo());
  }

  /** carrega as entrega para o agente logado */
  async carregarEntregas() {
    this.loading.mostra('Aguarde, carregando registros...');
    await this.api.readData('/servicos/rota/lista/entregas?', { token: this.usuarioService.getToken() }).then((result: any) => {

      if (result.retorno !== true) {
        this.listaEntrega = null;
        this.loading.fecha();
      } else {

        //LISTA DE ENTREGAS
        this.listaEntrega = result.data;

        //RESUMO DO SERVIÇO DO AGENTE
        this.totalEntrega = result.total;
        this.totalEntregaFinalizada = result.finalizado;
        this.totalEntregaDevolucao = result.devolucao;
        this.totalEntregaRestante = result.restante;
        this.loading.fecha();
      }
    }, error => {
      this.listaEntrega = null;
      this.loading.fecha();
    });
  }

  doRefresh(event) {
    this.carregarEntregas();
    event.target.complete();
  }


  public async showActionSheet(data) {

    const telefone = data.telefone != null ? `Ligar para ${data.telefone}` : 'Sem Numero';

    const actionSheet = await this.actionSheetController.create({
      header: `Você selecionou a entrega ${data.eID}`,
      backdropDismiss: true,
      mode: 'md',
      buttons: [
        {
          text: 'Finalizar Entrega',
          icon: 'checkmark-done-sharp',
          role: 'destructive',
          handler: async () => {
            this.router.navigate([`/finalizar-entrega/${data.eID}`]);
          }
        },
        {
          text: 'Abrir Mapa',
          role: 'destructive',
          icon: 'map-outline',
          handler: () => {
            navigator.geolocation.getCurrentPosition(resp => {
              // CORDENADAS DESTINO
              const latDes = data.latitude;
              const lonDes = data.longitude;

              // CORDENADAS ATUAL
              const latPosition = resp.coords.latitude;
              const lonPosition = resp.coords.longitude;
              window.open(`https://www.google.com.br/maps/dir/${latPosition},${lonPosition}/${latDes},${lonDes}`, '_system');
            }, error => {
              this.mostrarToast.view('Erro ao abrir maps em seu dispositivo', 'danger', 'bottom');
            });
          }
        },
        {
          text: `${telefone}`,
          role: 'destructive',
          icon: 'call',
          handler: () => {
            if (data.telefone !== null && data.telefone !== '') {
              this.abrirWhastApp(data);
            } else {
              this.mostrarToast.view('O destinatario não possui um telefone cadastro!', 'danger', 'bottom');
            }
          }
        }
      ]
    });
    await actionSheet.present();
  }

  public async abrirWhastApp(data) {
    const actionSheet = await this.actionSheetController.create({
      header: 'O que você deseja realizar',
      backdropDismiss: true,
      mode: 'md',
      buttons: [
        {
          text: 'Abrir o WhastApp',
          icon: 'logo-whatsapp',
          role: 'destructive',
          handler: () => {
            window.location.href = `whatsapp://send?phone=+55${data.telefone}`;
          }
        },
        {
          text: 'Ligar',
          role: 'destructive',
          icon: 'call',
          handler: () => {
            window.location.href = `tel:${data.telefone}`;
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
