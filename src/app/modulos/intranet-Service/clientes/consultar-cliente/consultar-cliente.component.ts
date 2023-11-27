import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiClienteDirecto } from 'src/app/serviciosRest/Intranet/cliente/api.service.clienteDirecto';
import { RenderAcciones } from './render-acciones';


@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css']
})
export class ConsultarClienteComponent implements OnInit {
  //Path base
  directorio: string = GlobalConstants.pathCustomer;


  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  rowData: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any

  constructor(private apiCliente: apiClienteDirecto) {

    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 20,

      },
      {
        field: 'ecodcliente',
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
      this.apiCliente.postConsultarTipoClientes().subscribe(
        (response) => {
          this.e_procesar_datos(response)
          //this.rowData =  response
          

        }
      )
  }

  
  e_procesar_datos(datos: any) {

    let datoClientes: Array<any> = [];


    datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato);

    })

    

    this.rowData = datoClientes

      

  }


}
