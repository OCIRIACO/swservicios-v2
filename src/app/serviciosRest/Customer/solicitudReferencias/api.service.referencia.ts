import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/modelos/global';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

import { rootReferencia, Ireferencia } from "src/app/modelos/interfaces/referencias.interfaces"
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';


@Injectable({
    providedIn: 'root'
})


export class serviceReferencia {

    url: string = GlobalConstants.apiURL

    // Token local Storage
    token: any = localStorage.getItem('token')

    constructor(private http: HttpClient,
        private spinner: NgxSpinnerService,
    ) { }

    //Adjuntar  file referencia
    e_adjuntarFile(datos: any): Observable<any> {

        let direccion = this.url + "customer/referencias/crear/uploadfile";

        this.spinner.show();
        return this.http.post<any>(direccion, datos).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

    //Crear solicitud de alta de referencia
    e_CrearReferencia(datos: any): Observable<any> {

        let rootReferencia: rootReferencia;
        let Ireferencia: Ireferencia;
        let Icredencial: Icredencial;

        Icredencial = {
            token: this.token
        }

        Ireferencia = {
            credencial: Icredencial,
            parametros: datos
        }

        rootReferencia = {
            solicitud: Ireferencia
        }


        

        let datospost = JSON.stringify(rootReferencia);

        let direccion = this.url + "customer/referencias/crear/referencia";

        this.spinner.show();
        return this.http.post<any>(direccion, datospost).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

    //Consultar solicitud(es) de alta de referencia

}

