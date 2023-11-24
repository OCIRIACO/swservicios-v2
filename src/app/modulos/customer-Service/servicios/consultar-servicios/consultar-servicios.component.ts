import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { RenderAcciones } from './render-acciones';

import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';


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
  selector: 'app-consultar-servicios',
  templateUrl: './consultar-servicios.component.html',
  styleUrls: ['./consultar-servicios.component.css']
})
export class ConsultarServiciosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['acciones', 'folioweb', 'tipoSolicitud', 'correoprogramo', 'fecharegistro', 'programo', 'totalcargas', 'tipocarga', 'testatus'];
  dataSource = new MatTableDataSource<Post>([]);

  //Path base
  directorio: string = GlobalConstants.pathCustomer;


  constructor(
    private router: Router,
    private apiServicios: apiServiceSolicitudServicios,
  ) {


  }

  ngOnInit(): void {

    //Parametros
    let parametros = {}

    parametros = {
      tunidadnegocio: "ALMACEN",
      toperacion: "MOVIMIENTO"
    }

    //POST
    this.apiServicios.postConsultarSolicitudesServicios(parametros).subscribe(
      (response) => {
        this.dataSource.data = response as Post[];
        this.dataSource.paginator = this.paginator;
      }
    )

  }


  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/servicios/nuevo']);
  }

  //Detalle
  e_detalles(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/servicios/detalle', etransaccion]);  // nativo
  }

  //Editar
  e_editar(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/servicios/editar', etransaccion]);  // nativo
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
