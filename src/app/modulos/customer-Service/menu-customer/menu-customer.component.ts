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

  totalModulos: number = 0;

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


  e_chunkArrayInGroups(arr: any, size: any) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }
    return myArray;
  }

  //Crear el Menu
  e_crearMenu(datos: any) {

    //console.log('Datos');
    this.totalModulos = datos[0].children.length;

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
            this.datosInicial['icono'] = item.ticono;

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


    let grupos = this.e_chunkArrayInGroups(datos, 3);
    console.log(grupos);

    grupos.forEach((dato: any, index: any) => {

      this.myTemplate += '<div class="mt-5"></div>';


      this.myTemplate += '<div class="row">';

      dato.forEach((items: any, index: any) => {

        this.myTemplate += ' <div class=" col-md-4"> ';
        this.myTemplate += ' <div class="row" style="font-size:13px"> ';
        this.myTemplate += ' <p>' + items.descripcion + '</p> ';
        this.myTemplate += ' </div> ';

        this.myTemplate += ' <div class="row"> ';
        this.myTemplate += ' <div class="col-xs-4 col-sm-3 col-md-4 div-dif"><i class="fas ' + items.icono + ' fa-4x"></i> ';
        //this.myTemplate += ' <div class="reflection"> <i class="fas ' + items.icono + ' fa-6x"></i> ';
        //this.myTemplate += ' <div class="reflection-over"></div> ';
        //this.myTemplate += ' </div> ';


        this.myTemplate += ' </div> ';
        this.myTemplate += ' <div class="col-xs-6 col-sm-4 col-md-7 col-md-offset-1"> ';
        this.myTemplate += ' <ul class="list-unstyled"> ';

        items.child.forEach((opcion: any, index: any) => {
          this.myTemplate += ' <li style="font-size:12px;" > '
          this.myTemplate += ' <a  href="javascript:void(0)"  routerLink="' + opcion.url + '" class="">' + opcion.descripcion + '</a> '
          this.myTemplate += ' </li>'
          this.myTemplate += ' <li class="divider"></li>'

        });


        //this.myTemplate += ' <li> ';
        //this.myTemplate += ' <h5><a href="/apl/emp/oper-empr/oper-usua-reg/alta-de-usuarios/">Alta de Usuarios</a></h5> ';
        //this.myTemplate += ' </li> ';
        //this.myTemplate += ' <li class="divider"></li> ';
        //this.myTemplate += ' <li> ';
        //this.myTemplate += ' <h5><a href="/apl/emp/oper-empr/oper-clfa-reg/registro-de-entidades/">Registro de Entidades</a></h5> ';
        //this.myTemplate += ' </li> ';
        //this.myTemplate += ' <li class="divider"></li> ';
        //this.myTemplate += ' <li> ';
        //this.myTemplate += ' <h5><a href="/apl/emp/oper-empr/oper-sufa-reg/registro-de-domicilios/">Registro de Domicilios</a> ';
        //this.myTemplate += ' </h5> ';
        //this.myTemplate += ' </li> ';

        this.myTemplate += ' </ul> ';
        this.myTemplate += ' </div> ';
        this.myTemplate += ' </div> ';
        this.myTemplate += ' </div> ';
      });

      this.myTemplate += '</div>';
    });




    /*
    datos.forEach((dato1: any, index: any) => {

      this.myTemplate += '<div class="col-md-4 row-dif">'
      this.myTemplate += '<div class="row">';
      this.myTemplate += '<div class="col-xs-4 col-sm-3 col-md-4 div-dif">';

      this.myTemplate += '<i class="fas ' + dato1.icono + ' fa-6x"></i>';
      this.myTemplate += '</div>'
      this.myTemplate += '<div class=" col-xs-6 col-sm-4 col-md-7 col-md-offset-1">';


      this.myTemplate += ' <ul class="list-unstyled"> '

      dato1.child.forEach((dato2: any, index: any) => {
        this.myTemplate += ' <li style="font-size:12px;" > '
        this.myTemplate += ' <a  href="javascript:void(0)"  routerLink="' + dato2.url + '" class="">' + dato2.descripcion + '</a> '
        this.myTemplate += ' </li>'
        this.myTemplate += ' <li class="divider"></li>'

      });

      this.myTemplate += ' </ul> '


      this.myTemplate += '</div>'
      this.myTemplate += '</div>'
      this.myTemplate += '</div>'

    });
    */

  }


  ngAfterContentChecked() {
    ////console.log('Entro!  ngAfterContentInit')
    ////console.log(this.myTemplate)
    let html = "";

    html += '<div class="row">';
    html += this.myTemplate;
    html += '</div>';

    document.getElementById('divHtml')!.innerHTML = html;
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
