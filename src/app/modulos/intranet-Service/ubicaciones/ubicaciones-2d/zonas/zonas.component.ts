import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { IdatosZonas, Imetadata } from 'src/app/modelos/zonas/zonas.interfase';
import { ApiServiceUbicaciones } from 'src/app/serviciosRest/Intranet/ubicaciones/api.service.ubicaciones';
import { ApiServiceZonas } from 'src/app/serviciosRest/Intranet/zonas/api.service.zonas';
import 'jstree';
import * as $ from 'jquery';
import { GlobalConstants } from 'src/app/modelos/global';
import { Router } from '@angular/router';

//Datos globales que seran usados en otros componenet's
import { serviceUbicaciones2d } from 'src/app/service/service.ubicaciones2d'



@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})


export class ZonasComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  ubicacionesHtml: string = '';
  anchors: any;

  //Variables de tipo Interfase
  Imetadata: any;
  IdatosZonas?: IdatosZonas;
  IdataZona: Array<any> = [];

  //Variables datos Apis
  datoUbicaciones: any;
  // Varibles Response de API's
  datosConsultaDetUbicaciones?: any;
  // Variable Hide o show objectos
  tauxiliar: boolean = false;

  // Div's show or hide
  //divZonas: boolean = true
  divUbicaciones: boolean = false
  divUbicaciones2D: boolean = false


  constructor(private apiZonas: ApiServiceZonas, private apiUbicacion: ApiServiceUbicaciones, private router: Router, private serviceUbicaciones2d: serviceUbicaciones2d) { }

  ngOnInit(): void {



    //Consultar Zona
    this.e_consultarZona();

    $('#jstree').on('configurar', (ev, dato) => {
      this.e_configurar(dato);
    });

    $('#search').keyup(function () {
      $('#jstree').jstree('search', $(this).val());
    });

    $('#jstree').bind("dblclick.jstree", function (event) {
      var tree = $(this).jstree();
      var node = tree.get_node(event.target);

      // console.log(node.original.metada);

      $('#jstree').trigger('configurar', node.original.metada);

    });

    //this.e_crearDetalleUbicaciones();
  }

  // Consultar API de detalle de ubicaciones
  e_consultarDetalleUbicaciones(dato: any) {

    // console.log(dato);
    //Peticion
    this.apiUbicacion.postConsultaDetallesUbicaciones(dato).subscribe(
      (response) => {
        this.datosConsultaDetUbicaciones = response;
        this.e_crearDetalleUbicaciones(this.datosConsultaDetUbicaciones);
      }
    )

  }

  // Crear detalle de ubicaciones 
  e_crearDetalleUbicaciones(datos: any) {

    let html = '';
    let filas = 0;
    let bahias = 0;
    let colspan = '';
    let estilo = '';

    let valorY: number = 1;

    //Procesar los detalles de ubicacion
    //Crear el bloque
    datos.forEach((dato: any, index: any) => {

      html += '<div id="' + dato.tbloque + '">'
      //Crear las filas - bahias
      filas = (parseInt(dato.efilas) + 1);
      bahias = (parseInt(dato.ebahias) + 1);
      colspan = '';
      estilo = '';

      var categories = [
        { "efila": 1, "ebahia": 1, "ealtura": 1, "edimension": 2 },
        { "efila": 1, "ebahia": 7, "ealtura": 1, "edimension": 2 },
        { "efila": 1, "ebahia": 11, "ealtura": 1, "edimension": 2 },
        { "efila": 3, "ebahia": 1, "ealtura": 1, "edimension": 3 },

      ];

      console.log('filas:' + filas + ' bahias:' + bahias)

      html += '<table  id="div1"  class="tbUbicaciones" >'
      for (let x = 0; x < filas; x++) {
        html += '<tr>'
        for (let y = 0; y < bahias; y++) {


          ////////////////////////////////////////////////////
          categories.forEach((dato: any, index: any) => {
            if (x == dato.efila && y == dato.ebahia && dato.edimension == 2) {
              colspan = ' COLSPAN="2"'
            }

            if (x == dato.efila && y == dato.ebahia) {
              if (dato.edimension == 3) {
                estilo = 'ocupado';
              } else if (dato.edimension == 2) {
                estilo = 'ocupado';
              }
            }

          })
          /////////////////////////////////////////////////////
          if (x == 0) {
            html += '<td ' + colspan + '>';

          } else if (y == 0) {
            html += '<td ' + colspan + '>';

          } else {

            if (estilo == 'ocupado') {
              html += '<td ' + colspan + ' id="A-' + x + '-' + y + '" class="ubicacion ' + estilo + '">';
            } else {
              html += '<td ' + colspan + ' id="A-' + x + '-' + y + '" class="ubicacion ' + 'libre' + '">';
            }
          }

          ////////////////////////////////////////////////////
          categories.forEach((dato: any, index: any) => {
            if (x == dato.efila && y == dato.ebahia) {
              if (dato.edimension == 2) {
                html += '40';
              } else {
                html += '20';
              }

            }
          })
          /////////////////////////////////////////////////////

          /* if (x != 0 && y != 0) {
             html += '<td class=" ubicacion ' + 'libre' + '">'
           } else {
             html += '<td>'
           }*/

          if (y == 0) {
            html += x;
          }
          if (x == 0) {

            if (y > 1) {



              html += (y + valorY)

              valorY = y

            } else {

              html += y
            }


            console.log(y + '%2 = ' + y % 2)
          }



          colspan = ''
          estilo = ''
          html += '</td>'

          /////////////////////////////////////////////////////
          categories.forEach((dato: any, index: any) => {
            if (x == dato.efila && y == dato.ebahia && dato.edimension == 2) {
              y++
            }
          })

        }
        estilo = ''
        html += '</tr>'
      }
      html += '</table>'
      html += '<p>'
      html += '</div>'

    });


    document.getElementById('htmlUbicaciones2d')!.innerHTML = html
    document.getElementById("chkall")?.focus();

    $('#jstree').on('state_ready.jstree', function () {
      alert('ready');
      $('#jstree').jstree('select_node', '1');
    });

  }

  // Consultar API zonas
  e_consultarZona() {
    let idparente: string;
    let zonacrear: string

    this.apiZonas.postConsultaZonas().subscribe(
      (response) => {

        response.forEach((dato: any, index: any) => {

          if (dato['ecodzonapadre'] == 0) {
            idparente = '#'
          } else {
            idparente = dato['ecodzonapadre']
          }

          //Validar lo que puede crear
          if (dato['ttipo'] == 'ROOT') {
            zonacrear = 'EMPRESA'
          } else if (dato['ttipo'] == 'CIUDAD') {
            zonacrear = 'EMPRESA'
          }


          this.Imetadata = {
            ecodzona: dato['ecodzona'],
            ecodzonapadre: dato['ecodzonapadre'],
            tdescripcion: dato['tdescripcion'],
            ttipo: dato['ttipo'],
            tsubtipo: dato['tsubtipo'],
            testado: dato['testado'],
            tpath: dato['path'],
            tcrearzona: zonacrear

          }

          this.IdatosZonas = {
            id: dato['ecodzona'],
            parent: idparente,
            text: dato['tdescripcion'] + ' (' + dato['ttipo'] + ')' + (dato['ttipo'] == 'ZONA' ? '(' + dato['tsubtipo'] + ')' : ''),
            metada: this.Imetadata
          }
          this.IdataZona.push(this.IdatosZonas);
        });
        this.e_procesaDatos();
      }
    )
  }

  //Descripcion:Procesar los datos para consumir la libreria del JS TREE
  e_procesaDatos() {

    $('#jstree').jstree("destroy").empty();


    $('#jstree').jstree({
      'core': {
        "check_callback": true,
        'data': this.IdataZona
      },
      'plugins': ['contextmenu', 'types', 'search', 'themes'],
      "search": {
        "case_insensitive": true,
        "show_only_matches": true,
        "show_only_matches_children": true
      },
      "contextmenu": {
        "items": function (item: any) {
          if (item.original.metada.ttipo == 'ZONA') {
            return {
              "Create": {
                "separator_before": false,
                "separator_after": true,
                "label": "Ver " + item.original.metada.ttipo.toLowerCase() + ' ' + item.original.metada.tsubtipo.toLowerCase(),
                "action": function (obj: any) {
                  //console.log('Crear');
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

  //Descripcion: Crear el reporte de las caracteritica de la zona
  e_configurar(dato: any) {

    //this.tpath = dato.tpath;

    //Api consultar Ubicaciones  Carril - Fila - Bahia - Altura
    this.apiUbicacion.postConsultaDetallesUbicaciones(dato).subscribe(
      (response) => {
        this.datosConsultaDetUbicaciones = response;

        this.serviceUbicaciones2d.datosUbicaciones2d = response;

        // Router
        //this.router.navigate(['/dashboard/intranet/ubicaciones2d/ubicaciones']);
        window.location.href = "#/dashboard/intranet/ubicaciones2d/ubicaciones";

      }
    )

    //this.datoUbicaciones = { ecodzona: dato.ecodzona }
    //this.e_consultarDetalleUbicaciones(this.datoUbicaciones);

    //Show or Hide
    //document.getElementById("divZonas")!.style.visibility = "hidden"
    //this.divUbicaciones = true

  }



  //Botones
  e_inicio(){
    this.router.navigate(['dashboard/intranet/menu']);
  }
  


}
