import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, ImageOptions } from '@capacitor/camera';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { FotoService } from '../services/foto.service';
import { LoadingService } from '../services/loading.service';
import { MensagensToastService } from '../services/mensagens-toast.service';
import { InputAlertOcorrencia } from '../services/input-alert-ocorrencia';

import { faCamera, faCheck, faTruck, faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '../services/usuario.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-finalizar-entrega',
  templateUrl: './finalizar-entrega.page.html',
  styleUrls: ['./finalizar-entrega.page.scss'],
})
export class FinalizarEntregaPage implements OnInit {

  faCamera = faCamera;
  faTruck = faTruck;
  faCheck = faCheck;
  faLongArrowAltUp = faLongArrowAltUp;

  cameraResult = false;
  listaOcorrencia: any;
  resultTypeInputAlertOcorrencia = [];
  inputAlert: InputAlertOcorrencia;
  dados = false;

  timeline = false;

  nome: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: string;
  longitude: string;
  etiqueta: string;
  id: string;


  constructor(
    private foto: FotoService,
    private actionSheetCtrl: ActionSheetController,
    private loading: LoadingService,
    private alertController: AlertController,
    private mostrarToast: MensagensToastService,
    private router: Router,
    private api: ApiService,
    private activedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    App.addListener('backButton', () => {
      this.router.navigate([`/home`]);
    });
    this.id = this.activedRoute.snapshot.params.id;
  }


  ionViewWillEnter() {
    this.carregarEntrega();
  }

  /*
    * 1 - abri a camera do aparelho
    * 2 - tira foto do protocolo assinado pelo recebedo
    * 3 - envia a foto para o servidor via api firebase do google
  */
  abrirCamera() {
    const takePicture = async () => {

      this.loading.mostra('Aguarde, processando foto...');
      const options: ImageOptions = {
        quality: 100,
        width: 300,
        height: 300,
        presentationStyle: 'popover',
        webUseInput: false,
        promptLabelHeader: 'Selecione uma Opção:',
        promptLabelPhoto: 'Abrir Galeria',
        promptLabelPicture: 'Abrir Camera',
        saveToGallery: true,
        resultType: CameraResultType.Uri
      };

      const image = await Camera.getPhoto(options).catch((err) => {
        this.mostrarToast.view('Error ao processar foto, por favor tente novamente...', 'danger', 'bottom');
        this.loading.fecha();
      });
      await this.foto.salvaImagen(image, { etiqueta: this.etiqueta, id: this.id, token: this.usuarioService.getToken() });

      await this.foto.isFoto().subscribe(result => {
        if (result === true) {
          this.cameraResult = true;
          this.loading.fecha();
        }
      });

    };
    return takePicture();
  }

  /*
    * 1 - depois de salva a foto agora finaliza o processo de entrega
    * 2 - entrega com sucesso
    * 3 - entrega com insucesso
  */
  public async abrirActionSheet() {

    this.ocorrencia();

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'A Encomenda foi entregue?',
      mode: 'md',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Sim',
          icon: 'checkmark',
          role: 'destructive',
          handler: () => {
            this.finalizar('5', true);
          }
        },
        {
          text: 'Não',
          role: 'cancel',
          icon: 'close',
          handler: async () => {
            const alert = await this.alertController.create({
              inputs: this.resultTypeInputAlertOcorrencia,
              cssClass: 'my-custom-class',
              header: 'Ocorrências',
              message: 'Selecione uma ocorrêcia para entrega.',
              buttons: [{
                text: 'Selecionar',
                handler: async data => {
                  await this.finalizar(data[0]);
                }
              }]
            });
            await alert.present();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  /** carrega ocorrencia */
  async ocorrencia() {

    this.api.readData('/pesquisar-ocorrencias?', { token: this.usuarioService.getToken() }).then((result: any) => {
      this.inputAlert = new InputAlertOcorrencia();
      result.forEach((e) => {
        const r = {
          type: 'checkbox',
          label: e.description,
          value: e.id
        };
        this.resultTypeInputAlertOcorrencia.push(r);
      });
    }, error => {
      this.mostrarToast.view(error.error.message, 'danger');
    });
  }

  /** carrega dados da entrega */
  async carregarEntrega() {
    this.loading.mostra('Aguarde, Carregando dados...');
    await this.api.readData(`/entrega/${this.id}?`, { token: this.usuarioService.getToken() }).then((result: any) => {
      this.nome = result.data.nome;
      this.rua = result.data.rua;
      this.numero = result.data.numero;
      this.complemento = result.data.complemento;
      this.bairro = result.data.bairro;
      this.cidade = result.data.cidade;
      this.estado = result.data.uf;
      this.etiqueta = result.data.etiqueta;
      this.cep = result.data.cep;
      this.id = result.data.id;
      this.latitude = result.data.lat;
      this.longitude = result.data.lng;
      setTimeout(() => {
        this.dados = true;
      }, 700);
      this.loading.fecha();
    }, async error => {
      this.mostrarToast.view('Ops, Um erro ocorreu', 'danger', 'bottom');
      // this.router.navigate(['/home']);
      this.dados = false;
      this.loading.fecha();
    });
  }

  /** finalizar entrega */
  async finalizar(status: string = '5', ocorrencia: boolean = false) {
    await this.loading.mostra('Aguarde, enviado dados para finalizar entrega...');

    /** prepara dados para requisição api */
    const formData = new FormData();
    formData.append('ocorrencia_id', status);
    formData.append('item_id', this.id);
    formData.append('token', this.usuarioService.getToken());
    formData.append('motorista_id', '5');
    formData.append('observacoes', 'Entrega finalizada via mobile');
    formData.append('recebedor', null);
    formData.append('documento', '*');
    formData.append('telefone', null);
    formData.append('latitude', null);
    formData.append('longitude', null);

    /** envia dados */
    this.api.insertData(`/entrega/finalizar`, formData).then(() => {
      this.resultTypeInputAlertOcorrencia = [];
      this.cameraResult = false;

      if (!ocorrencia) {
        this.mostrarToast.view('Entrega finalizada como insucesso', 'warning', 'bottom');
      } else {
        this.mostrarToast.view('Entrega finalizada com sucesso', 'success', 'bottom');
      }

      this.loading.fecha();
      this.router.navigate(['/home']);
    }).catch(err => {
      this.mostrarToast.view('Ops, Um erro ocorreu', 'danger', 'bottom');
      this.loading.fecha();
    });

  }
}
