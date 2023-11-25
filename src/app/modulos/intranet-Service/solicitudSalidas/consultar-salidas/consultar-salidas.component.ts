import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiSolicitudServicios } from 'src/app/serviciosRest/Intranet/servicios/api.service.servicios';
import { RenderAcciones } from './render-acciones';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


export interface IdataServicios {
  etransaccion: number,
  tcorreo: string,
  ttelefono: string,
  treferencia: string,
  fhfecharegistro: string,
  fhfechaservicio: string
}

@Component({
  selector: 'app-consultar-salidas',
  templateUrl: './consultar-salidas.component.html',
  styleUrls: ['./consultar-salidas.component.css']
})
export class ConsultarSalidasComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  columnasServicios: string[] = ['acciones', 'etransaccion', 'tcorreo', 'ttelefono', 'treferencia', 'fhfecharegistro', 'fhfechaservicio'];
  solicitudesServicos = new MatTableDataSource<IdataServicios>([]);


  //Path base
  directorio: string = GlobalConstants.pathIntranet;


  constructor(
    private apiSolicitudServicios: apiSolicitudServicios,
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  e_opcion(event: MatRadioChange) {
    //console.log(datos.target.id);
    // console.log(datos.target.attributes.value.value);

    let parametros = {
      ttiposolicitud: 'SALIDA',
      testatus: event.value
    }

    this.apiSolicitudServicios.postConsultarSolicitudesServicios(parametros).subscribe(
      (response) => {
        this.solicitudesServicos.data = response as IdataServicios[];
        this.solicitudesServicos.paginator = this.paginator;

      }
    )
  }

  //Consultar detalle de la solicitud
  e_detalle(etransaccion: number) {
    this.router.navigate(['dashboard/intranet/salidas/solicitud', etransaccion]);  // nativo
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/intranet/menu']);
  }

}
