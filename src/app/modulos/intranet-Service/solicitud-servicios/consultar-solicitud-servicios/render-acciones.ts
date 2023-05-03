import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
         <button type="button" class="btn btn-xs btn-primary pull-right mr-2" (click)="e_detalle()" title="Detalle" > <i class="fas fa-info-circle fa-1x"></i></button>
        
        `  
})

export class RenderAcciones {
  parametros: any;

  constructor(private router:Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
  }


  e_detalle(){
    this.router.navigate(['/dashboard/intranet/servicios/detalles', this.parametros.data.etransaccion ]);  // nativo
  }


 

}