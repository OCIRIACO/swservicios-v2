import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import 'jstree';
import { from } from 'rxjs';
import { IdatosZonas, Imetadata } from 'src/app/modelos/zonas/zonas.interfase';
import { ApiServiceZonas } from 'src/app/serviciosRest/Intranet/zonas/api.service.zonas';
import Swal from 'sweetalert2';

import { IdetalleUbicacion, IparametrosUbicaciones } from 'src/app/modelos/ubicaciones/ubicaciones.interfase'
import { ApiServiceUbicaciones } from 'src/app/serviciosRest/Intranet/ubicaciones/api.service.ubicaciones';
import { GlobalConstants } from 'src/app/modelos/global';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'




@Component({
  selector: 'app-config-ubicaciones',
  templateUrl: './config-ubicaciones.component.html',
  styleUrls: ['./config-ubicaciones.component.css']
})
export class ConfigUbicacionesComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //Variables de tipo Interfase
  Imetadata?: any;
  IdatosZonas?: IdatosZonas;
  IdataZona: Array<any> = [];

  // Forms
  FormUbicaciones = new UntypedFormGroup({
    ecoddetubicacion: new UntypedFormControl(0, Validators.required),
    ecodzona: new UntypedFormControl(null, Validators.required),
    tbloque: new UntypedFormControl(null, Validators.required),
    efilas: new UntypedFormControl(null, Validators.required),
    ebahias: new UntypedFormControl(null, Validators.required),
    ealturas: new UntypedFormControl(null, Validators.required),
    testado: new UntypedFormControl(null, Validators.required)
  })

  //Submits
  submitUbicacion = false;

  //Pintar directamente en el html
  tpath?: string;

  // Varibles Response de API's
  datosConsultaDetUbicaciones?: any;

  //Hide o show 
  divecodZona: boolean = false;
  divecoddetubicacion: boolean = false


  constructor(private apiZonas: ApiServiceZonas, private apiUbicacion: ApiServiceUbicaciones, private serviceDatosUsuario: serviceDatosUsuario) { }

  ngOnInit(): void {
    // Consultar informacion del folio  de salida
    this.e_consultarZona();

    $('#jstree').on('configurar', (ev, dato) => {
      this.e_configurar(dato);
    });

    $('#jstree').bind("dblclick.jstree", function (event) {

      var tree = $(this).jstree();
      var node = tree.get_node(event.target);

      console.log('dato!')
      console.log(node.original.metada)

      let tipo = node.original.metada.ttipo

      if (tipo == 'ZONA') {
        $('#jstree').trigger('configurar', node.original.metada);
      }


    });

  }

  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

  e_configurar(dato: any) {

    this.tpath = dato.tpath;

    //Peticion
    this.apiUbicacion.postConsultaDetallesUbicaciones(dato).subscribe(
      (response) => {

        this.datosConsultaDetUbicaciones = response;
      }
    )


    this.FormUbicaciones = new UntypedFormGroup({
      ecoddetubicacion: new UntypedFormControl(0, Validators.required),
      ecodzona: new UntypedFormControl(dato.ecodzona, Validators.required),
      tbloque: new UntypedFormControl(null, Validators.required),
      efilas: new UntypedFormControl(null, Validators.required),
      ebahias: new UntypedFormControl(null, Validators.required),
      ealturas: new UntypedFormControl(null, Validators.required),
      testado: new UntypedFormControl(null, Validators.required)
    })


    document.getElementById("tbltblubicacionesoque")?.focus();

    document.getElementById("tbloque")?.focus();



  }

  e_consultarZona() {
    let idparente: string;
    this.IdataZona = [];

    this.apiZonas.postConsultaZonas().subscribe(
      (response) => {
        //this.IdataZona =  response;
        response.forEach((dato: any, index: any) => {

          if (dato['ecodzonapadre'] == 0) {
            idparente = '#'
          } else {
            idparente = dato['ecodzonapadre']
          }

          this.Imetadata = {
            ecodzona: dato['ecodzona'],
            ecodzonapadre: dato['ecodzonapadre'],
            tdescripcion: dato['tdescripcion'],
            ttipo: dato['ttipo'],
            tsubtipo: dato['tsubtipo'],
            testado: dato['testado'],
            tpath: dato['path']
          }

          this.IdatosZonas = {
            id: dato['ecodzona'],
            parent: idparente,
            text: dato['tdescripcion'] + ' (' + dato['ttipo'] + ')' + (dato['ttipo'] == 'ZONA' ? '(' + dato['tsubtipo'] + ')' : ''),
            metada: this.Imetadata
          }

          if (dato['tsubtipo'] != 'SERVICIO' && dato['tsubtipo'] != 'PLAYA'  && dato['tsubtipo'] != 'RECEPCION' ) {
            this.IdataZona.push(this.IdatosZonas);

          }
        });

        this.e_procesaDatos();
      }
    )
  }

  e_procesaDatos() {

    $('#jstree').jstree("destroy").empty();


    $('#jstree').jstree({
      'core': {
        "check_callback": true,
        'data': this.IdataZona
      },
      'plugins': ['contextmenu', 'types'],
      "contextmenu": {
        "items": function (item: any) {
          if (item.original.metada.ttipo == 'ZONA') {
            return {
              "Create": {
                "separator_before": false,
                "separator_after": true,
                "label": "Configurar " + item.original.metada.ttipo.toLowerCase(),
                "action": function (obj: any) {
                  console.log('Crear');
                  //trigger
                  $('#jstree').trigger('configurar', item.original.metada);
                  //e_crear(item.original.metada)
                }
              },
            }
          } else {
            return {}
          }

        }
      }
    });

    $('#jstree').on('ready.jstree', function () {
      $("#jstree").jstree("open_all");
    });

  }


  //Post

  // conveniencia para un fácil acceso a los campos de formulario
  get getFormUbicaciones() { return this.FormUbicaciones.controls; }

  e_guardar(datos: any) {

    let alerta: any = {};
    let IdetalleUbicacion: IdetalleUbicacion;
    let IparametrosUbicaciones: IparametrosUbicaciones;

    //Validar datos del fornulario
    this.submitUbicacion = true;

    // stop
    if (this.FormUbicaciones.invalid) {
      return;
    }

    //Datos del usuaro por [local storage]
    let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

    IdetalleUbicacion = {
      ecodzona: datos.ecodzona,
      tbloque: datos.tbloque,
      efilas: datos.efilas,
      ebahias: datos.ebahias,
      ealturas: datos.ealturas,
      ecodusuario: datosUsuario.ecodusuario,
      testado: datos.testado
    }

    IparametrosUbicaciones = {
      detalleubicacion: IdetalleUbicacion
    }
    // API
    let mensajeResponse: string = ''

    this.apiUbicacion.postRegistrarUbicacion(IparametrosUbicaciones).subscribe(
      (response) => {
        this.e_consultarZona();
        if (response.success == true) {
          //Data
          response.data.forEach((datos: any, index: any) => {
            mensajeResponse += datos.mensaje + '\n'
            //Check existe attributte
            if (datos["attributes"]) { /** will return true if exist */
              null
            }
          })



        } else {
          //Errores
          response.errores.forEach((datos: any, index: any) => {
            mensajeResponse += datos.mensaje + '\n'
          })
        }

        alerta['text'] = mensajeResponse;
        alerta['tipo'] = (response.success == true ? "success" : "error");
        this.alerta(alerta);
      }
    )

  }

  // Editar configuracion ubicaciones
  e_editar(datos: any) {
    //console.log('Editar!')
    //console.log(datos)

    // Valores form
    this.FormUbicaciones = new UntypedFormGroup({
      ecoddetubicacion: new UntypedFormControl(datos.ecoddetubicacion, Validators.required),
      ecodzona: new UntypedFormControl(datos.ecodzona, Validators.required),
      tbloque: new UntypedFormControl(datos.tbloque, Validators.required),
      efilas: new UntypedFormControl(datos.efilas, Validators.required),
      ebahias: new UntypedFormControl(datos.ebahias, Validators.required),
      ealturas: new UntypedFormControl(datos.efilas, Validators.required),
      testado: new UntypedFormControl(datos.testado, Validators.required)
    })

  }

  // Eliminar ubicaciones
  e_eliminar(datos: any) {

    // console.log('Editar!')
    // console.log(datos)

    let alerta: any = {};
    let parametros: any = {}

    parametros = {
      ecodzona: datos.ecodzona,
      ecoddetubicacion: datos.ecoddetubicacion
    }

    //Api
    let mensajeResponse: string = ''
    this.apiUbicacion.postEliminarUbicacion(parametros).subscribe(
      (response) => {

        if (response.success == true) {
          //Data
          response.data.forEach((datos: any, index: any) => {
            mensajeResponse += datos.mensaje + '\n'
            //Check existe attributte
            if (datos["attributes"]) { /** will return true if exist */
              null
            }
          })


        } else {
          //Errores
          response.errores.forEach((datos: any, index: any) => {
            mensajeResponse += datos.mensaje + '\n'
          })
        }

        alerta['text'] = mensajeResponse;
        alerta['tipo'] = (response.success == true ? "success" : "error");
        alerta['footer'] = '';
        this.alerta(alerta);
      }
    )


  }

}
