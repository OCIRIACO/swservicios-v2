import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';
import * as $ from 'jquery';
import 'jstree';
import { Router } from '@angular/router';

// Service para usar datos en otro componente
import {serviceDatosPerfilUsuarios } from 'src/app/service/service.datosPerfilUsuarios'


@Component({
  selector: 'app-perfiles-step1',
  templateUrl: './perfiles-step1.component.html',
  styleUrls: ['./perfiles-step1.component.css']
})
export class PerfilesStep1Component implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //arreglos
  Imetadata: any
  IdataPerfil: Array<any> = [];

  constructor(private apiServiceUsuario: ApiServiceUsuario, private router: Router, private serviceDatosPerfilUsuario: serviceDatosPerfilUsuarios) { }

  ngOnInit(): void {

    //Iniciar consultar los perfiles
    this.e_consultarPerfiles()

    // Click
    $('#jstree').on('asignarUsuario', (ev, dato) => {
      this.e_usuarioStep2(dato);
    });



    //////////////////////////// DOUBLE CLIK JSTREEE/////////////////

    $('#jstree').bind("dblclick.jstree", function (event) {
      var tree = $(this).jstree();
      var node = tree.get_node(event.target);
      $('#jstree').trigger('asignarUsuario', node.original.metada);
    });
  }

  //Asignar usuario (redirect)
  e_usuarioStep2(datos: any) {
    //console.log(datos)

    this.serviceDatosPerfilUsuario.datosPerfilUsuarios =  datos

    // Router
    //this.router.navigate(['/dashboard/intranet/administracion/config/usuarios/step2']);
    window.location.href = "#/dashboard/intranet/administracion/config/usuarios/step2";

    // Simulate a mouse click:

    
  }
  //Consultar API de los PERFILES
  e_consultarPerfiles() {
    let idparente: string;
    let dataPerfil: any = {}

    let parametroPerfil = {
      ttipoperfil: "TODOS"
    }

    this.apiServiceUsuario.postConsultarPerfiles(parametroPerfil).subscribe(
      (response) => {
        //Recorre los datos
        response.forEach((dato: any, index: any) => {


          if (dato['ecodpadre'] == 0) {
            idparente = '#'
          } else {
            idparente = dato['ecodpadre']
          }

          //Datos que ocupare para despues editar
          this.Imetadata = {
            ecodperfil: dato['ecodperfil'],
            ecodpadre: dato['ecodpadre'],
            tdescripcion: dato['tdescripcion'],
            testado: dato['testado'],
            tpath: dato['path']
          }


          dataPerfil = {
            id: dato['ecodperfil'],
            parent: idparente,
            text: dato['tdescripcion'],
            metada: this.Imetadata
          }

          this.IdataPerfil.push(dataPerfil)
        })
        //Procesar datos
        this.e_procesaDatos();
      })
  }

  e_procesaDatos() {

    //Destroy por que XD no se 
    $('#jstree').jstree("destroy").empty();

    //Magia
    $('#jstree').jstree({
      'core': {
        "check_callback": true,
        'data': this.IdataPerfil
      },
      'plugins': ['contextmenu', 'types'],
      "contextmenu": {
        "items": function (item: any) {
          return {
            "Create": {
              "separator_before": false,
              "separator_after": true,
              "label": "Asignar usuario(s)",
              "action": function (obj: any) {
                ////console.log('nivel');
                //trigger
                $('#jstree').trigger('asignarUsuario', item.original.metada);
                //e_crear(item.original.metada)
              }
            }
          }

        }
      }
    })
    $('#jstree').on('ready.jstree', function () {
      $("#jstree").jstree("open_all");
    });

  }

  //Regresar menu Inicio
  e_inicio(){
    this.router.navigate(['/dashboard/intranet/menu']);
  }

}
