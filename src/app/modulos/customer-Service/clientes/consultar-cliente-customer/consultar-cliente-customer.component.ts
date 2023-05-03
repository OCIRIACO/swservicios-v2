import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { RenderAcciones } from './render-acciones';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { Router } from '@angular/router';


@Component({
  selector: 'app-consultar-cliente-customer',
  templateUrl: './consultar-cliente-customer.component.html',
  styleUrls: ['./consultar-cliente-customer.component.css']
})
export class ConsultarClienteCustomerComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathCustomer;


  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  rowData: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any

  constructor(private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,
    private router: Router
  ) {

    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 20,

      },
      {
        field: 'ecliente',
        width: 20,
        headerName: 'Id.cliente',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'trazonsocial',
        width: 20,
        headerName: 'Razón social',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'trfc',
        width: 20,
        headerName: 'Correo',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      }
    ];

    this.defaultColDef = {
      flex: 1,
      minWidth: 50,
      resizable: true,
      sortable: true,
      floatingFilter: true,
    };

    this.paginationPageSize = 0

  }

  ngOnInit(): void {

    this.rowData = []

    //POST

    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        this.e_procesar_datos(response)
        //this.rowData =  response
        //console.log(response);

      }
    )
  }

  e_procesar_datos(datos: any) {
    this.rowData = datos.data
  }

  //Redireccionar nuevo cliente
  e_nuevo(){
    this.router.navigate(['dashboard/customer/clientes/nuevo']);
  }

}
