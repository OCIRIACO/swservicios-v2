import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'renderer-editar',
  template: `
  <input type="radio" formArrayName="checkPendientes"   name="checkCliente"  value="{{lblValue}}" id="{{lblValue}}" (change)="e_onChangeClienteDirecto(lblValue, $event.target)" >      
        `  
})

export class RenderAccionesAsignado {
  parametros: any;
  lblValue: string =''


  constructor(private router:Router) {
  }

  agInit(parametros: any): void {
    this.parametros = parametros;
    
    this.lblValue  =  this.parametros.data.ecodcliente
    
  }

  e_onChangeClienteDirecto(dato1:any, dato2: any){
  
    //this.parametros.context.componentParent.e_onChangeRoot(dato1,dato2 );

     this.parametros.context.componentParent.e_onChangeRootAsignado(dato1,dato2)
  }

  e_editar() {
    

      //this.parametros.context.componentParent.editarUsuario(this.parametros.data);
  }

 

}