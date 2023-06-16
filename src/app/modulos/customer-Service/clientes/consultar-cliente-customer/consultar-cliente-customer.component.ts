import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { RenderAcciones } from './render-acciones';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Post {
  ecliente: number,
  ecodclientepadre: number,
  trazonsocial: string,
  trfc: string,
  ttipocliente: string,
  testado: string,
  fhfecharegistro: number,
  direcciones: any
}

@Component({
  selector: 'app-consultar-cliente-customer',
  templateUrl: './consultar-cliente-customer.component.html',
  styleUrls: ['./consultar-cliente-customer.component.css']
})
export class ConsultarClienteCustomerComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['acciones', 'ecliente', 'trazonsocial', 'trfc', 'testado', 'fhfecharegistro'];
  dataSource = new MatTableDataSource<Post>([]);

  constructor(private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,
    private router: Router
  ) {


  }

  ngOnInit(): void {


    //Parametros
    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    //respuesta
    let clientes: any;

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        
        //console.log(this.dataSource.data);
        //clientes =  response;
        this.e_procesarRespuesta(response.data);
      }
    )
  }

  //Procesar respuesta
  e_procesarRespuesta(clientes:any){

    console.log(clientes);

    let clientesList : any = []

    clientes.forEach((dato: any, index: any) => {

      let datoCliente ={
        ecliente          :  dato.ecliente,
        trazonsocial      :  dato.trazonsocial,
        trfc              :  dato.trfc,
        testado           :  dato.testado,
        fhfecharegistro   :  dato.fhfecharegistro,    
      };

       clientesList.push(datoCliente);      
    })

    this.dataSource.data = clientesList;
    console.log(this.dataSource.data );
    this.dataSource.paginator = this.paginator;

  }

  //Redireccionar nuevo cliente
  e_nuevo() {
    this.router.navigate(['dashboard/customer/clientes/nuevo']);
  }

  //Detalle
  e_detalles(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/clientes/detalle', etransaccion ]);  // nativo
  }

  //Editar
  e_editar(etransaccion: number) {
    //console.log(etransaccion)
    this.router.navigate(['dashboard/customer/clientes/editar', etransaccion ]);  // nativo
  }


}
