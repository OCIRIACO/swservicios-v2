import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/modelos/global';
import { IrootValidarSalidaBienes, IvalidarSalidaBienes, IparametrosValidarSalidaBienes, IparametrosSolicitudSalida, IrootSolicitudSalida, IsolicitudSalida } from 'src/app/modelos/solicitudSalidas/solicitudSalida.inteface'
import { IRootConsultarSolicitudSalida, IconsultarSolicitudSalidas } from 'src/app/modelos/solicitudSalidas/consultarSolicitudSalidas'
import { IrootSolicitudSalidaUpdadate, IsolicitudSalidaUpdate, IparametrosSolicitudSalidaUpdate } from 'src/app/modelos/solicitudSalidas/actualizarSolicitudSalida'
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';


@Injectable({
  providedIn: 'root'
})


export class ApiServiceSolicituSalida {

  // Token local Storage
  token: any = localStorage.getItem('token')

  //Path global
  url: string = GlobalConstants.apiURL

  //Seguridad
  Icredencial: Icredencial;

  //Post variable global en esta interface
  datosPost: any;


  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
    this.Icredencial = {
      token: this.token
    }
  }

  //POST : Consulta la validacion de salida del bien
  postValidarSalidaBienes(datos: any): Observable<any> {

    //Preparo la interface
    let IrootValidarSalidaBienes: IrootValidarSalidaBienes
    let IvalidarSalidaBienes: IvalidarSalidaBienes
    let IparametrosValidarSalidaBienes: IparametrosValidarSalidaBienes

    //Preparo el llenado y ordenamiento de los datos
    IparametrosValidarSalidaBienes = {
      tbusqueda: datos.tbusqueda,
      tvalor: datos.tvalor
    }

    IvalidarSalidaBienes = {
      credencial: this.Icredencial,
      parametros: IparametrosValidarSalidaBienes
    }

    IrootValidarSalidaBienes = {
      validarSalidaBienes: IvalidarSalidaBienes
    }

    //json
    this.datosPost = JSON.stringify(IrootValidarSalidaBienes);


    //Enviar
    let direccion = this.url + "customer/salidas/consultar/validarsalida";
    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //Post: Solicitud de salida 
  postCrearSolicitudSalida(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/salidas/registrar/solicitudSalidas";

    let IrootSolicitudSalida: IrootSolicitudSalida
    let IsolicitudSalida: IsolicitudSalida
    let IparametrosSolicitudSalida: IparametrosSolicitudSalida


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudSalida = {
      solicitud: datos
    }

    IsolicitudSalida = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudSalida
    }

    IrootSolicitudSalida = {
      solicitudSalida: IsolicitudSalida
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudSalida);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }



  // Post: Consultar solicitude de salidas 15 dias
  postConsultarSolicitudesSalidas(): Observable<any> {
    let direccion = this.url + "customer/salidas/consultar/solicitudesSalida";

    let RootRangosolicitudes = {}
    let Rootcredencial = {}
    let token = {}

    token = {
      token: this.token
    }

    Rootcredencial = {
      credencial: token
    }

    RootRangosolicitudes = {
      solicitudesSalida: Rootcredencial
    }


    this.spinner.show();
    return this.http.post<any>(direccion, RootRangosolicitudes).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //POST: Consulta informacio de la solicitud de salida
  postConsultarSolicitudSalida(datos: any): Observable<any> {

    let IRootConsultarSolicitudSalida: IRootConsultarSolicitudSalida
    let IconsultarSolicitudSalidas: IconsultarSolicitudSalidas


    IconsultarSolicitudSalidas = {
      credencial: this.Icredencial,
      parametros: datos
    }

    IRootConsultarSolicitudSalida = {
      solicitudSalida: IconsultarSolicitudSalidas
    }

    //json
    this.datosPost = JSON.stringify(IRootConsultarSolicitudSalida);

    let direccion = this.url + "customer/salidas/consultar/solicitudSalida";
    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //Post: Actualizar solicitud de liberacion
  postActualizarSolicitud(datos: any): Observable<any> {

    let direccion = this.url + "customer/salidas/actualizar/solicitudsalida";



    let IrootSolicitudSalidaUpdadate: IrootSolicitudSalidaUpdadate
    let IsolicitudSalidaUpdate: IsolicitudSalidaUpdate
    let IparametrosSolicitudSalidaUpdate: IparametrosSolicitudSalidaUpdate

    IparametrosSolicitudSalidaUpdate = {
      solicitud: datos
    }

    IsolicitudSalidaUpdate = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudSalidaUpdate
    }

    IrootSolicitudSalidaUpdadate = {
      solicitudsalida: IsolicitudSalidaUpdate
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudSalidaUpdadate);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }

}