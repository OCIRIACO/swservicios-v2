import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
         <button type="button" class="btn btn-xs btn-primary pull-right mr-2" (click)="e_editar()" title="Editar"> <i class="fas fa-edit fa-1x"></i> </button>        
        `  
})

export class RenderAcciones {
  parametros: any;


  constructor(private router:Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
    
  }

  e_editar() {
      this.parametros.context.componentParent.editarUsuario(this.parametros.data);
  }

 

}