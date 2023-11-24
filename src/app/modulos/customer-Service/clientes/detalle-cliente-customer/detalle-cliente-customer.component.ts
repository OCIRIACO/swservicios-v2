import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente'


@Component({
  selector: 'app-detalle-cliente-customer',
  templateUrl: './detalle-cliente-customer.component.html',
  styleUrls: ['./detalle-cliente-customer.component.css']
})
export class DetalleClienteCustomerComponent implements OnInit {


  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Catalogos arreglo
  arrdatosDireccion: Array<any> = [];

  //Variable Get
  id: string = "";

  //Label's
  lbltrazonsocial: string = ""
  lbltrfc: string = ""
  lblfhfecharegistro: string = ""
  lblecodcliente: string = ""


  constructor(
    private apiCliente: apiCliente,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    //POST CONSULAR DETALLE
    this.id = this.route.snapshot.params['id'];

    this.apiCliente.postConsultarDetalleCliente(this.id).subscribe(
      (response) => {
        this.e_procesar_datos(response)
      }
    )
  }

  //Procesar consultar detalle del cliente
  e_procesar_datos(datos: any) {
    //console.log( datos.data[0].direcciones)

    this.lbltrazonsocial = datos.data[0].trazonsocial
    this.lbltrfc = datos.data[0].trfc
    this.lblfhfecharegistro = datos.data[0].fhfecharegistro
    this.lblecodcliente = datos.data[0].ecliente

    //arreglo
    this.arrdatosDireccion = datos.data[0].direcciones
  }

  //Redireccionar al reporte de consultar cliente
  e_consulta() {
    this.router.navigate(['dashboard/customer/clientes/consultar']);
  }

  //Redireccionar para crear un nuevo cliente
  e_nuevo() {
    this.router.navigate(['dashboard/customer/clientes/nuevo']);
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
