import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import * as $ from 'jquery';
import 'jstree';
// Service para usar datos en otro componente
import { serviceDatosPerfilUsuarios } from 'src/app/service/service.datosPerfilUsuarios'
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';

@Component({
  selector: 'app-perfiles-reponsabilidades-step1',
  templateUrl: './perfiles-reponsabilidades-step1.component.html',
  styleUrls: ['./perfiles-reponsabilidades-step1.component.css']
})
export class PerfilesReponsabilidadesStep1Component implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //arreglos
  Imetadata: any
  IdataPerfil: Array<any> = [];

  constructor(private apiServiceUsuario: ApiServiceUsuario, private serviceDatosPerfilUsuario: serviceDatosPerfilUsuarios, private router: Router) { }

  ngOnInit(): void {

    //Iniciar consultar los perfiles
    this.e_consultarPerfiles()


    // Click
    $('#jstree').on('asignarResponsabilidades', (ev, dato) => {
       //console.log('datos perfil')
       //console.log(dato)
      this.e_responsabilidades(dato);
    });
  }


  //Asignar usuario (redirect)
  e_responsabilidades(datos: any) {
    //console.log(datos)

    this.serviceDatosPerfilUsuario.datosPerfilUsuarios = datos
    // Router
    //this.router.navigate(['/dashboard/intranet/administracion/config/perfiles/respons/step2']);
    window.location.href = "#/dashboard/intranet/administracion/config/perfiles/respons/step2";

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
              "label": "Asignar responsabilidades",
              "action": function (obj: any) {
                ////console.log('nivel');
                //trigger
                $('#jstree').trigger('asignarResponsabilidades', item.original.metada);
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

}
