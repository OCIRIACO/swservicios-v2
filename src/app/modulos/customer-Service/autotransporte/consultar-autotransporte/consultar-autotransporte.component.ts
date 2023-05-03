import { Component, OnInit } from '@angular/core';
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { RenderAcciones } from './render-acciones';


@Component({
  selector: 'app-consultar-autotransporte',
  templateUrl: './consultar-autotransporte.component.html',
  styleUrls: ['./consultar-autotransporte.component.css']
})
export class ConsultarAutotransporteComponent implements OnInit {

  


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
  frameworkComponents: any

  constructor(
    private router: Router,
    private apiServicios: apiServiceSolicitudServicios,
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
        headerName: 'Tipo solicitud',
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

    //Parametros
    let parametros = {}

    parametros = {
      tunidadnegocio :"LOGISTICO",
      toperacion:"TRANSPORTE"
    }

    //POST
    this.apiServicios.postConsultarSolicitudesServicios(parametros).subscribe(
      (response) => {
        this.e_procesar_datos(response)
        //this.rowData =  response
        //console.log(response);

      }
    )

  }

  e_procesar_datos(datos: any) {

    let datoSolEntradas: Array<any> = [];
    datos.forEach((dato: any, index: any) => {
      dato.editar = 8
      datoSolEntradas.push(dato);

    })

    this.rowData = datoSolEntradas
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/transporte/nuevo']);
  }

}
