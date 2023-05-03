import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
  <button type="button" class="btn btn-xs btn-primary pull-right mr-2" (click)="e_editar()" title="Editar" [disabled]=" (testatus == 'AUTORIZADA'|| testatus == 'CANCELADA' ) "  [style.cursor]="  (testatus == 'AUTORIZADA'|| testatus == 'CANCELADA' ) ? 'not-allowed' : '' "  [style.pointer-events]="  testatus == 'AUTORIZADA' ? 'all !important' : '' "  > <i class="fas fa-edit fa-1x"></i> </button>
  <button type="button" class="btn btn-xs btn-primary pull-right mr-2" (click)="e_detalle()" title="Detalle" > <i class="fas fa-info-circle fa-1x"></i></button>
 
        `
})

export class RenderAcciones {
  parametros: any;
  testatus: string = ''

  constructor(private router: Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
    this.testatus = this.parametros.data.testatus
  }

  e_editar() {
    this.router.navigate(['dashboard/customer/serviciocarga/editar', this.parametros.data.folioweb]);  // nativo
  }

  e_detalle() {
    this.router.navigate(['dashboard/customer/serviciocarga/detalle', this.parametros.data.folioweb]);  // nativo
  }



}