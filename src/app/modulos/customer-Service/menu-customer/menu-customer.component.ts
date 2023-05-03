import { Component, OnInit, HostListener } from '@angular/core';
import { ApiServiceMenu } from 'src/app/serviciosRest/Intranet/menu/api.service.menu'
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';

import { serviceCatalogos } from 'src/app/service/service.catalogos'

@Component({
  selector: 'app-menu-customer',
  templateUrl: './menu-customer.component.html',
  styleUrls: ['./menu-customer.component.css']
})
export class MenuCustomerComponent implements OnInit {

  constructor(private router: Router,
    private apiMenu: ApiServiceMenu,
    private apiCatalogo: classApiCatalogo,
    private serviceCatalogos: serviceCatalogos
  ) { }

  //
  eauxmenu: number = 0

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any
  datosEmbalaje: any
  datosNaviera: any
  datosEstaciones: any

  //Path base
  pathInicio: string = GlobalConstants.pathInicio;

  myTemplate: string = '';
  html: string = '';

  datosInicial: any = {};
  datosChild: any = {};
  pullChild: Array<any> = [];
  datosFinales: Array<any> = [];

  ngOnInit(): void {


    //Catalogo de agentes aduanales
    this.apiCatalogo.GetAgentesAduanales().subscribe(data => {
      //////console.log(data)
      //this.datosMetodoPago = data;
      this.serviceCatalogos.catalogoAgentesAduanales = data
    })

    //Catalogo de agentes aduanales
    this.apiCatalogo.GetAduanas().subscribe(data => {
      //////console.log(data)
      //this.datosMetodoPago = data;
      this.serviceCatalogos.catalogoAduanas = data
    })


    //Catalogo de metodo de pago
    this.apiCatalogo.GetMetodoPago().subscribe(data => {
      //////console.log(data)
      this.datosMetodoPago = data;
      this.serviceCatalogos.catalogoMetodoPago = this.datosMetodoPago
    })

    //Catalogo de Bancos
    this.apiCatalogo.GetBancos().subscribe(data => {
      this.datosBancos = data;
      this.serviceCatalogos.catalogoBancos = this.datosBancos

    })

    //Catalogo de metodo de pago
    this.apiCatalogo.GetCfdi().subscribe(data => {
      this.datosCfdi = data;
      this.serviceCatalogos.catalogoCfdi = this.datosCfdi
    })

    //Catalogo de Embalajes
    this.apiCatalogo.GetEmbalajes().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosEmbalaje = data
        this.serviceCatalogos.catalogoEmbalajes = this.datosEmbalaje
      });
    })

    //Catalogo de Navieras
    this.apiCatalogo.GetNavieras().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosNaviera = data
        this.serviceCatalogos.catalogoNavieras = this.datosNaviera
      });
    })

    //Catalogo de Navieras
    this.apiCatalogo.GetEstaciones().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosEstaciones = data
        this.serviceCatalogos.catalogoEstacionesList = this.datosEstaciones
      });
    })


    //Consulta post menu
    /*this.apiMenu.postConsultaMenuSistema('CUSTOMER').subscribe(
      (response) => {
        let respuesta = this.convertir_arbol(response);
        this.e_crearMenu(respuesta);
      }
    )*/

    //console.log(this.serviceCatalogos.arrCustomer)
    let respuesta = this.convertir_arbol(this.serviceCatalogos.arrCustomer);
    ////console.log(respuesta)
    this.e_crearMenu(respuesta);

    // ////console.log(this.serviceCatalogos.catalogoMetodoPago)
  }

  //Convertir en arbol
  convertir_arbol(listado: any) {

    let map: any = {};
    let node: any = {};
    let roots: any = [];
    let i: any;

    for (i = 0; i < listado.length; i += 1) {
      map[listado[i].ecodmenu] = i;
      listado[i].children = []; // Iniciar el childre
    }

    for (i = 0; i < listado.length; i += 1) {
      node = listado[i];
      if (node.ecodmenupadre !== "1") {
        // if you have dangling branches check that map[node.ecodmenupadre] exists
        listado[map[node.ecodmenupadre]].children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;

  }

  //Crear el Menu
  e_crearMenu(datos: any) {

    this.datosFinales = [];

    let auxecodmenu: any;
    const recur = (arr: any) => {
      arr.forEach((item: any) => {
        if (item.tipo == 'SUBSISTEMA') {
          auxecodmenu = item.ecodmenu;
        }
        if (item.tipo != 'SUBSISTEMA') {
          if (auxecodmenu != item.ecodmenupadre) {
            //////console.log('---------------------------------------------------------------');
            this.html += 'tipo1:' + item.tipo + ' descripcion:' + item.tdescripcion + '|';
            //this.datosInicial = {};

            this.datosInicial['tipo'] = item.tipo;
            this.datosInicial['descripcion'] = item.tdescripcion;

            //////console.log(this.html);
          } else {
            this.html += 'tipo2:' + item.tipo + ' descripcion:' + item.tdescripcion + '|';

            this.datosChild = {};

            this.datosChild['tipo'] = item.tipo;
            this.datosChild['descripcion'] = item.tdescripcion;
            this.datosChild['url'] = item.url;

            if (this.eauxmenu != auxecodmenu) {
              this.datosChild['divide'] = 'no';
              this.eauxmenu = auxecodmenu;
              // console.log('Nuevo valor:'+this.eauxmenu )
            } else {
              this.datosChild['divide'] = 'si';
            }

            // console.log('x:'+auxecodmenu)

            this.datosChild['menu'] = item.ecodmenupadre;




            this.pullChild.push(this.datosChild);

            //console.log('fin:' + auxecodmenu)



            /*this.datosInicial['tipo'] = item.tipo;
            this.datosInicial['descripcion'] = item.tdescripcion;
            this.pullInicial.push(this.datosInicial);*/

            //////console.log(this.html);
          }

          //this.pullInicial.push(this.datosInicial);
        }

        if (item.children) {
          recur(item.children);
        }

        if (item.tipo != 'SUBSISTEMA') {
          if (auxecodmenu != item.ecodmenupadre) {
            //this.datosFinales  = [];
            //////console.log(this.html+'/');
            //this.datoFinal += this.html+'/';
            if (this.pullChild.length != 0) {
              this.datosInicial['child'] = this.pullChild;
              this.datosFinales.push(this.datosInicial);
            }
            //////console.log(this.datosInicial);
            this.pullChild = []
            this.datosInicial = {};

            this.html = '';
            //this.e_crearDivDinamico('dato');
            //////console.log('---------------------------fin------------------------------------');
          }
        }

      });
    };

    recur(datos);

    //console.log(JSON.stringify(this.datosFinales))

    this.e_crearDivDinamico(this.datosFinales);

    // this.divHtml =  this.myTemplate;

  }

  //Crear el Div  
  e_crearDivDinamico(datos: any) {

    datos.forEach((dato1: any, index: any) => {



      this.myTemplate += '<div class="col-sm-12 col-md-4 mg-t-5 mg-sm-t-5" id="divUbicacaciones">'
      this.myTemplate += '<div class="pd-y-10 pd-x-10 ">'
      this.myTemplate += '<div class="card card-hover card-customer-score">'
      this.myTemplate += '<div class="card-header bg-transparent">'

      this.myTemplate += '<h6 class="card-title mg-b-0">' + dato1.descripcion + '</h6>'

      this.myTemplate += '<nav class="nav nav-card-icon"  >'
      this.myTemplate += '<a   id="more" ><svg   id="more" value="' + dato1.descripcion + '" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"> <circle cx="12" cy="12" r="1" id="more"  ></circle> <circle cx="12" cy="5" r="1" id="more" ></circle> <circle cx="12" cy="19" r="1" id="more" ></circle> </svg></a>';
      this.myTemplate += '</nav>'
      this.myTemplate += '</div>'


      this.myTemplate += '<div  class="card-body pd-t-10" id="' + dato1.descripcion + '" style="padding: 1rem 1rem !important;">'
      this.myTemplate += ' <ul class="nav nav-sidebar"> '
      dato1.child.forEach((dato2: any, index: any) => {


        this.myTemplate += ' <li class="nav-item"> '
        this.myTemplate += ' <a   routerLink="' + dato2.url + '" class="nav-link with-sub">' + dato2.descripcion + '</a> '
        this.myTemplate += ' </li>'

        if (dato2.divide == 'si') {
          this.myTemplate += ' <li class="nav-item"><hr></li>'

        }
      });
      this.myTemplate += ' </ul> '
      this.myTemplate += '</div>'


      this.myTemplate += '</div>'
      this.myTemplate += '</div>'
      this.myTemplate += '</div>'

      document.getElementById('divHtml')!.innerHTML = this.myTemplate;

    });


  }

  ngAfterContentChecked() {
    ////console.log('Entro!  ngAfterContentInit')
    ////console.log(this.myTemplate)
    document.getElementById('divHtml')!.innerHTML = this.myTemplate;
  }

  //Listener
  @HostListener('click', ['$event.target']) clickShowHide(dato: any) {
    //////console.log(dato);

    if (dato.nodeName == 'svg') {
      if (dato.id == 'more') {
        this.e_ShowOrHide(dato.attributes[1].value)
      }
    } else {
      if (dato.nodeName == 'circle') {
        if (dato.id == 'more') {
          //this.e_ShowOrHide(dato.attributes[1].value )
          //////console.log('circle');
          //////console.log(dato.farthestViewportElement.attributes[1].value)
          this.e_ShowOrHide(dato.farthestViewportElement.attributes[1].value)
        }
      }
    }

    if (dato.nodeName === 'A') {
      let url = dato.getAttribute('routerlink');
      this.router.navigate([url]);
    }

  }

  //Show or Hide Div dinamico
  e_ShowOrHide(dato: any) {
    let melement = document.getElementById(dato);
    if (melement!.style.display == 'none') {
      melement!.style.display = 'block';
    } else {
      melement!.style.display = 'none';
    }
  }

}
