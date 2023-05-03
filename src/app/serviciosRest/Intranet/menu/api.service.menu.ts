import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, finalize } from 'rxjs/operators';

import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { IRootConsultaMenuSistema, IconsultaMenuSistema, IparametrosMenu } from 'src/app/modelos/menu/datosConsultaMenuSistema.Interfase';
import { GlobalConstants } from 'src/app/modelos/global';
import {serviceDatosUsuario } from 'src/app/service/service.datosUsuario'


@Injectable({
    providedIn: 'root'
})


export class ApiServiceMenu {

    // Token local Storage
    token: any = localStorage.getItem('token')

    url: string = GlobalConstants.apiURL
    Icredencial: Icredencial
    datosPost: any


    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private serviceDatosUsuario : serviceDatosUsuario) {

        this.Icredencial = {
            token: this.token
        }
    }

    //POST: Consulta menu sistema INTRANET / CUSTOMER
    postConsultaMenuSistema(dato: any): Observable<any> {


        // Service con los datos del usurio en el local storage XD
        let usuario =  JSON.parse(this.serviceDatosUsuario.datosUsuario);


        let tipoConsulta = dato;

        let direccion = this.url + "intranet/menu/consultar/menusistema";
        let parametros: any;

        let IRootConsuntaMenuSistema: IRootConsultaMenuSistema;
        let IconsultaMenuSistema: IconsultaMenuSistema;
        let IparametrosMenu: IparametrosMenu;

        IparametrosMenu = {
            tipo: tipoConsulta,
            eperfil: usuario.eperfil
        }

        IconsultaMenuSistema = {
            credencial: this.Icredencial,
            parametros: IparametrosMenu

        }

        IRootConsuntaMenuSistema = {
            consultaMenuSistema: IconsultaMenuSistema
        }

        this.datosPost = JSON.stringify(IRootConsuntaMenuSistema);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(
            catchError(error => {
                console.log('error occured:', error);
                throw error;
            }),
            finalize(() => {
                this.spinner.hide();
            })
        )
    }

    //POST: Consultar todas las opciones de INTRANET / CUSTOMER
    postConsultarOperaciones(datos:any): Observable<any> {

        let direccion = this.url + "intranet/menu/consultar/responsabilidades";
        let parametros: any;

        let IRootResponsabilidades: any;
        let Iresponsabilidades: any
        let IcredencialUsuario: any
        let IdatosParametros: any

        //Token
        IcredencialUsuario = {
            token: this.token
        }
        IdatosParametros = {
            eperfil: datos.ecodperfil
        }

        Iresponsabilidades =  {
            credencial: IcredencialUsuario,
            parametros:IdatosParametros
        }

        IRootResponsabilidades = {
            responsabilidades :  Iresponsabilidades
        }

        parametros = JSON.stringify(IRootResponsabilidades)


        this.spinner.show();
        return this.http.post<any>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }


}