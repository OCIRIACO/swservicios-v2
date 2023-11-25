import { Component, HostListener, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';

//Globales constante
import { GlobalConstants } from 'src/app/modelos/global';

//Datos globales que seran usados en otros componenet's
import { serviceUbicaciones2d } from 'src/app/service/service.ubicaciones2d'
import { ApiServiceUbicaciones } from 'src/app/serviciosRest/Intranet/ubicaciones/api.service.ubicaciones';
import Swal from 'sweetalert2';

//Dialogo
import { DialogVistaCarrilComponent } from 'src/app/modulos/intranet-Service/ubicaciones/ubicaciones-2d/dialog-vista-carril/dialog-vista-carril.component'

//import { ModalService } from 'src/app/modelos/_modal'
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vista-ubicaciones2d',
  templateUrl: './vista-ubicaciones2d.component.html',
  styleUrls: ['./vista-ubicaciones2d.component.css']
})
export class VistaUbicaciones2dComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //ocupaciones
  ocupaciones: any = []

  html_vista_contenedores: string = '';


  constructor(private router: Router,
    private serviceUbicaciones2d: serviceUbicaciones2d,
    private apiUbicacion: ApiServiceUbicaciones,
    //private modalService: ModalService,
    public dialogo: MatDialog,
    private DomSanitizer: DomSanitizer
  ) { }



  ngOnInit(): void {

    // Crear la vista de ubicacione
    //this.e_crearDetalleUbicaciones(this.serviceUbicaciones2d.datosFinalUbicaciones2d);
    // this.e_crearLayout(this.serviceUbicaciones2d.datosFinalUbicaciones2d)

    this.e_ocupacionUbicaciones(this.serviceUbicaciones2d.datosFinalUbicaciones2d);


  }

  ///  MODALES
  openModal(id: string) {
    //this.modalService.open(id);
    null;
  }

  closeModal(id: string) {
    //this.modalService.close(id);
    null;
  }
  ///////////////////////////////

  e_ocupacionUbicaciones(datos: any) {

    let bloque: any = ''


    datos.forEach((dato: any, index: any) => {

      //Preparar el llamado del servicio
      let datosPost = {
        ecodzona: dato.ecodzona,
        ecoddetubicacion: dato.ecoddetubicacion
      }

      this.apiUbicacion.postOcupacionBienes(datosPost).subscribe(
        (response) => {
          ////console.log(response.bienes)

          if (response == null) {
            this.ocupaciones = []
          } else {
            this.ocupaciones = response.bienes
          }

          bloque += this.e_crearLayout(dato, this.ocupaciones)

          //console.log(bloque)
          document.getElementById('htmlUbicaciones2d')!.innerHTML = bloque

        }
      )

    })



    // document.getElementById('htmlUbicaciones2d')!.innerHTML = vistaFinal


  }


  //Crear vista layout (vERTICAL)
  e_crearLayout(datos: any, ubicaciones: any) {

    //console.log(datos)


    let html = '';
    // let filas: number = 0;
    // let bahias: number = 0;
    let bloque = '';
    let colspan = '';
    let estilo = '';

    let valorX: number = 0;
    let valorX2: number = 0;
    let valorX3: number = 0;

    let crear: string = 'si'

    let valida_rowspan: any = false;


    let ocupaciones = ubicaciones;

    /*let ocupaciones = [
      { "efila": 1, "ebahia": 1, "ealtura": 1, "edimension": 1 },
      { "efila": 1, "ebahia": 3, "ealtura": 1, "edimension": 2 },
      { "efila": 3, "ebahia": 5, "ealtura": 1, "edimension": 3 },
      { "efila": 4, "ebahia": 7, "ealtura": 1, "edimension": 3 },
      { "efila": 6, "ebahia": 21, "ealtura": 1, "edimension": 1 },
      { "efila": 6, "ebahia": 23, "ealtura": 1, "edimension": 2 },

    ];*/

    // var ocupaciones : any   = []


    // //console.log('filas:' + filas + ' bahias:' + bahias)

    //Procesar los detalles de ubicacion
    //Crear el bloque
    //datos.forEach((dato: any, index: any) => {

    let dato: any = datos


    let filas: number = (parseInt(dato.efilas) + 2);
    var bahias: number = (parseInt(dato.ebahias) + 2);

    bloque = dato.tbloque



    html += " <style> ";
      html += " .tbUbicaciones td { ";
        html += " margin: 0px; ";
        html += " padding: 5px; ";
        html += " text-align: left; ";
        html += " border:1px solid #080808; ";
      html += " }     ";
    html += " </style> ";




    html += '<div class="col-sm-12 col-md-3 mg-t-5 mg-sm-t-5" >'

    //CARRIL / RACK

    html += '<table  border="1" id="divCarril"  class="tbUbicaciones" style="width:100%; border-style:solid; border-collapse:collapse !important; ">'
    html += '<tbody style="border-width:1;">'
    html += '<tr>'
    html += '<td>' + bloque + '</td>'
    html += '</tr>'
    html += '</tbody>'
    html += '</table>'


    html += '<table  border="1" id="divUbicacion"  class="tbUbicaciones" style="width:100%; border-style:solid; border-collapse:collapse !important;" >'
    html += '<tbody style="width:100%; border-style:solid; border-collapse:collapse !important;" >'

    for (let x = 0; x < bahias; x++) {
      html += '<tr>'
      for (let y = 0; y < filas; y++) {

        //Clear
        //valida_rowspan = false;

        if (y >= 1 && x >= 1 && y < (filas - 1)) {
          ///////////////////////OCUPACIONES/////////////////////////////

          valorX2 = (x - 1)

          ocupaciones.forEach((dato: any, index: any) => {
            if (y == dato.efila && (valorX2 + x) == dato.ebahia && dato.edimension == 1) {
              colspan = ' rowspan="2"'
            } else if (y == dato.efila && (valorX2 + x) == dato.ebahia && dato.edimension == 2) {
              valida_rowspan = true
              ////console.log('F:'+ y + 'B:'+x+ ' v:'+valida_rowspan )
            }

            if (y == dato.efila && (valorX2 + x) == dato.ebahia) {
              if (dato.edimension == 1) { // 40 [inicio]
                estilo = 'ocupado';
              } else if (dato.edimension == 3) { // 20
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

            crear = 'si'

            // if (valida_rowspan == false) {
            if (estilo == 'ocupado') {
              valorX2 = (x - 1)

              //style="cursor: zoom-in;"
              html += '<td ' + colspan + ' id="' + bloque + '|' + y + '|' + (valorX2 + x) + '" style="cursor: pointer;"  href="#exampleModalToggle"  class="ubicacion ' + estilo + '">'
            } else {
              ////console.log('valida:' + valida_rowspan + ' ' + 'A-' + y + '-' + x + ' ' + estilo)


              valorX2 = (x - 1)
              //////// OCUPACION ///////
              ocupaciones.forEach((dato: any, index: any) => {

                if (y == dato.efila && (valorX2 + x) == dato.ebahia && dato.edimension == 2) {
                  crear = 'no'
                }

              })

              if (crear == 'si') {
                html += '<td ' + colspan + ' id="' + bloque + '|' + y + '|' + (valorX2 + x) + '" class="ubicacion ' + 'libre' + '">';

              }
              //////////////////////


            }
            // }

          }



          //html += '<td>' + 'x' + '</td>';








        } else {
          if (x >= 1) {

            // //console.log(  'B:' + x +':'+(x % 2) )
            if (x == 1) {
              html += '<td>' + 'B:' + (x)
              valorX = x
            } else {
              valorX = (x - 1)
              html += '<td>' + 'B:' + (x + valorX)
            }

            // html += '<td>' + 'B:' + (x+valorX);

            //valorX = x


          } else {
            html += '<td>' + 'F:' + y;
          }
        }



        colspan = ''
        estilo = ''
        html += '</td>'




      }


      html += '</tr>'
    }
    html += '</tbody>'
    html += '</table>'
    html += '<p>'
    html += '</div>'
    //});

    console.log(html);

    return html;

    //document.getElementById('htmlUbicaciones2d')!.innerHTML = html

  }


  // Crear detalle de ubicaciones (HORIZONTAL) 
  e_crearDetalleUbicaciones(datos: any) {

    let html = '';
    let filas = 0;
    let bahias = 0;
    let colspan = '';
    let v_colspan = false;

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
      v_colspan = false

      var categories = [
        { "efila": 1, "ebahia": 1, "ealtura": 1, "edimension": 2 },
        { "efila": 1, "ebahia": 7, "ealtura": 1, "edimension": 2 },
        { "efila": 1, "ebahia": 11, "ealtura": 1, "edimension": 2 },
        { "efila": 3, "ebahia": 1, "ealtura": 1, "edimension": 3 },

      ];

      //console.log('filas:' + filas + ' bahias:' + bahias)

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


            //console.log(y + '%2 = ' + y % 2)
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

  // Regresar zona
  e_ubicaciones() {
    // Router
    this.router.navigate(['/dashboard/intranet/ubicaciones2d/ubicaciones']);
  }

  //


  //Listener
  @HostListener('click', ['$event.target']) clickShowHide(dato: any) {
    ////console.log(dato.classList[1])
    //Identificar por el class
    if (dato.classList[1] == 'ocupado') {
      //console.log(dato.attributes.id)

      let cadena: string = dato.attributes.id.value
      let datosPost: any

      const ocupacion = cadena.split('|');

      datosPost = {
        ecodzona: this.serviceUbicaciones2d.datosFinalUbicaciones2d[0].ecodzona,
        tbloque: ocupacion[0],
        efila: ocupacion[1],
        ebahia: ocupacion[2]
      }

      //Consumir servicio
      this.apiUbicacion.postBienes(datosPost).subscribe(
        (response) => {
          this.e_crearlayoutBahia(response);
        }
      )

    }
  }


  e_crearlayoutBahia(datos: any) {

    //console.log(datos.length)
    let altura: number = datos.length
    let defaultX: number = 2
    let html: string = "";

    html += " <style> ";
    html += " .tbUbicaciones td { ";
      html += " margin: 0px; ";
      html += " padding: 5px; ";
      html += " text-align: left; ";
      html += " border:1px solid #080808; ";
    html += " }     ";
  html += " </style> ";



    html += '<table  id="div1"  class="tbUbicaciones" >'
    datos.forEach((bien: any, index: any) => {

      html += '<tr>'
      html += '<td class="tblBahiaContFila"    style="width: 22px;">' + bien.ealtura + '</td>'
      html += '<td class="tblBahiaCont-altura" style="width: 42px;">'
      html += '<table  id="datosVistaBien" class="datosVistaBien">'
      html += '<tr class="tblDatoVistaBien">'
      html += '<td >' + bien.tmarcas + '</td>'
      html += '</tr>'
      html += '<tr class="tblDatoVistaBien">'
      html += '<td >' + bien.ttipocontenedor + '</td>'
      html += '</tr>'
      html += '<tr class="tblDatoVistaBien">'
      html += '<td >' + bien.epesorecibido + '</td>'
      html += '</tr>'
      html += '<tr class="tblDatoVistaBien">'
      html += '<td >' + bien.ecantidadrecibido + '</td>'
      html += '</tr>'
      html += '<tr class="tblDatoVistaBien">'
      html += '<td >' + bien.ttramite + '</td>'
      html += '</tr>'
      html += '</table>'
      html += '</td>'
      html += '</tr>'

    })

    /*for (let x = 0; x < altura; x++) {
      html += '<tr>'
      html += '<td class="tblBahiaContFila"    style="width: 22px;">'+(x+1)+'</td>'
      html += '<td class="tblBahiaCont-altura" style="width: 42px;">&nbsp;</td>'
      html += '</tr>'

    }*/

    html += '</table>';

    //Vista carril
    //this.serviceUbicaciones2d.datosVistaAreaCarril = html;
    let dialogoConfig = this.dialogo.open(DialogVistaCarrilComponent);
    dialogoConfig.componentInstance.htmlVistaCarril = html;

    //this.html_vista_contenedores = html;
    //document.getElementById('vista_contenedor')!.innerHTML = this.html_vista_contenedores
    //this.openModal('custom-modal-2')


  }


}
