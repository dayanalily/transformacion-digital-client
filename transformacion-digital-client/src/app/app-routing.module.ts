import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdressComponent } from './adress/adress.component';
import { TransferComponent } from './transfer/transfer.component';
import { HistoryComponent } from './history/history.component';


const routes: Routes = [
  { path: 'nuevo-destinatario', component: AdressComponent },
  { path: 'transferir', component: TransferComponent },
  { path: 'historial', component: HistoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
