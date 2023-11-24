import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceMenu } from 'src/app/serviciosRest/Intranet/menu/api.service.menu';
import { serviceDatosPerfilUsuarios } from 'src/app/service/service.datosPerfilUsuarios'

import * as $ from 'jquery';
import 'jstree';
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfiles-reponsabilidades-step2',
  templateUrl: './perfiles-reponsabilidades-step2.component.html',
  styleUrls: ['./perfiles-reponsabilidades-step2.component.css']
})
export class PerfilesReponsabilidadesStep2Component implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;
  //arreglos
  Imetadata: any
  IdataOperaciones: any;

  // Datos service
  serviceDatosPerfil = this.serviceDatosPerfilUsuarios.datosPerfilUsuarios

  constructor(private apiServiceUsuario: ApiServiceUsuario,
    private ApiServiceMenu: ApiServiceMenu,
    private serviceDatosPerfilUsuarios: serviceDatosPerfilUsuarios,
    private router: Router
  ) { }

  ngOnInit(): void {

    console.log('datos...')
    console.log(this.serviceDatosPerfil)

    //Iniciar consultar los perfiles
    this.e_consultarOperaciones(this.serviceDatosPerfil)

  }

  /// ALERTAS
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result: any) => {
    })
  }

  //Consultar API de las reponsabilidades
  e_consultarOperaciones(datos: any) {
    let idparente: string;
    let dataPerfil: any = {}

    this.IdataOperaciones = []


    this.ApiServiceMenu.postConsultarOperaciones(datos).subscribe(
      (response) => {
        //Recorre los datos
        response.forEach((dato: any, index: any) => {

          //Clear
          dataPerfil = {}

          idparente = '';



          if (dato['ecodmenupadre'] == "0") {
            idparente = '#'
          } else {
            idparente = dato['ecodmenupadre']
          }

          //Datos que ocupare para despues editar
          this.Imetadata = {
            ecodmenu: dato['ecodmenu'],
            ecodmenupadre: dato['ecodmenupadre'],
            tdescripcion: dato['tdescripcion'],
            testado: dato['testado'],
            tpath: dato['path']

          }


          let checked: any = null

          // NO TOCAR
          if (dato.checked == 'true') {
            checked = {
              selected: true, checked: true, opened: true
            }
          } else {
            checked = {
              selected: false, checked: false, opened: true
            }
          }

          dataPerfil = {
            id: dato['ecodmenu'],
            parent: idparente,
            state: checked,
            text: dato['tdescripcion'],
            metada: this.Imetadata
          }

          console.log(dataPerfil)




          //console.log(dataPerfil)
          this.IdataOperaciones.push(dataPerfil)
        })
        console.log(this.IdataOperaciones)

        //Procesar datos
        this.e_procesaDatos();
      })
  }


  e_procesaDatos() {


    //Destroy por que XD no se 
    $('#jstree').jstree("destroy").empty();


    //Magia
    $('#jstree').jstree({
      "core": {
        "multiple": true,
        "check_callback": true,
        "data": this.IdataOperaciones,
      },
      "plugins": ["checkbox"],
      "checkbox": {
        //"three_state": false,
        "tie_selection": true,
        "whole_node": true,
      },
      "expand_selected_onload": false
    })

    $('#jstree').on('ready.jstree', function () {
      $("#jstree").jstree("open_all");
    });
  }

  //Guardar
  e_guardar() {

    let parametros: any = {}
    var selectedElmsIds: any = [];
    let Ieresponsabilidad: any = {}
    let Iperfil: any = {}



    var selectedElms = $('#jstree').jstree("get_selected", true);
    $.each(selectedElms, function () {

      Ieresponsabilidad = {}

      Ieresponsabilidad = {
        eresponsabilidad: this.id
      }

      selectedElmsIds.push(Ieresponsabilidad);
    });



    $("#jstree").find(".jstree-undetermined").each(function (i, element) {

      let valorCheck = $(element).closest('.jstree-node').attr("id");

      Ieresponsabilidad = {}

      Ieresponsabilidad = {
        eresponsabilidad: valorCheck
      }

      selectedElmsIds.push(Ieresponsabilidad);

    });


    console.log(selectedElmsIds)






    Iperfil = {
      eperfil: this.serviceDatosPerfilUsuarios.datosPerfilUsuarios.ecodperfil
    }

    parametros = {
      perfil: Iperfil,
      responsabilidades: selectedElmsIds
    }


    //Consumir el servicio api
    let text = '';
    let success: boolean
    let alerta: any = {};


    this.apiServiceUsuario.postPerfilResponsabilidades(parametros).subscribe(
      (response) => {


        if (response.data) {
          //Iniciar consultar los perfiles
          this.e_consultarOperaciones(this.serviceDatosPerfil)
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
          })
        }


        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "RESPONSABILIDAD";

        this.alerta(alerta);

      }
    )

  }

  //Regresar
  e_regresar() {
    this.router.navigate(['dashboard/intranet/administracion/config/perfiles/respons/step1']);
  }
  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
