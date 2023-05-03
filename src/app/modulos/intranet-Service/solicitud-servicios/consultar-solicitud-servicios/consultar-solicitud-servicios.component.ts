import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { RenderAcciones } from './render-acciones';
import { apiSolicitudServicios } from 'src/app/serviciosRest/Intranet/servicios/api.service.servicios';


@Component({
  selector: 'app-consultar-solicitud-servicios',
  templateUrl: './consultar-solicitud-servicios.component.html',
  styleUrls: ['./consultar-solicitud-servicios.component.css']
})
export class ConsultarSolicitudServiciosComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //Configuraciones para la tabla
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any
  rowData: any
  defaultColDef: any
  paginationPageSize: any;
  frameworkComponents: any


  constructor(
    private apiSolicitudServicios: apiSolicitudServicios
  ) {

    this.columnDefs = [
      {
        headerName: 'Acciones',
        cellRendererFramework: RenderAcciones,
        width: 20,

      },
      {
        field: 'etransaccion',
        width: 20,
        headerName: 'Transacción',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tcorreo',
        width: 20,
        headerName: 'Correo',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ttelefono',
        width: 20,
        headerName: 'Teléfono',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'treferencia',
        width: 20,
        headerName: 'Referencia',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'fhfecharegistro',
        width: 20,
        headerName: 'Fecha registro',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      },
      {
        field: 'fhfechaservicio',
        width: 20,
        headerName: 'Fecha servicio',
        suppressMenu: true,
        filter: 'agTextColumnFilter'
      }
    ]

    this.defaultColDef = {
      flex: 1,
      minWidth: 20,
      resizable: true,
      sortable: true,
      floatingFilter: true,
    };

    this.paginationPageSize = 0
  }

  ngOnInit(): void {
    //Radio checked y click
    let checkbox = document.getElementById('rdpendiente') as HTMLInputElement
    checkbox.checked = true
    checkbox.click()


    //Clear rowdata para pintar el reporte
    this.rowData = []
  }

  e_opcion(datos: any) {
    //console.log(datos.target.id);
    // console.log(datos.target.attributes.value.value);

    let parametros = {
      ttiposolicitud: 'SERVICIO',
      testatus: datos.target.attributes.value.value
    }

    this.apiSolicitudServicios.postConsultarSolicitudesServicios(parametros).subscribe(
      (response) => {
        //this.e_procesar_datos(response)
        this.rowData = response

      }
    )
  }

}
