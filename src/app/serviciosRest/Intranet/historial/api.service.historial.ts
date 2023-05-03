import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';

import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { GlobalConstants } from 'src/app/modelos/global';
import { IRootconsultaHistorial, IconsultaHistorial, Imarca} from 'src/app/modelos/historial/historial.interfase'

@Injectable({
    providedIn: 'root'
})

export class ApiServiceHistorial {

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


    //Post: Consulta Historial de bienes
    postConsultaHistorial(datos:any): Observable<any>{

        let direccion = this.url + "intranet/bienes/consultar/tracking";
        let parametros: any;

        let IRootconsultaHistorial : IRootconsultaHistorial;
        let IconsultaHistorial: IconsultaHistorial
        let Imarca: Imarca


        Imarca = {
            tbusqueda: datos.tbusqueda,
            tvalor:datos.tvalor
        }

        IconsultaHistorial ={
            credencial: this.Icredencial,
            parametros: Imarca
        }

        IRootconsultaHistorial = {
            consultarTracking : IconsultaHistorial
        }

        this.datosPost = JSON.stringify(IRootconsultaHistorial);
        
        this.spinner.show();
        return this.http.post<any>(direccion,this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))


    }

}