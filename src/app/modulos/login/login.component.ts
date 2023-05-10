//import { importType, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, Validator, Validators, FormGroup, FormControl } from '@angular/forms';
import { classApiLogin } from '../../serviciosRest/api/api.service.login'
import { IniciarSesion, Login, RootObject } from '../../modelos/longin.interfase'
import { Router } from '@angular/router'
import { IdatosResponse } from '../../modelos/reponse.login.interfase'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  datos: any = {};
  mensaje: string = '';


  loginForm = new FormGroup({
    usuario: new FormControl(),
    password: new UntypedFormControl('', Validators.required)
  })


  constructor(private api: classApiLogin, private router: Router) { }

  //Catalogo's
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any

  ngOnInit(): void {

  }


  e_longin(form: any) {

    this.mensaje = '';
    let success: boolean
    let text: string = ''

    let datologin: Login;
    let datoIniciarsession: IniciarSesion;
    let datosRoot: RootObject;


    let ttoken: any

    console.log(form.usuario);

    datologin = { usuario: form.usuario, password: form.password };
    datoIniciarsession = { login: datologin };
    datosRoot = { iniciarSesion: datoIniciarsession }





    this.api.e_iniciarSesion(datosRoot).subscribe(response => {

      //let response : IdatosResponse = response;


      //console.log(response);

      // if(response.success == true){

      if (response.data) {
        success = true
        response.data.forEach((dato: any, index: any) => {
          //text += dato.attributes.text + '\n'

          this.datos = {
            tusuario: dato.attributes.tusuario,
            tperfil: dato.attributes.tperfil,
            ecodusuario: dato.attributes.ecodusuario,
            eperfil: dato.attributes.eperfil,
            eclientedirecto: dato.attributes.eclientedirecto
          }


          ttoken = dato.attributes.ttoken

        })
      }

      if (response.errors) {
        success = false
        response.errors.forEach((dato: any, index: any) => {
          //console.log(dato.attributes.text)
          text += dato.attributes.text + '\n'
        })
      }

      if (success == true) {

        //Token
        localStorage.setItem("token", ttoken);

        //Datos del usuario
        let datosUsuario = JSON.stringify(this.datos)
        localStorage.setItem("usuario", datosUsuario);

        this.router.navigate(['dashboard/inicio']);  // nativo

      } else if (success == false) {
        this.mensaje = text;
      }

    })

  }

}
