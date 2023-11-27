import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';

@Component({
  selector: 'app-detalle-cliente-directo',
  templateUrl: './detalle-cliente-directo.component.html',
  styleUrls: ['./detalle-cliente-directo.component.css']
})
export class DetalleClienteDirectoComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

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
    

    this.lbltrazonsocial = datos.data[0].trazonsocial
    this.lbltrfc = datos.data[0].trfc
    this.lblfhfecharegistro = datos.data[0].fhfecharegistro
    this.lblecodcliente = datos.data[0].ecodcliente

    //arreglo
    this.arrdatosDireccion = datos.data[0].direcciones
  }

  e_consulta() {
    this.router.navigate(['dashboard/intranet/cliente/directo/consultar']);
  }

}
