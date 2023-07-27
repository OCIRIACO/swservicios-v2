import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConstants } from 'src/app/modelos/global';
import { AgGridModule } from 'ag-grid-angular';
import { RenderAcciones } from './render-acciones';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-consultamanifiesto',
  templateUrl: './consultamanifiesto.component.html',
  styleUrls: ['./consultamanifiesto.component.css']
})
export class ConsultamanifiestoComponent implements OnInit {

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
    console.log('DataSource', this.dataSource)

  }

  e_consultarSolicitudes() {
    //POST
    this.apiManifiesto.postConsultManifPeriodo().subscribe(
      (response) => {
        //console.log(response);
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
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/entradas/detalle', etransaccion]);  // nativo
  }

  //Editar
  e_editar(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/entradas/editar', etransaccion]);  // nativo
  }

}
