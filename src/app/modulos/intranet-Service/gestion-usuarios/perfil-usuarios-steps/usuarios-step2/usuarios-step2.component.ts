import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceUsuario } from 'src/app/serviciosRest/Intranet/usuarios/api.service.usuario';
import { RenderAcciones } from './render-acciones';
import { Router } from '@angular/router';

// Service para usar datos en otro componente
import { serviceDatosPerfilUsuarios } from 'src/app/service/service.datosPerfilUsuarios'
import { UntypedFormArray, UntypedFormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { RenderAccionesUsuariosAsignados } from './render-acciones-asignados';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

export interface entidades {
  ecodusuario: number,
  tnombre: string,
}

@Component({
  selector: 'app-usuarios-step2',
  templateUrl: './usuarios-step2.component.html',
  styleUrls: ['./usuarios-step2.component.css']
})
export class UsuariosStep2Component implements OnInit {

  //Table
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumnsPendientes: string[] = ['acciones', 'ecodusuario', 'tnombre'];
  listaUsuariosPendientes = new MatTableDataSource<entidades>([]);

  displayedColumnsAsignados: string[] = ['acciones', 'ecodusuario', 'tnombre'];
  listaUsuariosAsignados = new MatTableDataSource<entidades>([]);



  //Form's
  formUsuarioPendientes = new FormGroup({})
  formUsuarioAsignados = new FormGroup({})

  //Label's
  lblpath: string = ''

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  // Datos service
  serviceDatosPerfil = this.serviceDatosPerfilUsuario.datosPerfilUsuarios


  /*
  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  dataUsuario: any
  dataUsuarioAsignados: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any
  gridOptions: any;

  // Configurar para la tabla de usuario ASIGNADOS
  columnDefs_asignados: any
 */

  constructor(private apiServiceUsuario: ApiServiceUsuario, private router: Router, private serviceDatosPerfilUsuario: serviceDatosPerfilUsuarios, private formBuilder: UntypedFormBuilder) {





    /*
    //Columnas de usuarios
    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 100,
      },
      {
        field: 'ecodusuario',
        headerName: 'Id',
        width: 100,
      },
      {
        field: 'tnombre',
        headerName: 'Usuario',
        width: 600,
      }
    ]


    this.columnDefs_asignados = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAccionesUsuariosAsignados,
        width: 100,
      },
      {
        field: 'ecodusuario',
        headerName: 'Id',
        width: 100,
      },
      {
        field: 'tnombre',
        headerName: 'Usuario',
        width: 600,
      }
    ]
    */




    /*
    this.defaultColDef = {
      //flex: 1,
      //autoWidth: 'value',
      // resizable: true,
      // autoWidth: false,
      //sortable: true,
      componentParent: this,
      //fixedColumns: false
    };

    this.gridOptions = {
      context: {
        componentParent: this
      }
    };

    this.paginationPageSize = 0
    */

  }




  ngOnInit(): void {

    // Form usuario pendientes
    /*this.formUsuarioPendientes = this.formBuilder.group({
      value: this.formBuilder.array([])
    });*/

    //Form usuasrio asignados
    /*this.formUsuarioAsignados = this.formBuilder.group({
      value: this.formBuilder.array([])
    });*/

    //Clear
    //this.dataUsuario = []

    //Datos del componenet origen perfiles step 1
    
    

    //let datosPerfil = this.serviceDatosPerfilUsuario.datosPerfilUsuarios
    //Parceo de datos
    //this.lblpath = datosPerfil.tpath


    /////////////////////// POST ////////////////////////////////////

    let datoUsuariosPendiente = {
      testado: 'PENDIENTES',
      eperfil: 4
    }

    //POST servicio consultar usuario PENDIENTES
    this.apiServiceUsuario.postConsultarUsuariosPerfil(datoUsuariosPendiente).subscribe(
      (response) => {
        //this.dataUsuario = response}
        
        this.listaUsuariosPendientes.data = response as entidades[];
        this.listaUsuariosPendientes.paginator = this.paginator;
      }
    )


    let datoUsuariosAsginados = {
      testado: 'ASIGNADOS',
      eperfil: this.serviceDatosPerfil.ecodperfil
    }

    //POST servicio consultar usuario ASIGNADOS
    this.apiServiceUsuario.postConsultarUsuariosPerfil(datoUsuariosAsginados).subscribe(
      (response) => {
        
        this.listaUsuariosAsignados.data = response as entidades[];
        this.listaUsuariosAsignados.paginator = this.paginator;
      }
    )

    /////////////////////////////////////////////////////////////////


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
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(valor);
      }
    })
    return valor;
  }

  //Regresar
  e_regresar() {
    this.router.navigate(['dashboard/intranet/administracion/config/perfiles/step1']);
  }

  //Agregar
  e_agregar(datos: any) {

    //Alerta
    let alerta: any = {};
    // Post prepara tratamiento de envio de datos
    let parametros: any = {}
    let datoPerfil: any = {}
    let arrdatosUsuarios: any = []
    let datoUsuario: any = {}

    let arrUsuarios: any = []

    //arrUsuarios = this.formUsuarioPendientes.value;

    if (arrUsuarios.value.length == 0) {
      alerta['text'] = 'SELECCIONAR EL O LOS USUARIO(S) PARA AGREGAR'
      alerta['tipo'] = 'error'
      alerta['footer'] = ''
      this.alerta(alerta)
    } else {

      datoPerfil = {
        eperfil: this.serviceDatosPerfil.ecodperfil
      }

      arrUsuarios.value.forEach((dato: any, valor: any) => {
        datoUsuario = {}
        datoUsuario = {
          eusuario: dato
        }
        arrdatosUsuarios.push(datoUsuario);
        

      })


      parametros = {
        perfil: datoPerfil,
        usuarios: arrdatosUsuarios
      }



      //Clear
      alerta = {};

      alerta['text'] = '¿ DESEA CONTINUAR ?';
      alerta['tipo'] = 'question';
      alerta['footer'] = 'PERFIL';


      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.e_notificarAsignacionUsuario(parametros);
        }
      });



    }
  }

  //Consumir API para asignar usuario
  e_notificarAsignacionUsuario(datos: any) {
    // Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiServiceUsuario.postAsignarPerfilUsuario(datos).subscribe(
      (response) => {

        /*if (response.success == true) {
          alerta['text'] = response.data.mensaje;
        } else {
          let mensajeErrores = '';
          response.errores.forEach((datos: any, index: any) => {
            mensajeErrores += datos.mensaje + '\n'
          })
          alerta['text'] = mensajeErrores;
        }*/

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
        alerta['footer'] = "PERFIL";
        this.alerta(alerta);


      }
    )
  }

  //Evrntos OnChange de las tablas
  e_onChangeRoot(dato1: any, dato2: any) {
    

    //const usuarioPendientes = (this.formUsuarioPendientes.controls.value as UntypedFormArray);

    let usuarioPendientes: any;

    if (dato2.checked) {
      usuarioPendientes.push(new FormControl(dato1));
    } else {
      //const index = usuarioPendientes.controls.findIndex(x => x.value === dato1);
      //usuarioPendientes.removeAt(index);
      null;
    }

  }


  //Root
  e_onChangeRootAsignados(dato1: any, dato2: any) {
    

    //const usuariosAsignados = (this.formUsuarioAsignados.controls.value as UntypedFormArray);

    let usuariosAsignados: any;

    if (dato2.checked) {
      usuariosAsignados.push(new FormControl(dato1));
    } else {
      null;
      //const index = usuariosAsignados.controls.findIndex(x => x.value === dato1);
      //usuariosAsignados.removeAt(index);
    }

  }

  //Eliminar
  e_eliminar(datos: any) {

    //Alerta
    let alerta: any = {};

    // arreglo
    let arrUsuarios: any = []

    // arreglo para el tratamiento y envio de datos
    let parametros: any = {}
    let datoPerfil: any = {}
    let datoUsuario: any = {}
    let arrdatosUsuarios: any = []

    arrUsuarios = this.formUsuarioAsignados.value;

    

    if (arrUsuarios.value.length == 0) {
      alerta['text'] = 'SELECCIONAR EL O LOS USUARIO(S) PARA ELIMINAR DEL PERFIL ASIGNADO'
      alerta['tipo'] = 'error'
      alerta['footer'] = ''
      this.alerta(alerta)
    } else {
      //Preparar el arreglo

      datoPerfil = {
        eperfil: this.serviceDatosPerfil.ecodperfil
      }

      arrUsuarios.value.forEach((dato: any, valor: any) => {
        datoUsuario = {}
        datoUsuario = {
          eusuario: dato
        }
        arrdatosUsuarios.push(datoUsuario);
        

      })


      parametros = {
        perfil: datoPerfil,
        usuarios: arrdatosUsuarios
      }

      //Clear
      alerta = {};

      alerta['text'] = '¿ DESEA CONTINUAR ?';
      alerta['tipo'] = 'question';
      alerta['footer'] = '';

      // callback confirmacion
      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.e_postDesAsignacionUsuario(parametros);
        }
      });

    }
  }

  //Consumir API para asignar usuario
  e_postDesAsignacionUsuario(datos: any) {
    // Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiServiceUsuario.postDesAsignarPerfilUsuario(datos).subscribe(
      (response) => {

        /*if (response.success == true) {
          alerta['text'] = response.data.mensaje;
        } else {
          let mensajeErrores = '';
          response.errores.forEach((datos: any, index: any) => {
            mensajeErrores += datos.mensaje + '\n'
          })
          alerta['text'] = mensajeErrores;
        }*/

        if (response.data) {
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
          })
        }

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "PERFIL";
        this.alerta(alerta);

      }
    )
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/intranet/menu']);
  }
}
