import { Component, OnInit, ViewChild } from '@angular/core';
import { apiClienteDirecto } from 'src/app/serviciosRest/Intranet/cliente/api.service.clienteDirecto';
import { GlobalConstants } from 'src/app/modelos/global';
import { Router } from '@angular/router';
import { FormArray, UntypedFormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { serviceDatosPerfilUsuarios } from 'src/app/service/service.datosPerfilUsuarios'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';


export interface entidades {
  ecodcliente: number,
  ecodclientepadre: number,
  trazonsocial: string,
  trfc: string,
  ttipocliente: string,
  testado:string,
  fhfecharegistro:string
}


@Component({
  selector: 'app-perfil-cliente-step2',
  templateUrl: './perfil-cliente-step2.component.html',
  styleUrls: ['./perfil-cliente-step2.component.css']
})
export class PerfilClienteStep2Component implements OnInit {

  //Table
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumnsPendientes: string[] = ['acciones', 'ecodcliente','trazonsocial', 'trfc' ];
  dataSourceUsuariosPendientes = new MatTableDataSource<entidades>([]);


  displayedColumnsAsignados: string[] = ['acciones', 'ecodcliente','trazonsocial', 'trfc' ];
  dataSourceUsuariosAsginados = new MatTableDataSource<entidades>([]);


  //Form's
  formClienteDirecto = new FormGroup({})
  formClienteAsignados = new FormGroup({})

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //Label's
  lblpathPerfil: string = ""

  /*
  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  dataClienteDirecto: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any
  gridOptions: any;


  //Configuracion table clientes asignados
  columnDefsAsignados: any
  gridOptionsAsignados: any;
  dataClienteAsignado: any
*/


  // Id del cliente
  eclienteFinal: number = 0

  //Id cliente asignados
  eclienteAsignados: number = 0


  // Datos service (datos del perfil)
  serviceDatosPerfil = this.serviceDatosPerfilUsuario.datosPerfilUsuarios


  constructor(private apiCliente: apiClienteDirecto,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private serviceDatosPerfilUsuario: serviceDatosPerfilUsuarios,
    private apiClienteDirecto: apiClienteDirecto

  ) {



  }

  ngOnInit(): void {

    //Let datos del perfil
    let datosPerfil = this.serviceDatosPerfilUsuario.datosPerfilUsuarios

    //Parceo de datos
    this.lblpathPerfil = datosPerfil.tpath

    // Form usuario pendientes
    this.formClienteDirecto = this.formBuilder.group({
      value: this.formBuilder.array([])
    });


    //POST
    let parametros1 = {
      eperfil: this.serviceDatosPerfil.ecodperfil,
    }
    
    this.apiCliente.postConsultarPerfilClientePendiente(parametros1).subscribe(
      (response) => {
        this.dataSourceUsuariosPendientes.data = response as entidades [];
        this.dataSourceUsuariosPendientes.paginator = this.paginator;
      }
    )

    //POST
    let parametros2 = {
      eperfil: this.serviceDatosPerfil.ecodperfil,
    }
    this.apiCliente.postConsultarPerfilCliente(parametros2).subscribe(
      (response) => {
        this.dataSourceUsuariosAsginados.data = response as entidades [];
        this.dataSourceUsuariosAsginados.paginator = this.paginator;
      }
    )

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
      //this.e_procesar_consultar_clientes()
      console.log(result);
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


  //Consultar las api's 
  /*e_procesar_consultar_clientes() {
    //POST
    let parametros1 = {
      eperfil: this.serviceDatosPerfil.ecodperfil,
    }

    this.apiCliente.postConsultarPerfilClientePendiente(parametros1).subscribe(
      (response) => {
        this.e_procesar_datos(response)
        //this.rowData =  response
        //console.log(response);
      }
    )

    //POST
    let parametros2 = {
      eperfil: this.serviceDatosPerfil.ecodperfil,
    }
    this.apiCliente.postConsultarPerfilCliente(parametros2).subscribe(
      (response) => {
        this.e_procesar_datos_perfil_cliente(response)
      }
    )
  }*/

  //Procesar datos del API para crear el reporte
  /*e_procesar_datos(datos: any) {
    let datoClientes: Array<any> = [];
    datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato);
    })
  }*/

  //Procesar datos del API para crear el reporte perfil con cliente
  /*e_procesar_datos_perfil_cliente(datos: any) {
    let datoClientes: Array<any> = [];
    datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato);
    })
  }*/



  //Regresar
  e_regresar() {
    this.router.navigate(['dashboard/intranet/administracion/config/perfiles/cliente/step1']);
  }


  //Change del reporte de clientes pendientes de perfil
  e_onChangeRootPendiente(datos1: any, datos2: any) {
    //Clear
    this.eclienteFinal = 0
    this.eclienteFinal = datos2.value
  }


  //Change del reporte de clientes asignados
  e_onChangeRootAsignado(datos1: any, datos2: any) {
    //Clear
    this.eclienteAsignados = 0
    this.eclienteAsignados = datos2.value
  }

  //Agregar Cliente Directo
  e_agregarClienteDirecto(datos: any) {
    //Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    if (this.eclienteFinal == 0) {
      alerta['text'] = 'SELECCIONAR EL CLIENTE'
      alerta['tipo'] = 'error'
      alerta['footer'] = ''
      this.alerta(alerta)
    } else {

      //Clear
      alerta = {};

      alerta['text'] = '¿ DESEA CONTINUAR ?';
      alerta['tipo'] = 'question';
      alerta['footer'] = 'PERFIL';


      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          //this.e_notificarAsignacionUsuario(parametros);

          //Prepara los datos 
          let parametros = {}
          parametros = {
            eperfil: this.serviceDatosPerfil.ecodperfil,
            ecliente: this.eclienteFinal
          }

          this.apiClienteDirecto.postCrearPerfilCliente(parametros).subscribe(
            (response) => {

              if (response.data) {
                success = true
                response.data.forEach((dato: any, index: any) => {
                  text += dato.attributes.text + '\n'
                })
              }

              if (response.errors) {
                success = false
                response.errors.forEach((dato: any, index: any) => {
                  //console.log(dato.attributes.text)
                  text += dato.attributes.text + '\n'
                })
              }

              alerta['text'] = text;
              alerta['tipo'] = (success == true ? "success" : "error");
              alerta['footer'] = "CLIENTE";
              this.alerta(alerta);
            }
          )

        }
      });
    }
  }

  e_eliminarClienteDirecto(datos: any) {
    //console.log('Eliminar')
    //console.log(this.eclienteAsignados)

    //Alerta
    let alerta: any = {};
    let text = '';
    let success: boolean

    if (this.eclienteAsignados == 0) {
      alerta['text'] = 'SELECCIONAR EL CLIENTE A RETIRAR'
      alerta['tipo'] = 'error'
      alerta['footer'] = ''
      this.alerta(alerta)
    } else {

      //Clear
      alerta = {};

      alerta['text'] = '¿ DESEA CONTINUAR ?';
      alerta['tipo'] = 'question';
      alerta['footer'] = 'PERFIL';


      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          //this.e_notificarAsignacionUsuario(parametros);

          //Prepara los datos 
          let parametros = {}
          parametros = {
            eperfil: this.serviceDatosPerfil.ecodperfil,
            ecliente: this.eclienteAsignados
          }

          this.apiClienteDirecto.postDesAsignarClienteDirecto(parametros).subscribe(
            (response) => {

              if (response.data) {
                success = true
                response.data.forEach((dato: any, index: any) => {
                  text += dato.attributes.text + '\n'
                })
              }

              if (response.errors) {
                success = false
                response.errors.forEach((dato: any, index: any) => {
                  //console.log(dato.attributes.text)
                  text += dato.attributes.text + '\n'
                })
              }

              alerta['text'] = text;
              alerta['tipo'] = (success == true ? "success" : "error");
              alerta['footer'] = "CLIENTE";
              this.alerta(alerta);
            }
          )

        }
      });
    }
  }



}



