import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { RenderAcciones } from './render-acciones';
import { apiSolicitudServicios } from 'src/app/serviciosRest/Intranet/servicios/api.service.servicios';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
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
  selector: 'app-consultar-solicitud-servicios',
  templateUrl: './consultar-solicitud-servicios.component.html',
  styleUrls: ['./consultar-solicitud-servicios.component.css']
})
export class ConsultarSolicitudServiciosComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  columnasServicios: string[] = ['acciones', 'etransaccion', 'tcorreo', 'ttelefono', 'treferencia', 'fhfecharegistro', 'fhfechaservicio'];
  solicitudesServicos = new MatTableDataSource<IdataServicios>([]);

  //Path base
  directorio: string = GlobalConstants.pathIntranet;


  constructor(
    private apiSolicitudServicios: apiSolicitudServicios,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    //Radio checked y click
    // let checkbox = document.getElementById('rdpendiente') as HTMLInputElement
    //checkbox.checked = true
    //checkbox.click()
  }

  e_opcion(event: MatRadioChange) {
    //console.log(event.value);
    // console.log(datos.target.attributes.value.value);

    let parametros = {
      ttiposolicitud: 'SERVICIO',
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
    this.router.navigate(['/dashboard/intranet/servicios/detalles', etransaccion]);  // nativo
  }

  //Redireccionar Inicio
  e_inicio() {
    this.router.navigate(['/dashboard/intranet/menu']);
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }


}
