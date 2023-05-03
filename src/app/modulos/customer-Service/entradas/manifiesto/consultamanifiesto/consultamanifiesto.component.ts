import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IconsultaPeriodo } from 'src/app/modelos/solicitudEntradas/datosconsultaperiodo.interfase';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConstants } from 'src/app/modelos/global';

import { AgGridModule } from 'ag-grid-angular';

import { RenderAcciones } from './render-acciones';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consultamanifiesto',
  templateUrl: './consultamanifiesto.component.html',
  styleUrls: ['./consultamanifiesto.component.css']
})
export class ConsultamanifiestoComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  datosConsultaPeriodo?: any;
  showContent?: boolean;

  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  rowData: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents : any

  constructor(private apiManifiesto: ApiServiceManifiesto, private spinner: NgxSpinnerService, private router: Router    ) {

    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 100,

      },
      {
        field: 'folioweb',
        width: 100,
        headerName: 'Transacción',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'testatus',
        width: 25,
        headerName: 'Estatus',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tipoSolicitud',
        width: 25,
        headerName: 'Servicio',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'correoprogramo',
        width: 25,
        headerName: 'Correo',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'fecharegistro',
        width: 25,
        headerName: 'Fecha registro',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'programo',
        width: 25,
        headerName: 'Programado',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'totalcargas',
        width: 25,
        headerName: 'Total bienes',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tipocarga',
        width: 25,
        headerName: 'Tipo',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      }
    ];


    this.defaultColDef = {
      flex: 1,
      minWidth: 200,
      resizable: true,
      sortable: true,
      floatingFilter: true,
    };

    this.paginationPageSize = 0
  }

  
  ngOnInit(): void {

    this.rowData = []

    //POST
    this.apiManifiesto.postConsultManifPeriodo().subscribe(
      (response) => {
        this.e_procesar_datos(response)
        //this.rowData =  response
        //console.log(response);

      }
    )
  }

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }



  e_procesar_datos(datos: any) {

    let datoSolEntradas: Array<any> = [];


    datos.forEach((dato: any, index: any) => {

      dato.editar = 8
      datoSolEntradas.push(dato);

    })

    //console.log(datos);

    this.rowData = datoSolEntradas

      //console.log(this.rowData);
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo(){
    this.router.navigate(['dashboard/customer/entradas/nuevo']);
  }
}
