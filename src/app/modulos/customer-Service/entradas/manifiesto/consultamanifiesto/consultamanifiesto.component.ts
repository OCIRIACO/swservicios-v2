import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConstants } from 'src/app/modelos/global';
import { AgGridModule } from 'ag-grid-angular';
import { RenderAcciones } from './render-acciones';
import { Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Post {
  folioweb: number,
  tipoSolicitud: string,
  correoprogramo: string,
  fecharegistro: string,
  programo: string,
  totalcargas: number,
  tipocarga: string,
  testatus: string
}


@Component({
  selector: 'app-consultamanifiesto',
  templateUrl: './consultamanifiesto.component.html',
  styleUrls: ['./consultamanifiesto.component.css']
})
export class ConsultamanifiestoComponent implements OnInit {

  //@ViewChild(MatSort, { static: true }) sort!: MatSort;
  //@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['acciones', 'folioweb', 'tipoSolicitud', 'correoprogramo', 'fecharegistro', 'programo', 'totalcargas', 'tipocarga', 'testatus'];
  dataSource = new MatTableDataSource<Post>([]);

  constructor(
    private apiManifiesto: ApiServiceManifiesto,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {

  }

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  ngOnInit(): void {
    this.e_consultarSolicitudes();
    

    this.dataSource.paginator = this.paginator;


  }

  e_consultarSolicitudes() {
    //POST
    this.apiManifiesto.postConsultManifPeriodo().subscribe(
      (response) => {
        
        this.dataSource.data = response as Post[];
        this.dataSource.paginator = this.paginator;
      }
    )
  }



  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/entradas/nuevo']);
  }
  //Detalle
  e_detalles(etransaccion: number) {
    
    this.router.navigate(['dashboard/customer/entradas/detalle', etransaccion]);  // nativo
  }
  //Editar
  e_editar(etransaccion: number) {
    
    this.router.navigate(['dashboard/customer/entradas/editar', etransaccion]);  // nativo
  }
  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
