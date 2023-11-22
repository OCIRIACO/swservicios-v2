import { Component, OnInit, ViewChild } from '@angular/core';
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { RenderAcciones } from './render-acciones';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

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
  selector: 'app-consultar-autotransporte',
  templateUrl: './consultar-autotransporte.component.html',
  styleUrls: ['./consultar-autotransporte.component.css']
})
export class ConsultarAutotransporteComponent implements OnInit {


  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['acciones', 'folioweb', 'tipoSolicitud', 'correoprogramo', 'fecharegistro', 'programo', 'totalcargas', 'tipocarga', 'testatus'];
  dataSource = new MatTableDataSource<Post>([]);

  constructor(
    private router: Router,
    private apiServicios: apiServiceSolicitudServicios,
  ) {


  }

  ngOnInit(): void {


    //Parametros
    let parametros = {}

    parametros = {
      tunidadnegocio: "LOGISTICO",
      toperacion: "TRANSPORTE"
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
    this.router.navigate(['dashboard/customer/transporte/nuevo']);
  }

  //Detalle
  e_detalles(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/transporte/detalle', etransaccion]);  // nativo
  }

  //Editar
  e_editar(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/transporte/editar', etransaccion]);  // nativo
  }
}
