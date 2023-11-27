import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceBienes } from 'src/app/serviciosRest/Intranet/historial/api.service.bienes'
import { IparametrosInventario } from 'src/app/modelos/historial/historial.interfase'
import { Subject } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

export interface IdataInventario {
  eguia: number,
  ttipocarga: string,
  ttramite: string,
  ttipocontenedor: string,
  tmarcas: string,
  epesomanifestado: number,
  epesorecibido: number,
  epesoliberado: number,
  epesoentregado: number,
  ecantidadmanifestado: number,
  ecantidadrecibido: number,
  ecantidadliberado: number,
  ecantidadentregado: number,
  fhfechaentrada: string,
  fhfechasalida: string,
  tmovimiento: string,
  tposicion: string,
  ecodzona: number,
  ecodusuario: number,
  tnombre: string
}

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  columnasInventario: string[] = ['eguia', 'ttipocarga', 'ttramite', 'ttipocontenedor', 'tmarcas'];
  datosInvestario = new MatTableDataSource<IdataInventario>([]);

  //Form Busqueda
  FormBusqueda = new FormGroup({
    ttipobusqueda: new FormControl('', Validators.required),
    fhfechainicio: new FormControl('', Validators.required),
    fhfechafin: new FormControl('', Validators.required),
  })

  // Submit's 
  //submitBusqueda = false

  //Listado Bienes
  arrBienes: Array<any> = [];


  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  /*
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  rowData: any;
  defaultColDef: any;
  pagination: any;
  paginationPageSize: any;
  gridOptions: any
  */


  //Div's show and hide
  divFechas: boolean = true

  constructor(
    private apiBienes: ApiServiceBienes,
    private http: HttpClient,
    private router: Router
  ) {

    /*
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

  this.paginationPageSize = 0++*/



  }


  ngOnInit(): void {
  }



  ///////// Busqueda /////////
  e_buscar(dato: NgForm) {

    // stop y valido
    if (dato.invalid) {
      
      return;
    }


    let IparametrosInventario: IparametrosInventario;

    IparametrosInventario = {
      tTipo: dato.value.ttipobusqueda,
      fhFechaInicio: dato.value.fhfechainicio,
      fhFechaFin: dato.value.fhfechafin
    }


    this.apiBienes.postConsultaEntradasBienes(IparametrosInventario).subscribe(
      (response) => {

        this.arrBienes = response;
        this.datosInvestario.data = response as IdataInventario[];
        this.datosInvestario.paginator = this.paginator;
      }
    )

    //Reset
    this.FormBusqueda.reset();

  }


  /*
  e_ProcesarDatos(datos: any) {
    this.arrBienes = datos;
  }
  */

  e_tipoBusqueda(datos: any) {
    
    


    if (datos.value == 'EXISTENCIAS') {

      // Hide fechas
      this.divFechas = false
      // Form manual
      this.FormBusqueda = new FormGroup({
        ttipobusqueda: new FormControl(datos.value, Validators.required),
        fhfechainicio: new FormControl(formatDate(new Date(), 'dd/MM/yyyy', 'en'), Validators.required),
        fhfechafin: new FormControl(formatDate(new Date(), 'dd/MM/yyyy', 'en'), Validators.required),
      })
    } else {
      // Hide fechas
      this.divFechas = true

      this.FormBusqueda = new FormGroup({
        ttipobusqueda: new FormControl(datos.value, Validators.required),
        fhfechainicio: new FormControl('', Validators.required),
        fhfechafin: new FormControl('', Validators.required),
      })

    }

  }



  //Regresar menu Inicio
  e_inicio() {
    this.router.navigate(['dashboard/intranet/menu']);
  }


}
