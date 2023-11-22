import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/modelos/global';
import { IsolicitudReferencia } from 'src/app/modelos/interfaces/referencias.interfaces';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import * as $ from 'jquery';
import 'select2';
import { serviceReferencia } from 'src/app/serviciosRest/Customer/solicitudReferencias/api.service.referencia';

@Component({
  selector: 'app-crear-referencia',
  templateUrl: './crear-referencia.component.html',
  styleUrls: ['./crear-referencia.component.css']
})
export class CrearReferenciaComponent implements OnInit {


  //Listados
  datosAgentesAduanalesList: Array<any> = [];
  datosAduanasList: Array<any> = [];

  
  //Arreglos
  puertosList: any = [];

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Form's
  formsolicitud = new FormGroup({
    treferencia: new FormControl('', Validators.required),
    epuerto: new FormControl('', Validators.required),
    eagente: new FormControl('', Validators.required),
    eanio: new FormControl('', Validators.required),
    eaduana: new FormControl('', Validators.required),
  });

  //Submit's
  submitGuardar = false

  //Alerta
  notificacionList: any = {};


  

  constructor(
    private serviceCatalogos: serviceCatalogos,
    private serviceReferencia: serviceReferencia,


  ) { }

  ngOnInit(): void {

    //Listados
    this.datosAgentesAduanalesList =  this.serviceCatalogos.catalogoAgentesAduanales;
    this.datosAduanasList          =  this.serviceCatalogos.catalogoAduanas;

    //Catalogo service
    this.puertosList = this.serviceCatalogos.catalogoEstacionesList;

    $(document).ready(function () {
      (<any>$('.select2')).select2();
    });


    $(".select2").on("select2:select", function (e) {

      let epuerto: any = $(e.currentTarget).val();
      //console.log(datopuerto);
      //(<HTMLInputElement>document.getElementById('epuerto')).value = epuerto;

      $('#epuerto').trigger('valor', epuerto);

    })



    $('#epuerto').on('valor', (ev, dato) => {
      //console.log(dato)
      this.formsolicitud.controls.epuerto.setValue(dato);

    });


  }

  e_adjuntarFile(event: any) {


    console.log(event)
    console.log(event.srcElement.attributes.ttipo.nodeValue);
    let text: String = "";

    let file: any = event.target;
    let form = new FormData();
    form.append('file', file.files[0]);
    form.append('eentidad', '0');


    this.serviceReferencia.e_adjuntarFile(form).subscribe(


      (response) => {
        if (response.data) {
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
            if (dato.attributes.order) {
              (<HTMLInputElement>document.getElementById(event.srcElement.attributes.ttipo.nodeValue)).value = dato.attributes.order;
            }
          })
        }

        if (response.errors) {
          response.errors.forEach((dato: any, index: any) => {
            //console.log(dato.attributes.text)
            text += dato.attributes.text + '\n'
          })
        }

      },
      (error) => {

        console.log(error);
      }
    )



    //console.log(form)
  }


  //Generar solicitud
  get fguardar() { return this.formsolicitud.controls; }

  e_guardar(datos: any) {
    //console.log(datos);

    let Isolicitud: IsolicitudReferencia;



    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (this.formsolicitud.invalid) {
      console.log('error.');
      return;
    }

   
  

    let archivosList : Array<any> = [];
   /* Array.from(document.getElementsByClassName('itemsFile')).forEach(function(item: any, index: number) {
        if(item.value !== ""){

          let earchivo = {
            earchivo: item.value
          }

          archivosList.push(earchivo);


        }
    });*/

    Isolicitud = {
      ereferencia: 0,
      treferencia: datos.treferencia,
      epuerto: datos.epuerto,
      eagente: datos.eagente,
      eanio: datos.eanio,
      eaduana:datos.eaduana,
      archivos: archivosList
    }

    
    //let datosPost = JSON.stringify(Isolicitud);

    this.serviceReferencia.e_CrearReferencia(Isolicitud).subscribe((response) => {

      let text : string ="";
      let esolicitud : number = 0;

      if (response.data) {
        response.data.forEach((dato: any, index: any) => {
          text += dato.attributes.text + '\n'
          if (dato.attributes.order) {
            esolicitud = dato.attributes.order
          }
        })
      }

      if (response.errors) {
        response.errors.forEach((dato: any, index: any) => {
          text += dato.attributes.text + '\n'
        })
      }

      //console.log(esolicitud);


      //alerta['text'] = text;
      //alerta['tipo'] = (success == true ? "success" : "error");
      //alerta['footer'] = "ENTRADA";
      //this.alerta(alerta);
    })



  }
}
