import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';

import { Icredencial } from 'src/app/modelos/seguridad/seguridad.interfase';
import { GlobalConstants } from 'src/app/modelos/global';

@Injectable({
    providedIn: 'root'
})


export class ApiServiceUsuario {

    // Token local Storage
    token: any = localStorage.getItem('token')

    //Url Base
    url: string = GlobalConstants.apiURL
    Icredencial: Icredencial;
    datosPost: any;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) {

        this.Icredencial = {
            token: this.token
        }
    }


    //POST: Consultar usuario
    postConsultarUsuarios(): Observable<any> {

        let direccion = this.url + "intranet/usuarios/consultar/listado";
        let parametros: any;

        let IcredencialUsuario: any
        let IrootUsuarios: any
        let Iusuario: any

        IcredencialUsuario = {
            token: this.token
        }

        Iusuario = {
            credencial: IcredencialUsuario
        }

        IrootUsuarios = {
            usuarios: Iusuario
        }

        parametros = JSON.stringify(IrootUsuarios)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }

    //Post: Consultar perfiles
    postConsultarPerfiles(datos:any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/consultar/perfiles";
        let parametros: any;


        let IcredencialUsuario: any
        let IrootUsuarios: any
        let Iusuario: any
        let Iparametros: any

        Iparametros =  {
            ttipoperfil:datos.ttipoperfil
        }

        IcredencialUsuario = {
            token: this.token
        }

        Iusuario = {
            credencial: IcredencialUsuario,
            parametros: Iparametros
        }

        IrootUsuarios = {
            perfiles: Iusuario
        }

        parametros = JSON.stringify(IrootUsuarios)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    //Post: Consultar usuario pendiente o asignados al perfil
    postConsultarUsuariosPerfil(datos: any) {

        let direccion = this.url + "intranet/usuarios/consultar/usuarioperfil";
        let parametros: any;

        let IcredencialUsuario: any
        let IparametrosUsuarioPerfil: any
        let IdatosPerfil: any
        let rootUsuario: any

        let Iusuario: any

        IcredencialUsuario = {
            token: this.token
        }

        IdatosPerfil = {
            testado: datos.testado,
            eperfil: datos.eperfil
        }

        IparametrosUsuarioPerfil = {
            perfil: IdatosPerfil
        }

        Iusuario = {
            credencial: IcredencialUsuario,
            parametros: IparametrosUsuarioPerfil
        }

        rootUsuario = {
            usuario: Iusuario
        }

        parametros = JSON.stringify(rootUsuario)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))
    }


    //Post: Asignar perfil a un usuario
    postAsignarPerfilUsuario(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/registrar/asignarperfil";
        let parametros: any;
        let IrootAsignarPerfilUsuario: any
        let IasignarPerfilUsuario: any

        let IcredencialUsuario: any

        IcredencialUsuario = {
            token: this.token
        }

        IasignarPerfilUsuario = {
            credencial: IcredencialUsuario,
            parametros: datos
        }


        IrootAsignarPerfilUsuario = {
            asignarperfil: IasignarPerfilUsuario
        }

        parametros = JSON.stringify(IrootAsignarPerfilUsuario)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post: Asignar perfil a un usuario
    postDesAsignarPerfilUsuario(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/registrar/desasignarperfil";
        let parametros: any;
        let IrootDesAsignarPerfilUsuario: any
        let IDesasignarPerfilUsuario: any

        let IcredencialUsuario: any

        IcredencialUsuario = {
            token: this.token
        }

        IDesasignarPerfilUsuario = {
            credencial: IcredencialUsuario,
            parametros: datos
        }


        IrootDesAsignarPerfilUsuario = {
            desasignarperfil: IDesasignarPerfilUsuario
        }

        parametros = JSON.stringify(IrootDesAsignarPerfilUsuario)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post Crear usuario
    postCrearNuevoUsuario(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/registrar/usuario";
        let parametros: any;

        //arreglos post usuario
        let Iusuario: any
        let IdatosUsuario: any
        let IcredencialUsuario: any
        let rootUsuario: any



        //Token
        IcredencialUsuario = {
            token: this.token
        }

        IdatosUsuario = {
            usuario: datos
        }

        Iusuario = {
            credencial: IcredencialUsuario,
            parametros: IdatosUsuario
        }

        rootUsuario = {
            usuario: Iusuario
        }


        parametros = JSON.stringify(rootUsuario)

        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }


    //Post Editar usuario
    postEditarUsuario(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/actualizar/usuario";
        let parametros: any;

        //arreglos post usuario
        let Iusuario: any
        let IdatosUsuario: any
        let IcredencialUsuario: any
        let rootUsuario: any



        //Token
        IcredencialUsuario = {
            token: this.token
        }

        IdatosUsuario = {
            usuario: datos
        }

        Iusuario = {
            credencial: IcredencialUsuario,
            parametros: IdatosUsuario
        }

        rootUsuario = {
            usuario: Iusuario
        }


        parametros = JSON.stringify(rootUsuario)

        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }

    //Post Crear perfil
    postCrearPerfil(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/registrar/crearperfil";
        let parametros: any;

        //arreglos
        let IcredencialUsuario: any
        let IdatosPerfil: any
        let Iperfil: any
        let rootPerfil: any

        //Token
        IcredencialUsuario = {
            token: this.token
        }

        IdatosPerfil = {
            perfil: datos
        }

        Iperfil =  {
            credencial: IcredencialUsuario,
            parametros: IdatosPerfil
        }

        rootPerfil  =  {
            perfil: Iperfil
        }

        
        parametros = JSON.stringify(rootPerfil)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }



      //Post Editar perfil
      postEditarPerfil(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/actualizar/actualizarperfil";
        let parametros: any;

        //arreglos
        let IcredencialUsuario: any
        let IdatosPerfil: any
        let Iperfil: any
        let rootPerfil: any

        //Token
        IcredencialUsuario = {
            token: this.token
        }

        IdatosPerfil = {
            perfil: datos
        }

        Iperfil =  {
            credencial: IcredencialUsuario,
            parametros: IdatosPerfil
        }

        rootPerfil  =  {
            actualizarperfil: Iperfil
        }

        
        parametros = JSON.stringify(rootPerfil)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }



      //Post agregar responsabilidades perfil
      postPerfilResponsabilidades(datos: any): Observable<any> {

        let direccion = this.url + "intranet/usuarios/registrar/responsabilidades";
        let parametros: any;

        //arreglos
        let IcredencialUsuario: any
        let Iresponsabilidad: any
        let rootResponsabilidad: any

        //Token
        IcredencialUsuario = {
            token: this.token
        }


        Iresponsabilidad =  {
            credencial: IcredencialUsuario,
            parametros: datos
        }

        rootResponsabilidad  =  {
            responsabilidad: Iresponsabilidad
        }

        
        parametros = JSON.stringify(rootResponsabilidad)


        this.spinner.show();
        return this.http.post<any[]>(direccion, parametros).pipe(finalize(() => {
            this.spinner.hide();
        }))

    }




}