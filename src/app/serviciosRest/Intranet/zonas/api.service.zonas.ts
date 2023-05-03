import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of  } from 'rxjs';
import { IcredencialZonas, IconsultaZonas, IrootConsultaZonas, IregistrarZona, IrootRegistrarZona, IparametrosZonas, IactualizarZona ,IrootActualizarZona} from 'src/app/modelos/zonas/zonas.interfase'
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/modelos/global';


@Injectable({
    providedIn: 'root'
})

export class ApiServiceZonas {


      // Token local Storage
      token: any =  localStorage.getItem('token')

    url: string =  GlobalConstants.apiURL

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

    //POST: Consulta información zonas
    postConsultaZonas(): Observable<any[]> {

        let direccion = this.url + "intranet/zonas/consultar/zonasactivas";
        let datos: any;

        let IcredencialZonas: IcredencialZonas;
        let IconsultaZonas: IconsultaZonas;
        let IrootConsultaZonas: IrootConsultaZonas;

        IcredencialZonas = {
            token: this.token
        }

        IconsultaZonas = {
            credencial: IcredencialZonas
        }

        IrootConsultaZonas = {
            zonasActivas: IconsultaZonas
        }

        datos = JSON.stringify(IrootConsultaZonas);


        //return this.http.post<any[]>(direccion, datos).pipe();

        this.spinner.show();
        return this.http.post<any>(direccion, datos).pipe(finalize(() => {
           this.spinner.hide();
       }))

    }

    //POST: Registrar  zona
    postRegistrarZona(datos: any): Observable<any> {

        let datoresponse: any;
        let IcredencialZonas: IcredencialZonas;
        let IrootRegistrarZona: IrootRegistrarZona;
        let IactualizarZona: IactualizarZona;
        let IparametrosZonas: IparametrosZonas;

        IcredencialZonas = {
            token: this.token
        }



        IparametrosZonas = {
            zona: datos
        }

        IactualizarZona = {
            credencial: IcredencialZonas,
            parametros: IparametrosZonas
        }

        IrootRegistrarZona = {
            registrarZona: IactualizarZona
        }

        datos = JSON.stringify(IrootRegistrarZona);


        let direccion = this.url + "intranet/zonas/registrar/zona";

        this.spinner.show();
         return this.http.post<any>(direccion, datos).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //POST: Actualizar  zona
    postActualizarZona(datos: any): Observable<any> {

        let IcredencialZonas: IcredencialZonas;
        let IrootActualizarZona: IrootActualizarZona;
        let IregistrarZona: IregistrarZona;
        let IparametrosZonas: IparametrosZonas;

        IcredencialZonas = {
            token: this.token
        }



        IparametrosZonas = {
            zona: datos
        }

        IregistrarZona = {
            credencial: IcredencialZonas,
            parametros: IparametrosZonas
        }

        IrootActualizarZona = {
            especificacionZona: IregistrarZona
        }

        datos = JSON.stringify(IrootActualizarZona);


        let direccion = this.url + "intranet/zonas/actualizar/especificacionzona";

        this.spinner.show();

         return this.http.post<any>(direccion, datos).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }





}
