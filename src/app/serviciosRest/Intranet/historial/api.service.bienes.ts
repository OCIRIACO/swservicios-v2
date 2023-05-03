import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';

import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { GlobalConstants } from 'src/app/modelos/global';
import {IRootconsultaInventarios,IconsultaInventarios} from 'src/app/modelos/historial/historial.interfase'

@Injectable({
    providedIn: 'root'
})


export class ApiServiceBienes {

    
    // Token local Storage
    token: any =  localStorage.getItem('token')


    url: string = GlobalConstants.apiURL
    Icredencial :  Icredencial
    datosPost   :  any

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
        this.Icredencial = {
            token: this.token
        }
    }

//Post: Consulta Entradas Bienes
 postConsultaEntradasBienes(datos:any): Observable<any>{
    
  let direccion = this.url + "intranet/bienes/consultar/inventarios";

  let IRootconsultaInventarios : IRootconsultaInventarios;

  let IconsultaInventarios : IconsultaInventarios;

  IconsultaInventarios = {
      credencial: this.Icredencial,
      parametros: datos
  }

  IRootconsultaInventarios ={
    consultarInventarios: IconsultaInventarios
  }

  this.datosPost = JSON.stringify(IRootconsultaInventarios);

  this.spinner.show();
  return this.http.post<any>(direccion,this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
  }))


 }

}