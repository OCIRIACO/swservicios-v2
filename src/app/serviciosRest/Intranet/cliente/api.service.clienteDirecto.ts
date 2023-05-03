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


export class apiClienteDirecto {

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


    
    //Post Consultar realacion de perfil con cliente
    postConsultarPerfilClientePendiente(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/consultar/pendienteperfil";

        let rootPerfilClientePendiente: any
        let IperfilClientePendiente: any
        let Iparametros: any

        Iparametros = {
            eperfil: datos.eperfil,
        }

        IperfilClientePendiente = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }

        rootPerfilClientePendiente = {
            pendienteperfil: IperfilClientePendiente
        }

        this.datosPost = JSON.stringify(rootPerfilClientePendiente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post Consultar realacion de perfil con cliente
    postConsultarPerfilCliente(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/consultar/perfilcliente";

        let rootPerfilCliente: any
        let IperfilCliente: any
        let Iparametros: any

        Iparametros = {
            eperfil: datos.eperfil,
        }

        IperfilCliente = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }

        rootPerfilCliente = {
            perfilcliente: IperfilCliente
        }

        this.datosPost = JSON.stringify(rootPerfilCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    //Post: Crear relacion del perfil con cliente
    postCrearPerfilCliente(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/registrar/perfilcliente";

        let rootPerfilCliente: any
        let IperfilCliente: any
        let Iparametros: any

        Iparametros = {
            eperfil: datos.eperfil,
            ecliente: datos.ecliente
        }

        IperfilCliente = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }

        rootPerfilCliente = {
            perfilcliente: IperfilCliente
        }

        this.datosPost = JSON.stringify(rootPerfilCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    //Post: Consultar  detalle cliente
    postConsultarDetalleCliente(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/consultar/detalle";

        let rootCliente: any
        let Icliente: any
        let Iparametro: any

        Iparametro = {
            ecliente: datos
        }

        Icliente = {
            credencial: this.Icredencial,
            parametros: Iparametro
        }

        rootCliente = {
            cliente: Icliente
        }

        this.datosPost = JSON.stringify(rootCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post: Crear un cliente directo para poder asignarle un perfil
    postCrearClienteDirecto(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/registrar/directo";

        let rootClienteDirecto: any
        let IclienteDirecto: any
        let Iparametro: any

        IclienteDirecto = {
            credencial: this.Icredencial,
            parametros: datos
        }

        rootClienteDirecto = {
            clienteDirecto: IclienteDirecto
        }

        this.datosPost = JSON.stringify(rootClienteDirecto);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


     //Post: Crear des-asignar cliente de un perfil
     postDesAsignarClienteDirecto(datos: any): Observable<any> {

        let direccion = this.url + "intranet/clientes/actualizar/desasignarperfilcliente";

        let rootPerfilCliente: any
        let IperfilCliente: any
        let Iparametros: any

        Iparametros = {
            eperfil: datos.eperfil,
            ecliente: datos.ecliente
        }

        IperfilCliente = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }

        rootPerfilCliente = {
            perfilcliente: IperfilCliente
        }

        this.datosPost = JSON.stringify(rootPerfilCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post: Consultar todos los clientes directos
    postConsultarTipoClientes(): Observable<any> {


        let direccion = this.url + "intranet/clientes/consultar/tipocliente";

        let rootCliente: any
        let IclienteDirecto: any
        let Iparametro: any

        Iparametro = {
            ttipocliente: "DIRECTO"
        }

        IclienteDirecto = {
            credencial: this.Icredencial,
            parametros: Iparametro
        }

        rootCliente = {
            cliente: IclienteDirecto
        }

        this.datosPost = JSON.stringify(rootCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


}


