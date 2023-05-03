import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
  <input type="checkbox" formArrayName="checkPendientes"  value="{{lblValue}}" (change)="e_onChange(lblValue, $event.target)" >      
        `  
})

export class RenderAcciones {
  parametros: any;
  lblValue: string =''


  constructor(private router:Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
   // console.log(parametros)
    this.lblValue  =  this.parametros.data.ecodusuario
    
  }

  e_onChange(dato1:any, dato2: any){
    this.parametros.context.componentParent.e_onChangeRoot(dato1,dato2 );
  }

  e_editar() {
    console.log(this.parametros.data)

      //this.parametros.context.componentParent.editarUsuario(this.parametros.data);
  }

 

}