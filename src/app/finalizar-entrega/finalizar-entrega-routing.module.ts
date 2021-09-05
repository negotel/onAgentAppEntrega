import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalizarEntregaPage } from './finalizar-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: FinalizarEntregaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalizarEntregaPageRoutingModule {}
