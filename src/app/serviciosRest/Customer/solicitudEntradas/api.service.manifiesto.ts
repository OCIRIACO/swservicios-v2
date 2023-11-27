import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IdatosResponse } from 'src/app/modelos/reponse.login.interfase';
import { Observable } from 'rxjs';
import { IconsultaPeriodo } from 'src/app/modelos/solicitudEntradas/datosconsultaperiodo.interfase';
import {  NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/modelos/global';
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { IconsultaUnManifiesto, IRootConsultaUnManifiesto } from 'src/app/modelos/solicitudEntradas/datosconsultamanifiesto.interfase';
import { IRootNotificaUnManifiesto,InotificaManifiesto  } from 'src/app/modelos/solicitudEntradas/notificamanifiesto.interfase';
import { IrectificaUnManifiesto, IRootrectificaUnManifiesto } from 'src/app/modelos/solicitudEntradas/rectificamanifiesto.interfase';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'


@Injectable({
  providedIn: 'root'
})


export class ApiServiceManifiesto {

  url: string = GlobalConstants.apiURL
  
   //Seguridad
   Icredencial: Icredencial;

  // Token local Storage
  token: any =  localStorage.getItem('token')

 // Global
  datosPost: any;


  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService, 
    private serviceDatosUsuario:serviceDatosUsuario
    ) {

    this.Icredencial = {
      token: this.token
    }

   }

  postNotifcaManifiesto(datos: any): Observable<any> {

    
      // Interfaces
      let rootNotifaManifiesto: IRootNotificaUnManifiesto;
      let datosNotificaManifiesto: InotificaManifiesto;

      datosNotificaManifiesto = {
        credencial: this.Icredencial,
        parametros:datos
      }

      rootNotifaManifiesto = {
        solicitudentrada: datosNotificaManifiesto
      }



    // Json final
    this.datosPost = JSON.stringify(rootNotifaManifiesto)

    let direccion = this.url + "customer/entradas/registrar/solicitudentrada";
    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
           this.spinner.hide();
       }))
  }

   //POST : Consulta manfiesto por periodo de 15 dias
   postConsultManifPeriodo(): Observable<IconsultaPeriodo[]> {
    
    let RootRangosolicitudes = {}
    let Rootcredencial = {}
    let token = {}
    let Iparametros:any

        //Datos del usuaro por [local storage]
        let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);


    token = {
      token:this.token
    }

    Iparametros = {
      eperfil: datosUsuario.eperfil
    }

    Rootcredencial =  {
      credencial: token,
      parametros:Iparametros
    }

   RootRangosolicitudes = {
       rangosolicitudes :  Rootcredencial
    }

    // Json final
    this.datosPost = JSON.stringify(RootRangosolicitudes)
    

    
     
    let direccion = this.url + "customer/entradas/consultar/rangosolicitudes";
    this.spinner.show();
    return this.http.post<IconsultaPeriodo[]>(direccion,  this.datosPost).pipe(finalize(() => {
           this.spinner.hide();
       }))
   }

   //POST: Consulta informacio del manifiesto 
   postConsultaManifiesto(datos:any): Observable<any>{

      // Root
      let RootConsultaUnManifiesto: IRootConsultaUnManifiesto;
      let IconsultaUnManifiesto: IconsultaUnManifiesto;
     // let Icredencial: Icredencial;

      IconsultaUnManifiesto = {
        parametros: datos,
        credencial:this.Icredencial
      }

      RootConsultaUnManifiesto = {
        consultarSolicitud: IconsultaUnManifiesto
      }

    // Json final
    this.datosPost = JSON.stringify(RootConsultaUnManifiesto)

    let direccion = this.url + "customer/entradas/consultar/solicitudentrada";
    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost ).pipe(finalize(() => {
           this.spinner.hide();
       }))
   }

   //POST: Actualizar datos de manifiesto
   postRectificaUnManifiesto(datos:any): Observable<any> {

    let IrectificaUnManifiesto: IrectificaUnManifiesto;
    let IRootrectificaUnManifiesto: IRootrectificaUnManifiesto;

    IrectificaUnManifiesto =  {
      credencial: this.Icredencial,
      parametros: datos
    }

    IRootrectificaUnManifiesto = {
      solicitudentrada: IrectificaUnManifiesto
    }


 // Json final
 this.datosPost = JSON.stringify(IRootrectificaUnManifiesto)

    let direccion = this.url + "customer/entradas/actualizar/solicitudentrada";
    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
           this.spinner.hide();
       }))
   }


}
