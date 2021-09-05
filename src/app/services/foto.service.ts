import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const formData = new FormData();

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  private isPhotoFile = new BehaviorSubject<any>(undefined);

  constructor(
    private platform: Platform,
    private storage: AngularFireStorage,
    private http: HttpClient,
  ) { }

  /*
    * 1 - Salva imagem em arquivo no dispositivo
  */

  public async salvaImagen(camera, dados) {
    // cria um novo nome para imagem
    // com os dados passando pelo paramentro dados
    const nomeImage = `${dados.id}_${dados.etiqueta}`;

    // conveter imagem para o formato BASE64
    const base64Data = await this.lerUmBase64(camera);
    return this.uploadFirebase(environment.pastaFirebase, dados, `${base64Data}`);
  }

  /** upload do arquivo para firebase google storage */
  private uploadFirebase(folder: string, data, base64: string): Promise<void> {

    // nome da imagem
    const novoNomeImage = `${data.id}_${data.etiqueta}`;
    let fileSendBase64 = `${base64}`;

    //adicionar data:image/jpeg;base64 para dispositivos mobiles
    if (this.platform.is('hybrid')) {
      fileSendBase64 = `data:image/jpeg;base64,${base64}`;
    }

    //criar o caminho da pasta do servidor
    const path = `${folder}/${Date.now()}_${novoNomeImage}.jpg`; // full path file
    const ref = this.storage.ref(path);
    const task = ref.putString(fileSendBase64, 'data_url'); // upload task
    return new Promise((resolve, reject) => {
      // salva as informaçoes do firebase
      this.getDownloadUrl(task, ref).subscribe((urlRetorno) => {

        formData.append('idProtocolo', data.id);
        formData.append('urlImg', urlRetorno);
        formData.append('token', data.token);

        this.isPhotoFile.next(true);

        //sobre as informações para plataforma de onlog.
        const response = this.http.post<string>(`${environment.apiUrl}/sicronizar/protocolo`, formData).toPromise();
        response.then((res: string) => {
          this.isPhotoFile.next(true);
          resolve();
        }).catch((e) => {
          reject();
        });
        resolve();
      });
    });
  }

  // Ler a foto da câmera no formato base64 com base na plataforma em que o aplicativo está sendo executado
  private async lerUmBase64(camera) {
    // Detectará Cordova ou Capacitor
    // Ler o arquivo no formato base64
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: camera.path
      });
      return file.data;
    } else {
      const response = await fetch(camera.webPath?? null);
      if (response !== null) {
        const blob = await response.blob();
        return await this.convertBlobBase64(blob) as string;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public isFoto(): Observable<boolean> {
    return this.isPhotoFile.asObservable();
  }

  /**
   * RESOLVE PROBLEMA PARA LER O ARQUIVO DO DISPOSITIVO
   */

  private getDownloadUrl(uploadTask: AngularFireUploadTask, ref: AngularFireStorageReference): Observable<string> {
    return from(uploadTask).pipe(switchMap(() => ref.getDownloadURL()));
  }

  private convertBlobBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = this.staticGetFileReader();
    reader.onerror = reject;

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(blob);
  });

  private staticGetFileReader(): FileReader {
    const fileReader = new FileReader();
    // eslint-disable-next-line no-underscore-dangle
    const zoneOrinalInstance = (fileReader as any).__zone_symbol__originalInstance;

    return zoneOrinalInstance || fileReader;
  }
}
