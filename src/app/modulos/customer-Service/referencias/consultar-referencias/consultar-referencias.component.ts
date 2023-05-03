import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RenderAcciones } from './render-acciones';
import { GlobalConstants } from 'src/app/modelos/global';


@Component({
  selector: 'app-consultar-referencias',
  templateUrl: './consultar-referencias.component.html',
  styleUrls: ['./consultar-referencias.component.css']
})
export class ConsultarReferenciasComponent implements OnInit {

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

  constructor(
    private router: Router
  ) {

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
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/entradas/nuevo']);
  }

}
