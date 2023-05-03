import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

  //Path base
  directorio: string = GlobalConstants.pathIntranet;


  // Submit's 
  submitGuardar = false;

  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  rowData: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any
  gridOptions: any;

  //Form's
  formUsuario = new UntypedFormGroup({
    ecodusuario: new UntypedFormControl(0, Validators.required),
    tnombre: new UntypedFormControl('', Validators.required),
    tdireccion: new UntypedFormControl('', Validators.required),
    ttelefono: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('', Validators.required),
    tusuario: new UntypedFormControl('', Validators.required),
    tpassword: new UntypedFormControl('', Validators.required),
    testado: new UntypedFormControl('', Validators.required),
  })


  constructor(private apiServiceUsuario: ApiServiceUsuario) {

    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 100,

      },
      {
        field: 'ecodusuario',
        width: 100,
        headerName: 'Id'
      },
      {
        field: 'tnombre',
        width: 100,
        headerName: 'Nombre'
      },
      {
        field: 'tdireccion',
        width: 100,
        headerName: 'Direccion'
      },
      {
        field: 'ttelefono',
        width: 100,
        headerName: 'Teléfono'
      },
      {
        field: 'tcorreo',
        width: 100,
        headerName: 'Correo'
      },
      {
        field: 'tusuario',
        width: 100,
        headerName: 'Usuario'
      },
      {
        field: 'tpassword',
        width: 100,
        headerName: 'Password'
      },
      {
        field: 'testado',
        width: 100,
        headerName: 'Estado'
      }
    ]


    this.defaultColDef = {
      flex: 1,
      minWidth: 200,
      resizable: true,
      sortable: true,
      floatingFilter: true,
      componentParent: this
    };

    this.gridOptions = {
      context: {
        componentParent: this
      }
    };

    this.paginationPageSize = 0

  }



  ngOnInit(): void {
    this.rowData = []

    //Consultar listado de usuarios
    this.e_concultarListadoUsuario()
  }

  // consultar usuario
  e_concultarListadoUsuario() {
    //POST servicio consultar usuario
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
    this.rowData = datos
  }

  // Guardar

  get frmUsuario() { return this.formUsuario.controls; }
  e_guardar(datos: any) {


    this.submitGuardar = true;

    // Stop en caso de error
    if (this.formUsuario.invalid) {
      //console.log('error');
      return;
    }

    console.log(datos)

    if (datos.ecodusuario == 0) {
      this.e_crear_nuevo_usuario(datos)
    } else {
      this.e_editar_nuevo_usuario(datos)
    }

  }

  // Consumir API para crer nuevo usuario
  e_crear_nuevo_usuario(datos: any) {

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
      tnombre: datos.tnombre,
      tdireccion: datos.tdireccion,
      ttelefono: datos.ttelefono,
      tcorreo: datos.tcorreo,
      tusuario: datos.tusuario,
      tpassword: datos.tpassword
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
  e_editar_nuevo_usuario(datos: any) {


    //Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    //datos post
    let datosUsuario: any

    datosUsuario = {
      eusuario: datos.ecodusuario,
      tnombre: datos.tnombre,
      tdireccion: datos.tdireccion,
      ttelefono: datos.ttelefono,
      tcorreo: datos.tcorreo,
      tusuario: datos.tusuario,
      tpassword: datos.tpassword,
      testado: datos.testado
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
              success=true
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
    //console.log('datos....')
    //console.log(dato)

    this.formUsuario = new UntypedFormGroup({
      ecodusuario: new UntypedFormControl(dato.ecodusuario, Validators.required),
      tnombre: new UntypedFormControl(dato.tnombre, Validators.required),
      tdireccion: new UntypedFormControl(dato.tdireccion, Validators.required),
      ttelefono: new UntypedFormControl(dato.ttelefono, Validators.required),
      tcorreo: new UntypedFormControl(dato.tcorreo, Validators.required),
      tusuario: new UntypedFormControl(dato.tusuario, Validators.required),
      tpassword: new UntypedFormControl(dato.tpassword, Validators.required),
      testado: new UntypedFormControl(dato.testado, Validators.required),
    })
  }

  // Nuevo usuario
  e_nuevo() {
    this.formUsuario = new UntypedFormGroup({
      ecodusuario: new UntypedFormControl(0, Validators.required),
      tnombre: new UntypedFormControl('', Validators.required),
      tdireccion: new UntypedFormControl('', Validators.required),
      ttelefono: new UntypedFormControl('', Validators.required),
      tcorreo: new UntypedFormControl('', Validators.required),
      tusuario: new UntypedFormControl('', Validators.required),
      tpassword: new UntypedFormControl('', Validators.required),
      testado: new UntypedFormControl('', Validators.required),
    })
  }

}
