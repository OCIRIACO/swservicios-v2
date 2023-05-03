import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/modelos/global';
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';



@Injectable({
    providedIn: 'root'
})


export class apiCodigosPostales {

    // Token local Storage
    token: any = localStorage.getItem('token')

    //Base URl
    url: string = GlobalConstants.apiURL

    //Credencial
    Icredencial: Icredencial

    //Post
    datosPost: any

    constructor(private http: HttpClient, private spinner: NgxSpinnerService,) {
        this.Icredencial = {
            token: this.token
        }
    }

    //Post: Consultar Codigo Postal
    postConsultarCodigoPostal(datos: any): Observable<any> {

        let direccion = this.url + "codigospostales/consultar/tipos/codigo";

        let IrootCodigoPostal: any
        let IcodigoPostal:any
        let Iparametros: any

        Iparametros = {
            ecodigopostal:datos.ecodigopostal
        }

        IcodigoPostal = {
            credencial:this.Icredencial,
            parametros:Iparametros
        }

        IrootCodigoPostal = {
            codigopostal: IcodigoPostal
        }

        this.datosPost = JSON.stringify(IrootCodigoPostal);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

}