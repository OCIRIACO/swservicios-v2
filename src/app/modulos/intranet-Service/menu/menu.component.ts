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
            this.datosInicial['icono'] = item.ticono;

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

    //console.log(JSON.stringify(this.datosFinales))

    this.e_crearDivDinamico(this.datosFinales);

    // this.divHtmlIntranet =  this.myTemplate;

  }

  //Agrupador
  e_agrupadorArreglo() {

    const chunkedArray = [];
    /*let index = 0;
    while (index < array.length) {
        chunkedArray.push(array.slice(index, size + index));
        index += size;
    }*/

  }


  e_chunkArrayInGroups(arr: any, size: any) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }
    return myArray;
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
          //this.myTemplate += ' <a  href="javascript:void(0)"  routerLink="' + opcion.url + '" class="">' + opcion.descripcion + '</a> '
          this.myTemplate += ' <a style="cursor: pointer;" routerLink="' + opcion.url + '" >' + opcion.descripcion + '</a> ';
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

  e_link(dato: any) {
    console.log(dato)
  }


}

