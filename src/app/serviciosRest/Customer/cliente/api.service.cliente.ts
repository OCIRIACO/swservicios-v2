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


export class apiCliente {

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





    //Post: Consultar  detalle cliente
    postConsultarDetalleCliente(datos: any): Observable<any> {

        let direccion = this.url + "customer/clientes/consultar/detalle";

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
    postCrearCliente(datos: any): Observable<any> {

        let direccion = this.url + "customer/clientes/registrar/cliente";

        let rootCliente: any
        let Icliente: any
        let Iparametro: any

        Icliente = {
            credencial: this.Icredencial,
            parametros: datos
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

    //Post consultar cartera de cliente del perfil
    postConsultarCarteraClientes(datos: any): Observable<any> {

        let direccion = this.url + "customer/clientes/consultar/carteraclientes";

        let rootCliente: any
        let IperfilCliente: any
        let Iparametros: any

        Iparametros = {
            eperfil: datos.eperfil,
        }

        IperfilCliente = {
            credencial: this.Icredencial,
            parametros: Iparametros
        }

        rootCliente = {
            cliente: IperfilCliente
        }

        this.datosPost = JSON.stringify(rootCliente);

        this.spinner.show();
        return this.http.post<any>(direccion, this.datosPost).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }



    //Post: Crear un cliente directo para poder asignarle un perfil
    postActualizarCliente(datos: any): Observable<any> {

        let direccion = this.url + "customer/clientes/actualizar/cliente";

        let rootCliente: any
        let Icliente: any
        let Iparametro: any

        Icliente = {
            credencial: this.Icredencial,
            parametros: datos
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




}


