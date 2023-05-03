import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/modelos/global';

import { ApiServiceBienes } from 'src/app/serviciosRest/Intranet/historial/api.service.bienes'
import { IparametrosInventario } from 'src/app/modelos/historial/historial.interfase'
import { Subject } from 'rxjs';

import { ColDef } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {

  //Form Busqueda
  FormBusqueda = new UntypedFormGroup({
    ttipobusqueda: new UntypedFormControl('', Validators.required),
    fhfechainicio: new UntypedFormControl('', Validators.required),
    fhfechafin: new UntypedFormControl('', Validators.required),
  })

  // Submit's 
  submitBusqueda = false

  //Listado Bienes
  arrBienes: Array<any> = [];


  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  gridApi: any;
  gridColumnApi: any;

  columnDefs: any;
  rowData: any;
  defaultColDef: any;

  pagination: any;
  paginationPageSize: any;
  gridOptions: any

  //Div's show and hide
  divFechas: boolean = true

  constructor(private apiBienes: ApiServiceBienes, private http: HttpClient) {
    this.columnDefs = [
      {
        field: 'eguia',
        width: 25,
        headerName: 'Guia',
        filter: 'agNumberColumnFilter',
        suppressMenu: true,
      },
      {
        field: 'ttipocarga',
        width: 100,
        headerName: 'Tipo',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ttramite',
        width: 100,
        headerName: 'Tramite',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ttipocontendor',
        width: 100,
        headerName: 'Tipo',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tmarcas',
        width: 100,
        headerName: 'Marca',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'epesomanifestado',
        width: 100,
        headerName: 'Peso manif.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'epesorecibido',
        width: 100,
        headerName: 'Peso recib.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'epesoliberado',
        width: 100,
        headerName: 'Peso liber.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'epesoentregado',
        width: 100,
        headerName: 'Peso entre.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecantidadmanifestado',
        width: 100,
        headerName: 'Cantidad manif.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecantidadrecibido',
        width: 100,
        headerName: 'Cantidad recib.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecantidadliberado',
        width: 100,
        headerName: 'Cantidad liber.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecantidadentregado',
        width: 100,
        headerName: 'Cantidad entre.',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'fhfechaentrada',
        width: 100,
        headerName: 'Fecha entrada',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'fhfechasalida',
        width: 100,
        headerName: 'Fecha salida',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tmovimiento',
        width: 100,
        headerName: 'Movimiento',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tposicion',
        width: 100,
        headerName: 'Posición',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecodzona',
        width: 100,
        headerName: 'Zona',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'ecodusuario',
        width: 100,
        headerName: 'Usuario',
        filter: 'agTextColumnFilter'
      },
      {
        field: 'tnombre',
        width: 100,
        headerName: 'Linea',
        filter: 'agTextColumnFilter'
      },
    ];

    this.defaultColDef = {
      flex: 1,
      minWidth: 200,
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    };

    this.paginationPageSize = 0



  }


  ngOnInit(): void {
    this.rowData = []

  }




  onGridReady(params: any) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

  }



  ///////// Busqueda /////////
  get fbusqueda() { return this.FormBusqueda.controls; }

  e_buscar(dato: any) {

    //Validamos el Forms
    this.submitBusqueda = true;

    // Stop en caso de detectar error
    if (this.FormBusqueda.invalid) {
      //console.log('error.');
      return;
    }

    let IparametrosInventario: IparametrosInventario;

    IparametrosInventario = {
      tTipo: dato.ttipobusqueda,
      fhFechaInicio: dato.fhfechainicio,
      fhFechaFin: dato.fhfechafin
    }




    this.apiBienes.postConsultaEntradasBienes(IparametrosInventario).subscribe(
      (response) => {
        this.e_ProcesarDatos(response)
      }
    )

    //Reset
    //this.FormBusqueda.reset();
    this.submitBusqueda = false;

  }


  e_ProcesarDatos(datos: any) {
    this.arrBienes = datos;
    // console.log(this.arrBienes);

    this.rowData = datos

  }

  e_tipoBusqueda(datos: any) {
    console.log('tipo busqueda');
    console.log(datos)
 

    if (datos.ttipobusqueda == 'EXISTENCIAS') {

      // Hide fechas
      this.divFechas =  false
      // Form manual
      this.FormBusqueda = new UntypedFormGroup({
        ttipobusqueda: new UntypedFormControl(datos.ttipobusqueda, Validators.required),
        fhfechainicio: new UntypedFormControl(formatDate(new Date(), 'dd/MM/yyyy', 'en'), Validators.required),
        fhfechafin: new UntypedFormControl(formatDate(new Date(), 'dd/MM/yyyy', 'en'), Validators.required),
      })
    }else{
     // Hide fechas
     this.divFechas =  true

     this.FormBusqueda = new UntypedFormGroup({
      ttipobusqueda: new UntypedFormControl(datos.ttipobusqueda, Validators.required),
      fhfechainicio: new UntypedFormControl('', Validators.required),
      fhfechafin: new UntypedFormControl('', Validators.required),
    })

    
    }

  }




}
