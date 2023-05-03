import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/modelos/global';
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'



@Injectable({
  providedIn: 'root'
})


export class apiSolicitudSalidas {

  // Token local Storage
  token: any = localStorage.getItem('token')

  //Base URl
  url: string = GlobalConstants.apiURL

  //Credencial
  Icredencial: Icredencial

  //Post
  datosPost: any


  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private serviceDatosUsuario: serviceDatosUsuario) {

    this.Icredencial = {
      token: this.token
    }

  }

  //Post: Consultar solicitudes por estatus PENDIENTE-AUTORIZADA-RECHAZADA
  postConsultarSolicitudesSalidas(datos: any): Observable<any> {

    let direccion = this.url + "intranet/salidas/consultar/solicitudes";


    let rootConsultarSolicitudes: any
    let IconsultarSolicitudes: any
    let Iparametros: any

    Iparametros = {
      testatus: datos
    }

    IconsultarSolicitudes = {
      credencial: this.Icredencial,
      parametros: Iparametros
    }


    rootConsultarSolicitudes = {
      consultarSolicitudes: IconsultarSolicitudes
    }

    this.datosPost = JSON.stringify(rootConsultarSolicitudes);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }


  //POST: Consulta informacio de la solicitud de salida
  postConsultarSolicitudSalida(datos: any): Observable<any> {

    let direccion = this.url + "intranet/salidas/consultar/solicitud";

    let IrootSolicitudSalida: any
    let IconsultarSolicitudSalidas: any
    let Iparametros: any

    Iparametros = {
      eorden: datos
    }


    IconsultarSolicitudSalidas = {
      credencial: this.Icredencial,
      parametros: Iparametros
    }

    IrootSolicitudSalida = {
      solicitud: IconsultarSolicitudSalidas
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudSalida);

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //Post: Autorizar solicitud de salida
  postAutorizarSolicitudSalida(datos: any): Observable<any> {

    let direccion = this.url + "intranet/salidas/actualizar/autorizaSolicitud";

    // Datos de usurios
    let usuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);



    let IrootSolicitudSalida: any
    let IsolicitudSalida: any
    let Iparametros: any

    Iparametros = {
      eorden: datos.eorden,
      eusuario: usuario.ecodusuario
    }


    IsolicitudSalida = {
      credencial: this.Icredencial,
      parametros: Iparametros
    }


    IrootSolicitudSalida = {
      solicitud: IsolicitudSalida
    }


    //json
    this.datosPost = JSON.stringify(IrootSolicitudSalida);

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }

  //Post:Rechazar solicitud de salida
  //Post: Autorizar solicitud de salida
  postRechazarSolicitudSalida(datos: any): Observable<any> {

    let direccion = this.url + "intranet/salidas/actualizar/rechazarSolicitud";

    // Datos de usurios
    let usuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);



    let IrootSolicitudSalida: any
    let IsolicitudSalida: any
    let Iparametros: any

    let Isalida: any
    let Inotificacion: any


    Isalida = {
      eorden: datos.eorden,
      eusuario: usuario.ecodusuario
    }

    Inotificacion = {
      mensaje: datos.mensaje
    }

    Iparametros = {
      salida: Isalida,
      notifiacion: Inotificacion
    }


    IsolicitudSalida = {
      credencial: this.Icredencial,
      parametros: Iparametros
    }


    IrootSolicitudSalida = {
      solicitud: IsolicitudSalida
    }


    //json
    this.datosPost = JSON.stringify(IrootSolicitudSalida);

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }

}