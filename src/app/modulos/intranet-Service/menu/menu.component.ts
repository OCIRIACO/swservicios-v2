import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'jstree';

import { ApiServiceMenu } from 'src/app/serviciosRest/Intranet/menu/api.service.menu'
import { serviceCatalogos } from 'src/app/service/service.catalogos'




@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  myTemplate: string = '';
  html: string = '';

  datosInicial: any = {};
  datosChild: any = {};
  pullChild: Array<any> = [];
  datosFinales: Array<any> = [];
  totalModulos: number = 0;

  htmlStr: string = ''



  constructor(private router: Router,
    private apiMenu: ApiServiceMenu,
    private serviceCatalogos: serviceCatalogos
  ) { }

  ngOnInit(): void {


    this.myTemplate = ''

    /*this.apiMenu.postConsultaMenuSistema('INTRANET').subscribe(
      (response) => {

        let respuesta = this.convertir_arbol(response);
        this.e_crearMenu(respuesta);
      }
    )*/

    //console.log('Intranet')
    //console.log(this.serviceCatalogos.arrIntranet)
    let respuesta = this.convertir_arbol(this.serviceCatalogos.arrIntranet);
    this.e_crearMenu(respuesta);


  }

  convertir_arbol(listado: any) {

    let map: any = {};
    let node: any = {};
    let roots: any = [];
    let i: any;

    for (i = 0; i < listado.length; i += 1) {
      map[listado[i].ecodmenu] = i;
      //console.log(listado[i].ecodmenupadre)
      listado[i].children = [];
    }

    for (i = 0; i < listado.length; i += 1) {
      node = listado[i];
      if (node.ecodmenupadre !== "1") {
        listado[map[node.ecodmenupadre]].children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;

  }

  ngAfterViewInit() {
    //this.e_crearMenu();
    // document.getElementById('divHtmlIntranet')!.innerHTML = this.myTemplate;
  }

  e_crearMenu(datos: any) {

    this.totalModulos = datos[0].children.length;


    this.datosFinales = [];

    let auxecodmenu: any;
    const recur = (arr: any) => {
      arr.forEach((item: any) => {
        if (item.tipo == 'SUBSISTEMA') {
          auxecodmenu = item.ecodmenu;
        }
        if (item.tipo != 'RAIZ' && item.tipo != 'SISTEMA') {
          if (auxecodmenu != item.ecodmenupadre) {
            //console.log('---------------------------------------------------------------');
            this.html += 'tipo1:' + item.tipo + ' descripcion:' + item.tdescripcion + '|';
            //this.datosInicial = {};

            this.datosInicial['tipo'] = item.tipo;
            this.datosInicial['descripcion'] = item.tdescripcion;

            //console.log(this.html);
          } else {
            this.html += 'tipo2:' + item.tipo + ' descripcion:' + item.tdescripcion + '|';

            this.datosChild = {};

            this.datosChild['tipo'] = item.tipo;
            this.datosChild['descripcion'] = item.tdescripcion;
            this.datosChild['url'] = item.url;

            this.pullChild.push(this.datosChild);


            /*this.datosInicial['tipo'] = item.tipo;
            this.datosInicial['descripcion'] = item.tdescripcion;
            this.pullInicial.push(this.datosInicial);*/

            //console.log(this.html);
          }

          //this.pullInicial.push(this.datosInicial);
        }

        if (item.children) {
          recur(item.children);
        }

        if (item.tipo != 'RAIZ' && item.tipo != 'SISTEMA') {
          if (auxecodmenu != item.ecodmenupadre) {
            //this.datosFinales  = [];
            //console.log(this.html+'/');
            //this.datoFinal += this.html+'/';
            this.datosInicial['child'] = this.pullChild;
            //console.log(this.datosInicial);
            this.datosFinales.push(this.datosInicial);
            this.pullChild = []
            this.datosInicial = {};

            this.html = '';
            //this.e_crearDivDinamico('dato');
            //console.log('---------------------------fin------------------------------------');
          }
        }

      });
    };

    recur(datos);

    //console.log(JSON.stringify(this.datosFinales) )

    this.e_crearDivDinamico(this.datosFinales);

    // this.divHtmlIntranet =  this.myTemplate;

  }


  //Crear el Div  
  e_crearDivDinamico(datos: any) {

    datos.forEach((dato1: any, index: any) => {



      /*this.myTemplate += '<div class="col-sm-12 col-md-4 mg-t-5 mg-sm-t-5" id="divUbicacaciones">'
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
      this.myTemplate += '</div>'*/


      let separador = (4 / this.totalModulos);

      //this.myTemplate += '<div class="row">';
      this.myTemplate += '<div class="col-sm-' + separador + ' col-md-' + separador + ' mg-t-5 mg-sm-t-5" id="divUbicacaciones">'

      this.myTemplate += ' <div class="row" > ';

      //Iconos
      this.myTemplate += ' <div class="col-xs-4 col-sm-3 col-md-4" > ';
      this.myTemplate += '<svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"> '
      this.myTemplate += ' <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/> '
      this.myTemplate += ' <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/> '
      this.myTemplate += '</svg> ';
      this.myTemplate += ' </div> ';

      //Opciones
      this.myTemplate += ' <div class="col-xs-6 col-sm-4 col-md-7 col-md-offset-1" > ';
      this.myTemplate += ' <div class="tableOfContentContainer"> ';
      this.myTemplate += ' <div class="tableOfContent docs-toc-container"> ';
      this.myTemplate += ' <div class="docs-toc-heading">' + dato1.descripcion + '</div> ';
      this.myTemplate += ' <nav> ';
      dato1.child.forEach((dato2: any, index: any) => {
        this.myTemplate += ' <a   routerLink="' + dato2.url + '"  style="  cursor: pointer;"  class="docs-level-h3 docs-link ng-star-inserted" >' + dato2.descripcion + '</a> '
        // this.myTemplate += ' <a href="'+dato2.url+'" class="docs-level-h3 docs-link ng-star-inserted">'+dato2.descripcion+'</a> ';
        this.myTemplate += ' <br> ';
      });
      this.myTemplate += ' </nav> ';
      this.myTemplate += ' </div> ';
      this.myTemplate += ' </div> ';
      this.myTemplate += ' </div> ';

      this.myTemplate += ' </div> ';

      this.myTemplate += ' </div> ';
      //this.myTemplate += ' </div> ';




    });

    //let html ="";
    //html+="<div>";
    //html+=this.myTemplate;
    //html+="</div>";


    //document.getElementById('divHtml')!.innerHTML = html;


  }

  /*e_crearDivDinamico(datos: any) {



    datos.forEach((dato1: any, index: any) => {



      this.myTemplate += '<div class="col-sm-12 col-md-3 mg-t-5 mg-sm-t-5" id="divUbicacaciones">'
      this.myTemplate += '<div class="pd-y-10 pd-x-10 ">'
      this.myTemplate += '<div class="card card-hover card-customer-score">'
      this.myTemplate += '<div class="card-header bg-transparent">'
      if (dato1.tipo == 'SUBSISTEMA') {
        this.myTemplate += '<h6 class="card-title mg-b-0">' + dato1.descripcion + '</h6>'
      }
      this.myTemplate += '<nav class="nav nav-card-icon"  >'
      this.myTemplate += '<a   id="more" ><svg   id="more" value="' + dato1.descripcion + '" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"> <circle cx="12" cy="12" r="1" id="more"  ></circle> <circle cx="12" cy="5" r="1" id="more" ></circle> <circle cx="12" cy="19" r="1" id="more" ></circle> </svg></a>';
      this.myTemplate += '</nav>'
      this.myTemplate += '</div>'


      this.myTemplate += '<div  class="card-body pd-t-10" id="' + dato1.descripcion + '" style="padding: 1rem 1rem !important;">'
      this.myTemplate += ' <ul class="nav nav-sidebar"> '
      dato1.child.forEach((dato2: any, index: any) => {
        this.myTemplate += ' <li class="nav-item" opcion="' + dato1.descripcion + '"> '
        this.myTemplate += ' <a   routerLink="' + dato2.url + '" class="nav-link with-sub">' + dato2.descripcion + '</a> '
        this.myTemplate += ' </li>'
      });
      this.myTemplate += ' </ul> '
      this.myTemplate += '</div>'


      this.myTemplate += '</div>'
      this.myTemplate += '</div>'
      this.myTemplate += '</div>'


      //console.log(this.myTemplate)


    });
      document.getElementById('divHtmlIntranet')!.innerHTML = this.myTemplate;


  }*/

  ngAfterContentChecked() {
    //console.log('Entro!  ngAfterContentInit')
    //console.log(this.myTemplate)
    document.getElementById('divHtmlIntranet')!.innerHTML = this.myTemplate;
  }

  @HostListener('click', ['$event.target']) clickShowHide(dato: any) {
    console.log(dato);

    if (dato.nodeName == 'svg') {
      if (dato.id == 'more') {
        this.e_ShowOrHide(dato.attributes[1].value)
      }
    } else {
      if (dato.nodeName == 'circle') {
        if (dato.id == 'more') {
          //this.e_ShowOrHide(dato.attributes[1].value )
          //console.log('circle');
          //console.log(dato.farthestViewportElement.attributes[1].value)
          this.e_ShowOrHide(dato.farthestViewportElement.attributes[1].value)
        }
      }
    }

    if (dato.nodeName === 'A') {
      //console.log(dato);
      let url = dato.getAttribute('routerlink');
      this.router.navigate([url]);
    }

  }




  e_ShowOrHide(dato: any) {
    let melement = document.getElementById(dato);
    if (melement!.style.display == 'none') {
      melement!.style.display = 'block';
    } else {
      melement!.style.display = 'none';
    }
  }


}

