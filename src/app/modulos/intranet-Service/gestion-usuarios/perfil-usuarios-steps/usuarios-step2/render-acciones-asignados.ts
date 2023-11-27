import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
  <input type="checkbox" formArrayName="checkAsignados"  value="{{lblValue}}" (change)="e_onChangeAsignados(lblValue, $event.target)" >      
        `
})

export class RenderAccionesUsuariosAsignados {
  parametros: any;
  lblValue: string = ''


  constructor(private router: Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
    
    this.lblValue = this.parametros.data.ecodusuario

  }

  e_onChangeAsignados(dato1: any, dato2: any) {
    this.parametros.context.componentParent.e_onChangeRootAsignados(dato1, dato2);
  }

  e_editar() {
    

    //this.parametros.context.componentParent.editarUsuario(this.parametros.data);
  }



}