import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'jstree';
import { ApiServiceZonas } from 'src/app/serviciosRest/Intranet/zonas/api.service.zonas';
import { Form, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IdatosZonas, Imetadata, IdatosregistrarZona, IdatosActualizarZona } from 'src/app/modelos/zonas/zonas.interfase';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';



@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})

export class ConfiguracionComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;


  //Variables para procesar response del API
  IdatosZonas?: IdatosZonas;
  Imetadata?: Imetadata;
  IdataZona: Array<any> = [];
  datoJstree: any;

  FormDatosZonas = new UntypedFormGroup({
    taccion: new UntypedFormControl('', Validators.required),
    ecodzona: new UntypedFormControl('', Validators.required),
    ecodzonapadre: new UntypedFormControl('', Validators.required),
    tpath: new UntypedFormControl('', Validators.required),
    ttipo: new UntypedFormControl('', Validators.required),
    tsubtipo: new UntypedFormControl('', Validators.required),
    testado: new UntypedFormControl('', Validators.required),
    tdescripcion: new UntypedFormControl('', Validators.required),
  });

  // Div's Hide / Show
  divZona: boolean = false;
  divSubtipo: boolean = false;

  // Submitts
  submitZona = false;



  constructor(private apiZonas: ApiServiceZonas) { }

  ngOnInit(): void {
    $('#jstree').on('editar', (ev, dato) => {
      this.e_ZonaEditar(dato);
    });

    $('#jstree').on('crear', (ev, dato) => {
      this.e_ZonaCrear(dato);
    });
  }

  ngAfterContentInit() {
    this.e_consultarZona();
  }

  e_consultarZona() {
    let idparente: string;
    this.IdataZona = [];
    let zonacrear = 'PENDIENTE'

    this.apiZonas.postConsultaZonas().subscribe(
      (response) => {
        //this.IdataZona =  response;
        response.forEach((dato: any, index: any) => {

          if (dato['ecodzonapadre'] == 0) {
            idparente = '#'
          } else {
            idparente = dato['ecodzonapadre']
          }

          //Validar lo que puede crear
          //Validar lo que puede crear
          if (dato['ttipo'] == 'ROOT') {
            zonacrear = 'EMPRESA'
          } else if (dato['ttipo'] == 'EMPRESA') {
            zonacrear = 'CIUDAD'
          } else if (dato['ttipo'] == 'CIUDAD') {
            zonacrear = 'TERMINAL'
          } else if (dato['ttipo'] == 'TERMINAL') {
            zonacrear = 'ZONA'
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
        //RESET FORM'S
        this.FormDatosZonas = new UntypedFormGroup({
          taccion: new UntypedFormControl('', Validators.required),
          ecodzona: new UntypedFormControl('', Validators.required),
          ecodzonapadre: new UntypedFormControl('', Validators.required),
          tpath: new UntypedFormControl('', Validators.required),
          ttipo: new UntypedFormControl('', Validators.required),
          tsubtipo: new UntypedFormControl('', Validators.required),
          testado: new UntypedFormControl('', Validators.required),
          tdescripcion: new UntypedFormControl('', Validators.required),
        });
      }
    })
  }


  e_procesaDatos() {
    console.log(this.IdataZona);

    $('#jstree').jstree("destroy").empty();


    $('#jstree').jstree({
      'core': {
        "check_callback": true,
        'data': this.IdataZona
      },
      'plugins': ['contextmenu', 'types'],
      "contextmenu": {
        "items": function (item: any) {
          return {
            "Create": {
              "label": "Crear " + item.original.metada.tcrearzona.toLowerCase(),
              "action": function (obj: any) {
                //console.log('Crear');
                //trigger
                $('#jstree').trigger('crear', item.original.metada);
                //e_crear(item.original.metada)
              }
            },
            "Rename": {

              "label": "Editar " + item.original.metada.ttipo.toLowerCase(),
              "action": function (obj: any) {
                //console.log('Editar');
                //trigger
                $('#jstree').trigger('editar', item.original.metada);
                //e_editar(item.original.metada)
              }
            }
          }
        }
      }
    });

    // $('#jstree').jstree(true).settings.core.data = this.IdataZona;
    //jQuery('#data').jstree(true).refresh(true);

    $('#jstree').on('ready.jstree', function () {
      $("#jstree").jstree("open_all");
    });



  }



  e_ZonaEditar(dato: any) {
    console.log(dato);

    this.FormDatosZonas.reset();


    this.FormDatosZonas.setValue({
      taccion: 'EDITAR',
      ecodzona: dato.ecodzona,
      ecodzonapadre: dato.ecodzonapadre,
      tdescripcion: dato.tdescripcion,
      ttipo: dato.ttipo,
      tpath: dato.tpath,
      tsubtipo: dato.tsubtipo,
      testado: dato.testado
    });


    if (dato.ttipo == 'ZONA') {
      this.divSubtipo = true;
      $("#divSubtipo").show();
    } else {
      this.divSubtipo = false;
      $("#divSubtipo").hide();

    }

    document.getElementById("tdescripcion")?.focus();

  }

  e_ZonaCrear(dato: any) {

    //console.log(dato);
    let zonacrear: string = ""

    this.FormDatosZonas.reset();

    if (dato.ttipo == 'ROOT') {
      zonacrear = 'EMPRESA'
    } else if (dato.ttipo == 'EMPRESA') {
      zonacrear = 'CIUDAD'
    } else if (dato.ttipo == 'CIUDAD') {
      zonacrear = 'TERMINAL'
    } else if (dato.ttipo == 'TERMINAL') {
      zonacrear = 'ZONA'
    }

    this.FormDatosZonas.setValue({
      taccion: 'CREAR',
      ecodzona: null,
      ecodzonapadre: dato.ecodzona,
      tdescripcion: null,
      ttipo: zonacrear,
      tpath: dato.tpath,
      tsubtipo: null,
      testado: null,
    });

    /*
    if (dato.ttipo == 'ZONA') {
      this.divSubtipo = true;
    } else {
      this.divSubtipo = false;
    }
    */

    if (zonacrear == 'ZONA') {
      this.divSubtipo = true;
    } else {
      this.divSubtipo = false;
    }



    document.getElementById("tdescripcion")?.focus();
  }

  ///////// POST

  // conveniencia para un fácil acceso a los campos de formulario
  get getFormZona() { return this.FormDatosZonas.controls; }

  e_guardar(datos: any) {

    console.log(datos);

    if (datos.ttipo != 'ZONA') {
      this.FormDatosZonas.get('tsubtipo')?.disable();
    }


    if (datos.ttipo == 'ZONA') {
      this.FormDatosZonas.get('tsubtipo')?.enable();
    }

    if (datos.taccion == 'CREAR') {
      this.FormDatosZonas.get('ecodzona')?.disable();
    }



    //Validar datos del contacto
    this.submitZona = true;

    // stop y valido
    if (this.FormDatosZonas.invalid) {
      console.log('error.');
      return;
    }

    let IdatosregistrarZona: IdatosregistrarZona;
    let IdatosActualizarZona: IdatosActualizarZona;

    let alerta: any = {};

    if (datos.taccion == 'CREAR') {

      IdatosregistrarZona = {
        ecodzonapadre: datos.ecodzonapadre,
        tdescripcion: datos.tdescripcion,
        ttipo: datos.ttipo,
        tsubtipo: datos.tsubtipo,
        testado: datos.testado
      }

      /// API
      let text = '';
      let success: boolean

      this.apiZonas.postRegistrarZona(IdatosregistrarZona).subscribe(
        (response) => {
          this.e_consultarZona();



          if (response.data) {
            success = true
            response.data.forEach((dato: any, index: any) => {
              text += dato.attributes.text + '\n'
            })
          }

          if (response.errors) {
            success = false
            response.errors.forEach((dato: any, index: any) => {
              text += dato.attributes.text + '\n'
            })
          }



          alerta['text'] = text;
          alerta['tipo'] = (success == true ? "success" : "error");
          alerta['footer'] = "ZONAS";
          this.alerta(alerta);


        }
      )
    } else {

      IdatosActualizarZona = {
        ecodzona: datos.ecodzona,
        ecodzonapadre: datos.ecodzonapadre,
        tdescripcion: datos.tdescripcion,
        ttipo: datos.ttipo,
        tsubtipo: datos.tsubtipo,
        testado: datos.testado
      }

      //Api
      let text = '';
      let success: boolean

      this.apiZonas.postActualizarZona(IdatosActualizarZona).subscribe(
        (response) => {
          this.e_consultarZona();

          /*if (response.success == true) {
            response.data.forEach((datos: any, index: any) => {
              mensajeResponse += datos.mensaje + '\n'
              if (datos["attributes"]) { 
                null
              }
            })
          } else {
            response.errores.forEach((datos: any, index: any) => {
              mensajeResponse += datos.mensaje + '\n'
            })
          }*/

          if (response.data) {
            success = true
            response.data.forEach((dato: any, index: any) => {
              text += dato.attributes.text + '\n'
            })
          }

          alerta['text'] = text;
          alerta['tipo'] = (success == true ? "success" : "error");
          alerta['footer'] = "ZONAS";
          this.alerta(alerta);

        }
      )
    }
  }

  ngOnChanges() {
    console.log('OK!');
  }

  ngAfterViewInit() {
    console.log('OK!');
  }
}

