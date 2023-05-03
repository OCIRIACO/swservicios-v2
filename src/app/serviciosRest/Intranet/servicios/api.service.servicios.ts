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

export class apiSolicitudServicios {

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

    //Post: Consultar solicitudes
    postConsultarSolicitudesServicios(datos: any): Observable<any> {

        let direccion = this.url + "intranet/servicios/consultar/solicitudes";

        let rootConsultarSolicitudesServicios: any
        let IconsultarSolicitudesServicios: any
        let Iparametros: any

        Iparametros = {
            ttiposolicitud: datos.ttiposolicitud,
            testatus: datos.testatus
        }

        IconsultarSolicitudesServicios = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }


        rootConsultarSolicitudesServicios = {
            servicios: IconsultarSolicitudesServicios
        }

        this.datosPost = JSON.stringify(rootConsultarSolicitudesServicios);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

    //Post: Consultar detalles de la solicitud 
    postConsultarDetalleSolicitud(datos: any): Observable<any> {

        let direccion = this.url + "intranet/servicios/consultar/detalles";
    
        let IrootSolicitudSalida: any
        let IconsultarDetalleSolicitud: any
        let Iparametros: any
    
        Iparametros = {
          etransaccion: datos.etransaccion
        }
    
    
        IconsultarDetalleSolicitud = {
          credencial: this.Icredencial,
          parametros: Iparametros
        }
    
        IrootSolicitudSalida = {
            servicios: IconsultarDetalleSolicitud
        }
    
        //json
        this.datosPost = JSON.stringify(IrootSolicitudSalida);
    
        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
          this.spinner.hide();
        }))
      }

    //Post: Actualizar estado de la solicitud
    postActualizarEstadoSolicitudServicio(datos: any): Observable<any> {
        let direccion = this.url + "intranet/servicios/actualizar/estadosolicitud";
        // Datos de usurios
        let usuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);
        let rootActualizarEstadoSolicitud: any
        let IactualizarEstadoSolicitud: any
        let Iparametros: any

        Iparametros = {
            etransaccion: datos.etransaccion,
            eusuario: usuario.ecodusuario,
            testatus: datos.testatus,
            tobservaciones: datos.tobservaciones
        }

        IactualizarEstadoSolicitud = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }


        rootActualizarEstadoSolicitud = {
            servicios: IactualizarEstadoSolicitud
        }

        this.datosPost = JSON.stringify(rootActualizarEstadoSolicitud);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

}