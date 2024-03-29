import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiServiceMenu } from 'src/app/serviciosRest/Intranet/menu/api.service.menu'
import { classApiLogin } from '../../serviciosRest/api/api.service.login'
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { GlobalConstants } from 'src/app/modelos/global';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';


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
  opCustumer: Array<any> = [];
  opIntranet: Array<any> = [];

  OpcionCustomer: boolean = false;
  OpcionIntranet: boolean = false;

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;


  constructor(
    private dataService: classApiLogin,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiMenu: ApiServiceMenu,
    private serviceCatalogos: serviceCatalogos,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit(): void {
    
    this.dataService.e_validaLocalStorage();
    
    

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
        this.opIntranet = this.serviceCatalogos.arrIntranet

        if (this.opIntranet.length != 0) {
          this.OpcionIntranet = true;
        }


      })

    this.apiMenu.postConsultaMenuSistema('CUSTOMER').subscribe(
      (response) => {
        this.serviceCatalogos.arrCustomer = response
        this.opCustumer = this.serviceCatalogos.arrCustomer

        if (this.opCustumer.length != 0) {
          this.OpcionCustomer = true;
        }

      })







  }





  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
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
