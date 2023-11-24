import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceSolicituSalida } from 'src/app/serviciosRest/Customer/solicitudSalidas/api.service.salidas'
import { RenderAcciones } from './render-acciones';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';


export interface Post {
  folioweb: string,
  tipoSolicitud: string,
  correoprogramo: string,
  fecharegistro: string,
  programo: string,
  totalcargas: string,
  tipocarga: string,
  testatus: string,
}


@Component({
  selector: 'app-solicitudes-salidas',
  templateUrl: './solicitudes-salidas.component.html',
  styleUrls: ['./solicitudes-salidas.component.css']
})

export class SolicitudesSalidasComponent implements OnInit {

  testatus: string = ''

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['acciones', 'folioweb', 'tipoSolicitud', 'correoprogramo', 'fecharegistro', 'programo', 'totalcargas', 'tipocarga', 'testatus'];
  dataSource = new MatTableDataSource<Post>([]);

  constructor(private ApiServiceSolicituSalida: ApiServiceSolicituSalida, private router: Router) {
    this.testatus = ''
  }

  //Path base
  directorio: string = GlobalConstants.pathCustomer;



  ngOnInit(): void {
    this.e_consultarSolicitudSalidas();
    console.log('DataSource', this.dataSource)
    //Pagina
    this.dataSource.paginator = this.paginator;
  }

  //Post consultar solicitudes de salidas
  e_consultarSolicitudSalidas() {
    //POST
    this.ApiServiceSolicituSalida.postConsultarSolicitudesSalidas().subscribe(
      (response) => {
        this.dataSource.data = response as Post[];
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/salidas/nuevo']);
  }

  //Detalle
  e_detalles(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/salidas/detalles', etransaccion]);
  }

  //Editar
  e_editar(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/salidas/editar', etransaccion]);
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}


export interface PeriodicElement {
  folioweb: string
}