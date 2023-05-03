import { Component, OnInit } from '@angular/core';
import { ApiServiceMenu } from 'src/app/serviciosRest/Intranet/menu/api.service.menu'
import { classApiLogin } from '../../serviciosRest/api/api.service.login'
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { GlobalConstants } from 'src/app/modelos/global';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',


  ]
})

export class DashboardComponent implements OnInit {


  //Lanbel's
  lblUsuario: string = ''
  lbltperfil: string = ''

  //show or hide opciones
  opCustumer: Array<any> = []
  opIntranet: Array<any> = []

  constructor(
    private dataService: classApiLogin,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiMenu: ApiServiceMenu,
    private serviceCatalogos: serviceCatalogos,
    private router: Router
  ) { }

  ngOnInit(): void {
    //console.log( localStorage.getItem("token") );
    this.dataService.e_validaLocalStorage();
    // console.log('Datos usuario');
    // console.log(this.serviceDatosUsuario.datosUsuario);

    // Datos de usurios
    let usuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);



    //Set valor nombre de usuario (visual)
    this.lblUsuario = usuario.tusuario
    this.lbltperfil = usuario.tperfil

    //12/08/2022 11:24:00
    //Consultar nueva forma los menu
    let datos = [
      {
        ttipo: "INTRANET"
      },
      {
        ttipo: "CUSTOMER"
      }
    ]


    this.apiMenu.postConsultaMenuSistema('INTRANET').subscribe(
      (response) => {
        this.serviceCatalogos.arrIntranet = response
        this.opIntranet =  this.serviceCatalogos.arrIntranet
      })

    this.apiMenu.postConsultaMenuSistema('CUSTOMER').subscribe(
      (response) => {
        this.serviceCatalogos.arrCustomer = response
        this.opCustumer =  this.serviceCatalogos.arrCustomer
     })



  }






  e_cerrarSesion() {
    this.dataService.cerrarSesion();
  }


  e_operaciones(dato: any) {
    if (dato == 'customer') {
      this.router.navigate(['dashboard/customer/menu']);
      window.location.href = "#/dashboard/customer/menu";

    } else if (dato == 'intranet') {
      this.router.navigate(['dashboard/intranet/menu']);
    // window.location.href = "#/dashboard/intranet/menu";

    }


  }

}
