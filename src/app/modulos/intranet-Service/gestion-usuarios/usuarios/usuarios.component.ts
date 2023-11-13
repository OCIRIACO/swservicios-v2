import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';
import Swal from 'sweetalert2';
import { RenderAcciones } from './render-acciones';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  //NgForm
  @ViewChild('solicitudForm') ngFormSolicitudUsuario: NgForm;


  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  // Submit's 
  submitGuardar = false;

  //Reportes
  usuariosList: Array<any> = [];

  //Form's
  formUsuario = new FormGroup({
    ecodusuario: new FormControl(0, Validators.required),
    tnombre: new FormControl('', Validators.required),
    tdireccion: new FormControl('', Validators.required),
    ttelefono: new FormControl('', Validators.required),
    tcorreo: new FormControl('', Validators.required),
    tusuario: new FormControl('', Validators.required),
    tpassword: new FormControl('', Validators.required),
    testado: new FormControl('', Validators.required),
  })


  constructor(private apiServiceUsuario: ApiServiceUsuario) {
  }



  ngOnInit(): void {
    //Consultar listado de usuarios
    this.e_concultarListadoUsuario()
  }

  // consultar usuario
  e_concultarListadoUsuario() {

    this.apiServiceUsuario.postConsultarUsuarios().subscribe(
      (response) => {
        this.e_procesar_datos(response)

      }
    )
  }


  //Alerta general
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

  // Alerta de confirmacion
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

  // procesar datos del web service
  e_procesar_datos(datos: any) {

    //Zona de reporte
    this.usuariosList = datos
  }

  // Guardar

  //get frmUsuario() { return this.formUsuario.controls; }

  e_guardar(datos: NgForm) {


    //this.submitGuardar = true;

    //console.log(datos);

    // Stop en caso de error
    if (datos.invalid) {
      console.log('error');
      return;
    }


    if (datos.value.ecodusuario == 0) {
      this.e_crear_nuevo_usuario(datos)
    } else {
      this.e_editar_nuevo_usuario(datos)
    }

  }

  // Consumir API para crer nuevo usuario
  e_crear_nuevo_usuario(datos: NgForm) {

    //Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    //datos post
    let datosUsuario: any

    alerta['text'] = '¿ DESEA CONTINUAR ?';
    alerta['tipo'] = 'question';
    alerta['footer'] = 'USUARIO';

    datosUsuario = {
      tnombre: datos.value.tnombre,
      tdireccion: datos.value.tdireccion,
      ttelefono: datos.value.ttelefono,
      tcorreo: datos.value.tcorreo,
      tusuario: datos.value.tusuario,
      tpassword: datos.value.tpassword
    }



    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {
        //Post
        this.apiServiceUsuario.postCrearNuevoUsuario(datosUsuario).subscribe(
          (response) => {

            /*if (response.success == true) {
               this.e_nuevo()
               this.e_concultarListadoUsuario()
            } else {
              let mensajeErrores = '';
              response.errores.forEach((datos: any, index: any) => {
                mensajeErrores += datos.mensaje + '\n'
              })
              alerta['text'] = mensajeErrores;
            }*/

            if (response.data) {

              this.e_nuevo()
              this.e_concultarListadoUsuario()
              success = true

              response.data.forEach((dato: any, index: any) => {
                text += dato.attributes.text + '\n'
              })
            }


            alerta['text'] = text;
            alerta['tipo'] = (success == true ? "success" : "error");

            this.alerta(alerta);

          }
        )
      }
    });


  }

  //Consumir API para editar usuario
  e_editar_nuevo_usuario(datos: NgForm) {


    //Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    //datos post
    let datosUsuario: any

    datosUsuario = {
      eusuario: datos.value.ecodusuario,
      tnombre: datos.value.tnombre,
      tdireccion: datos.value.tdireccion,
      ttelefono: datos.value.ttelefono,
      tcorreo: datos.value.tcorreo,
      tusuario: datos.value.tusuario,
      tpassword: datos.value.tpassword,
      testado: datos.value.testado
    }


    let mensajeResponse = '';


    alerta['text'] = '¿ DESEA CONTINUAR ?';
    alerta['tipo'] = 'question';
    alerta['footer'] = '';


    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {
        this.apiServiceUsuario.postEditarUsuario(datosUsuario).subscribe(
          (response) => {

            /*if (response.success == true) {
                response.data.forEach((datos: any, index: any) => {
                  mensajeResponse += datos.mensaje + '\n'
                })
                alerta['text'] = mensajeResponse;
                this.e_nuevo()
                this.e_concultarListadoUsuario()
            } else {
              response.errores.forEach((datos: any, index: any) => {
                mensajeResponse += datos.mensaje + '\n'
              })
              alerta['text'] = mensajeResponse;
            }*/

            if (response.data) {
              this.e_nuevo()
              this.e_concultarListadoUsuario()
              success = true
              response.data.forEach((dato: any, index: any) => {
                text += dato.attributes.text + '\n'
              })
            }


            alerta['text'] = text;
            alerta['tipo'] = (success == true ? "success" : "error");
            alerta['footer'] = "USUARIO";
            this.alerta(alerta);

          }
        )
      }
    });

  }





  // Editar Usuario
  editarUsuario(dato: any) {


    let usuario = {
      ecodusuario: dato.ecodusuario,
      tnombre: dato.tnombre,
      tdireccion: dato.tdireccion,
      ttelefono: dato.ttelefono,
      tcorreo: dato.tcorreo,
      tusuario: dato.tusuario,
      tpassword: dato.tpassword,
      testado: dato.testado,
    }

    this.ngFormSolicitudUsuario.form.setValue(usuario)

    /* 
    OLD BORRAR
     console.log('datos....')
     console.log(dato)
 
     this.formUsuario = new FormGroup({
       ecodusuario: new FormControl(dato.ecodusuario, Validators.required),
       tnombre: new FormControl(dato.tnombre, Validators.required),
       tdireccion: new FormControl(dato.tdireccion, Validators.required),
       ttelefono: new FormControl(dato.ttelefono, Validators.required),
       tcorreo: new FormControl(dato.tcorreo, Validators.required),
       tusuario: new FormControl(dato.tusuario, Validators.required),
       tpassword: new FormControl(dato.tpassword, Validators.required),
       testado: new FormControl(dato.testado, Validators.required),
     })
 
     */

  }

  // Nuevo usuario
  e_nuevo() {
    this.formUsuario = new FormGroup({
      ecodusuario: new FormControl(0, Validators.required),
      tnombre: new FormControl('', Validators.required),
      tdireccion: new FormControl('', Validators.required),
      ttelefono: new FormControl('', Validators.required),
      tcorreo: new FormControl('', Validators.required),
      tusuario: new FormControl('', Validators.required),
      tpassword: new FormControl('', Validators.required),
      testado: new FormControl('', Validators.required),
    })
  }

}
