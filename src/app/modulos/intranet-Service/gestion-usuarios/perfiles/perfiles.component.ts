import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';
import * as $ from 'jquery';
import 'jstree';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //arreglos
  Imetadata: any
  IdataPerfil: Array<any> = [];

  //Form's
  formPerfil = new FormGroup({
    tdescripcion: new FormControl('', Validators.required),
    testado: new FormControl('', Validators.required)
  })
  // Submit's 
  submitGuardar = false;

  //Label's
  lblObservacionesPerfil: string = ''

  //Auxiliar para realizar el envio de datos al API
  datosPerfil: any


  constructor(
    private apiServiceUsuario: ApiServiceUsuario,
    private router: Router
    ) { }

  ngOnInit(): void {

    //Iniciar consultar los perfiles
    this.e_consultarPerfiles()

    //Crear nivel perfil jstree click derecho
    $('#jstree').on('crearNivel', (ev, dato) => {
      this.lblObservacionesPerfil = 'ATENCION! NUEVO NIVEL DEL PERFIL ORIGEN:' + dato.tdescripcion
      dato.tipo = 'NIVEL'
      this.datosPerfil = dato
      //this.e_crearperfil(dato);
    });
    //Crear nivel perfil jstree click derecho
    $('#jstree').on('crearSubNivel', (ev, dato) => {
      this.lblObservacionesPerfil = 'ATENCION! NUEVO SUB-NIVEL DEL PERFIL ORIGEN:' + dato.tdescripcion
      dato.tipo = 'SUB-NIVEL'
      this.datosPerfil = dato
      //this.e_crearperfil(dato);
    });

    $('#jstree').on('editarPerfil', (ev, dato) => {
      this.lblObservacionesPerfil = 'ATENCION! SE REALIZARA UN UPDATE AL PERFIL ORIGEN: ' + dato.tdescripcion
      dato.tipo = 'EDITAR'
      this.datosPerfil = dato

      

      //Form's
      this.formPerfil = new FormGroup({
        tdescripcion: new FormControl(this.datosPerfil.tdescripcion, Validators.required),
        testado: new FormControl(this.datosPerfil.testado, Validators.required)
      })

      //this.e_crearperfil(dato);
    });




  }

  //Crear Nivel perfil 
  e_crearperfil(dato: any) {

    //Clear
    let alerta: any = {};

    //arreglos POST
    let parametros: any = {}


    alerta['text'] = 'DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';
    alerta['footer'] = '';

    parametros = {
      eperfil: dato.ecodpadre,
      tdescripcion: dato.tdescripcion
    }

    /* this.alertaConfirm(alerta, (confirmed: boolean) => {
       if (confirmed == true) {
         this.e_notificarCrearPerfil(parametros);
       }
     });*/


  }

  //Alerta
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
    })
  }

  // Confirmar
  alertaConfirm(dato: any, callback: any) {
    let valor: boolean = false;
    Swal.fire({
      title: 'ATENCIÓN',
      text: dato['text'],
      icon: dato['tipo'],
      showCancelButton: true,
      confirmButtonColor: '#22bab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(valor);
      }
    })
    return valor;
  }

  //Consultar API de los PERFILES
  e_consultarPerfiles() {
    let idparente: string;
    let dataPerfil: any = {}

    //Clear datos arreglo
    this.IdataPerfil = []

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
            /*"Create": {
              "separator_before": false,
              "separator_after": true,
              "label": "Crear nivel",
              "action": function (obj: any) {
                
                //trigger
                $('#jstree').trigger('crearNivel', item.original.metada);
                //e_crear(item.original.metada)
              }
            },*/
            "Create2": {
              "separator_before": false,
              "separator_after": true,
              "label": "Crear sub-nivel",
              "action": function (obj: any) {
                
                //trigger
                $('#jstree').trigger('crearSubNivel', item.original.metada);
                //e_crear(item.original.metada)
              }
            },
            "Create3": {
              "separator_before": false,
              "separator_after": true,
              "label": "Editar perfil",
              "action": function (obj: any) {
                
                //trigger
                $('#jstree').trigger('editarPerfil', item.original.metada);
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

  // Guardar
  get frmPerfil() { return this.formPerfil.controls; }

  e_guardar(datos: any) {

    let parametros: any = {}
    let alerta: any = {}
    let text = '';
    let success: boolean

    this.submitGuardar = true;

    // Stop en caso de error
    if (this.formPerfil.invalid) {
      
      return;
    }


    if (typeof this.datosPerfil === 'undefined') {

      alerta['text'] = 'SELECCIONAR EL PERFIL PARA REALIZAR LA OPERACIÓN ';
      alerta['tipo'] = 'error';
      alerta['footer'] = 'PERFILES';
      this.alerta(alerta);
    }

    if (this.datosPerfil.tipo == 'NIVEL') {

      parametros = {
        eperfil: this.datosPerfil.ecodpadre,
        tdescripcion: datos.tdescripcion
      }

    } else if (this.datosPerfil.tipo == 'SUB-NIVEL') {

      parametros = {
        eperfil: this.datosPerfil.ecodperfil,
        tdescripcion: datos.tdescripcion
      }

    } else if (this.datosPerfil.tipo == 'EDITAR') {

      parametros = {
        eperfil: this.datosPerfil.ecodperfil,
        tdescripcion: datos.tdescripcion,
        testado: datos.testado
      }

    }

    alerta['text'] = '¿ DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';

    if (this.datosPerfil.tipo == 'EDITAR') {

      // Editar
      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.apiServiceUsuario.postEditarPerfil(parametros).subscribe(
            (response) => {

              /*if (response.success == true) {
                this.e_consultarPerfiles()

                alerta['text'] = response.data.mensaje;
              } else {

                let mensajeErrores = '';

                response.errores.forEach((datos: any, index: any) => {
                  mensajeErrores += datos.mensaje + '\n'
                })

                alerta['text'] = mensajeErrores;
              }*/

              if (response.data) {
                this.e_consultarPerfiles()
                success = true
                response.data.forEach((dato: any, index: any) => {
                  text += dato.attributes.text + '\n'
                })
              }

              alerta['text'] = text;
              alerta['tipo'] = (success == true ? "success" : "error");
              alerta['footer'] = "PERFILES";

              this.alerta(alerta);

            }
          )
        }
      })

    } else {
      // Nuevo
      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.apiServiceUsuario.postCrearPerfil(parametros).subscribe(
            (response) => {

              /*if (response.success == true) {
                this.e_consultarPerfiles()
                alerta['text'] = response.data.mensaje;
              } else {
                let mensajeErrores = '';
                response.errores.forEach((datos: any, index: any) => {
                  mensajeErrores += datos.mensaje + '\n'
                })

                alerta['text'] = mensajeErrores;
              }*/

              if (response.data) {
                this.e_consultarPerfiles()
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
              alerta['footer'] = "PERFILES";

              this.alerta(alerta);

            }
          )
        }
      })
    }


  }

  // Nuevo
  e_nuevo() {

    // Clear
    delete this.datosPerfil

    this.lblObservacionesPerfil = ''

    //Form's
    this.formPerfil = new FormGroup({
      tdescripcion: new FormControl('', Validators.required),
      testado: new FormControl('', Validators.required)
    })

  }

  //Redireccionar Menu
  e_menu() {
    this.router.navigate(['/dashboard/intranet/menu']);
  }

}
