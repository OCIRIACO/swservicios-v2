import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';

import { IregistrarUbicacion, IrootRegistrarUbicacion, IrootConsultaZonaDetalleUbicaciones, IconsultaZonaDetalleUbicaciones, IdetalleUbicacionConsulta, IparametrosDetUbicacionConsulta } from 'src/app/modelos/ubicaciones/ubicaciones.interfase'
import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { GlobalConstants } from 'src/app/modelos/global';


@Injectable({
    providedIn: 'root'
})


export class ApiServiceUbicaciones {

    // Token local Storage
    token: any = localStorage.getItem('token')

    url: string = GlobalConstants.apiURL
    Icredencial: Icredencial;
    datosPost: any;


    constructor(private http: HttpClient, private spinner: NgxSpinnerService) {

        this.Icredencial = {
            token: this.token
        }
    }

    //POST: Registrar ubicaciones
    postRegistrarUbicacion(datos: any): Observable<any> {

        let direccion = this.url + "intranet/ubicaciones/registrar/ubicaciones";
        let parametros: any;


        let IcredencialUbicaciones: Icredencial;
        let IregistrarUbicacion: IregistrarUbicacion;
        let IrootRegistrarUbicacion: IrootRegistrarUbicacion;

        IcredencialUbicaciones = {
            token: this.token
        }

        IregistrarUbicacion = {
            credencial: IcredencialUbicaciones,
            parametros: datos
        }

        IrootRegistrarUbicacion = {
            registrarUbicacion: IregistrarUbicacion
        }

        parametros = JSON.stringify(IrootRegistrarUbicacion);

       

        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    //Post: Consulta detalle ubicaciones por zona
    postConsultaDetallesUbicaciones(datos: any): Observable<any[]> {
        let direccion = this.url + "intranet/ubicaciones/consultar/detalleubicaciones";

        ;


        let IrootConsultaZonaDetalleUbicaciones: IrootConsultaZonaDetalleUbicaciones;
        let IconsultaZonaDetalleUbicaciones: IconsultaZonaDetalleUbicaciones;
        let IdetalleUbicacionConsulta: IdetalleUbicacionConsulta;

        let IparametrosDetUbicacionConsulta: IparametrosDetUbicacionConsulta;

        IdetalleUbicacionConsulta = {
            ecodzona: datos.ecodzona
        }

        IparametrosDetUbicacionConsulta = {
            detalleUbicacion: IdetalleUbicacionConsulta
        }

        IconsultaZonaDetalleUbicaciones = {
            credencial: this.Icredencial,
            parametros: IparametrosDetUbicacionConsulta
        }

        IrootConsultaZonaDetalleUbicaciones = {
            ubicacionesZona: IconsultaZonaDetalleUbicaciones
        }


        this.datosPost = JSON.stringify(IrootConsultaZonaDetalleUbicaciones);

        this.spinner.show();
        return this.http.post<any[]>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

    //Post: Eliminar ubicacion (realmente se manda a NO VIGENTE)
    postEliminarUbicacion(datos: any): Observable<any> {

        let direccion = this.url + "intranet/ubicaciones/eliminar/ubicacion";

        let rootEliminarUbicacion: any
        let IeliminarUbicacion: any
        let IrootUbicacion: any
        let Iubicacion: any



        Iubicacion = {
            ecodzona: datos.ecodzona,
            ecoddetubicacion: datos.ecoddetubicacion
        }

        IrootUbicacion = {
            ubicacion: Iubicacion
        }

        IeliminarUbicacion = {
            credencial: this.Icredencial,
            parametros: IrootUbicacion
        }

        rootEliminarUbicacion = {
            eliminarUbicacion: IeliminarUbicacion
        }

        this.datosPost = JSON.stringify(rootEliminarUbicacion);

        


        this.spinner.show();
        return this.http.post<any[]>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    // Post: Consultar la ocupaciones de los bienes en la zona
    postOcupacionBienes(datos: any): Observable<any> {

        let direccion = this.url + "intranet/ubicaciones/consultar/ocupacionbienes";

        let IdatosZona: any
        let Izona: any
        let IocupacionBienes: any
        let IrootOcupacionBienes: any

        IdatosZona = {
            ecodzona: datos.ecodzona,
            ecoddetubicacion: datos.ecoddetubicacion
        }

        Izona = {
            zona: IdatosZona
        }

        IocupacionBienes = {
            credencial: this.Icredencial,
            parametros: Izona
        }

        IrootOcupacionBienes = {
            ocupacionBienes: IocupacionBienes
        }

        this.datosPost = JSON.stringify(IrootOcupacionBienes);

       


        this.spinner.show();
        return this.http.post<any[]>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    // Post: Consultar bienes
    postBienes(datos: any): Observable<any> {

        let direccion = this.url + "intranet/ubicaciones/consultar/bienes";

        let rootBienes: any
        let IBienes: any
        let Iubicacion: any
        let rootUbicacion: any


        Iubicacion = {
            ecodzona: datos.ecodzona,
            tbloque: datos.tbloque,
            efila: datos.efila,
            ebahia: datos.ebahia
        }

        rootUbicacion = {
            ubicacion: Iubicacion
        }

        IBienes = {
            credencial: this.Icredencial,
            parametros: rootUbicacion
        }

        rootBienes =  {
            bienes: IBienes
        }


        this.datosPost = JSON.stringify(rootBienes);


        this.spinner.show();
        return this.http.post<any[]>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

}