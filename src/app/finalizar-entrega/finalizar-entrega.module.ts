import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalizarEntregaPageRoutingModule } from './finalizar-entrega-routing.module';

import { FinalizarEntregaPage } from './finalizar-entrega.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinalizarEntregaPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [FinalizarEntregaPage]
})
export class FinalizarEntregaPageModule {}
