
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConstants } from 'src/app/modelos/global';
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';


@Injectable({
  providedIn: 'root'
})


export class apiServiceSolicitudServicios {

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




  //POST: Consultar bien en existencia
  postConsultarServicioBien(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/consultar/bien";

    //(I)Interface
    let rootBien: any
    let Ibien: any
    let Iparametros: any

    Iparametros = {
      tbusqueda: datos.tbusqueda,
      tvalor: datos.tvalor
    }

    Ibien = {
      credencial: this.Icredencial,
      parametros: Iparametros
    }

    rootBien = {
      bien: Ibien
    }


    this.datosPost = JSON.stringify(rootBien);

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }

  //Post:Actualizar una solicitud de servicio
  postActualizarSolicitudServicio(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/actualizar/solicitudservicio";

    let IrootSolicitudServicio: any
    let IsolicitudServicio: any
    let IparametrosSolicitudServicio: any


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudServicio = {
      solicitud: datos
    }

    IsolicitudServicio = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicio
    }

    IrootSolicitudServicio = {
      solicitudservicio: IsolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicio);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }


  //Post: Crear una solicitud de servicio
  postCrearSolicitudServicio(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/registrar/solicitudservicio";

    let IrootSolicitudServicio: any
    let IsolicitudServicio: any
    let IparametrosSolicitudServicio: any


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudServicio = {
      solicitud: datos
    }

    IsolicitudServicio = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicio
    }

    IrootSolicitudServicio = {
      solicitudservicio: IsolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicio);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //Post: Actualizar una solicitud de servicio con guia solicitudserviciocarga
  //Post: Crear una solicitud de servicio guia
  postActualizarSolicitudServicioGuia(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/actualizar/solicitudserviciocarga";

    let IrootSolicitudServicio: any
    let IsolicitudServicio: any
    let IparametrosSolicitudServicio: any


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudServicio = {
      solicitud: datos
    }

    IsolicitudServicio = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicio
    }

    IrootSolicitudServicio = {
      solicitudservicio: IsolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicio);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //Post: Crear una solicitud de servicio guia
  postCrearSolicitudServicioGuia(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/registrar/solicitudserviciocarga";

    let IrootSolicitudServicio: any
    let IsolicitudServicio: any
    let IparametrosSolicitudServicio: any


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudServicio = {
      solicitud: datos
    }

    IsolicitudServicio = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicio
    }

    IrootSolicitudServicio = {
      solicitudservicio: IsolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicio);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }


  // Post: Consultar solicitude de salidas 15 dias
  postConsultarSolicitudesServicios(datos: any): Observable<any> {
    let direccion = this.url + "customer/servicios/consultar/solicitudes";

    let RootRangosolicitudes = {}
    let Rootcredencial = {}
    let token = {}

    token = {
      token: this.token
    }



    Rootcredencial = {
      credencial: token,
      parametros: datos
    }

    RootRangosolicitudes = {
      solicitudes: Rootcredencial
    }


    this.spinner.show();
    return this.http.post<any>(direccion, RootRangosolicitudes).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }


  //POST: Consulta informacio de la solicitud de salida
  postConsultarSolicitudServicio(datos: any): Observable<any> {

    let IRootConsultarSolicitudServicio: any
    let IconsultarSolicitudServicio: any


    IconsultarSolicitudServicio = {
      credencial: this.Icredencial,
      parametros: datos
    }

    IRootConsultarSolicitudServicio = {
      solicitudservicio: IconsultarSolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IRootConsultarSolicitudServicio);

    let direccion = this.url + "customer/servicios/consultar/solicitudservicio";

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }


  //Post: Actualizar solicitud de servicios
  postActualizarSolicitudServicios(datos: any): Observable<any> {

    let direccion = this.url + "customer/servicios/actualizar/solicitudservicio";



    let IrootSolicitudServicioUpdadate: any
    let IsolicitudServicioUpdate: any
    let IparametrosSolicitudServicioUpdate: any

    IparametrosSolicitudServicioUpdate = {
      solicitud: datos
    }

    IsolicitudServicioUpdate = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicioUpdate
    }

    IrootSolicitudServicioUpdadate = {
      solicitudservicio: IsolicitudServicioUpdate
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicioUpdadate);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }

  //Post: Actualizar solicitud de servicios
  postConsultarTiposServicios(datos: any): Observable<any> {

    let direccion = this.url + "customer/servicios/consultar/tiposervicios";


    let IrootServivicios: any
    let Iservicios: any
    let Iparametro: any

    Iparametro = {
      tunidad: datos.tunidad,
      tservicio: datos.tservicio
    }

    Iservicios = {
      credencial: this.Icredencial,
      parametros: Iparametro
    }

    IrootServivicios = {
      servicios: Iservicios
    }


    //json
    this.datosPost = JSON.stringify(IrootServivicios);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))

  }


  //Crear solicitud de servicio: AUTO SERVICIO

  //Post: Crear una solicitud de auto servicio con numero de guía
  postCrearSolicitudAutotransporte(datos: any): Observable<any> {

    //Direccion
    let direccion = this.url + "customer/servicios/registrar/autotransporte";

    let IrootSolicitudServicio: any
    let IsolicitudServicio: any
    let IparametrosSolicitudServicio: any


    //Recibo los datos capturados y procesados del formulario
    IparametrosSolicitudServicio = {
      solicitud: datos
    }

    IsolicitudServicio = {
      credencial: this.Icredencial,
      parametros: IparametrosSolicitudServicio
    }

    IrootSolicitudServicio = {
      autotransporte: IsolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IrootSolicitudServicio);


    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

  //POST: Consulta informacio de la solicitud de servicio de transporte
  postConsultarSolicitudTransporte(datos: any): Observable<any> {

    let IRootConsultarSolicitudServicio: any
    let IconsultarSolicitudServicio: any


    IconsultarSolicitudServicio = {
      credencial: this.Icredencial,
      parametros: datos
    }

    IRootConsultarSolicitudServicio = {
      solicitudservicio: IconsultarSolicitudServicio
    }

    //json
    this.datosPost = JSON.stringify(IRootConsultarSolicitudServicio);

    let direccion = this.url + "customer/servicios/consultar/solicitudtransporte";

    this.spinner.show();
    return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
      this.spinner.hide();
    }))
  }

    //Post: Actualizar solicitud de servicios
    postActualizarSolicitudTransporte(datos: any): Observable<any> {

      let direccion = this.url + "customer/servicios/actualizar/transporte";
  
  
  
      let IrootSolicitudServicioUpdadate: any
      let IsolicitudServicioUpdate: any
      let IparametrosSolicitudServicioUpdate: any
  
      IparametrosSolicitudServicioUpdate = {
        solicitud: datos
      }
  
      IsolicitudServicioUpdate = {
        credencial: this.Icredencial,
        parametros: IparametrosSolicitudServicioUpdate
      }
  
      IrootSolicitudServicioUpdadate = {
        solicitudservicio: IsolicitudServicioUpdate
      }
  
      //json
      this.datosPost = JSON.stringify(IrootSolicitudServicioUpdadate);
  
  
      this.spinner.show();
      return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
        this.spinner.hide();
      }))
  
    }

}