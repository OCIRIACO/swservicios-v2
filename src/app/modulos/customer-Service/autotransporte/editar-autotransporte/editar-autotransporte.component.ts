import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


import { ActivatedRoute, Router } from '@angular/router';
import { Iparametros } from 'src/app/modelos/solicitudEntradas/datosconsultamanifiesto.interfase';
import { Icarga, Imercancia } from 'src/app/modelos/solicitudEntradas/datosformulariomanifiesto.interfase';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
//import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Idetallemercancias, Imanifiesto, Imercancias, Isellos, IparametrosEditar } from 'src/app/modelos/solicitudEntradas/rectificamanifiesto.interfase';
import { GlobalConstants } from 'src/app/modelos/global';
import { IdatosMercancia } from 'src/app/modelos/datosmercancias.interfase';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios'

import * as $ from 'jquery';
import 'select2';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-editar-autotransporte',
  templateUrl: './editar-autotransporte.component.html',
  styleUrls: ['./editar-autotransporte.component.css']
})
export class EditarAutotransporteComponent implements OnInit {

  //@ViewChild('idsequence', { static: false }) idsequence!: ElementRef;
  //@ViewChild('idSequenceDetalleBien', { static: false }) idSequenceDetalleBien!: ElementRef;
  @ViewChild('solicitudForm') ngformsolicitud: NgForm;

  testatus: string = ''
  texistencia: string = ''
  tingresoTotal: string = ''

  //Label's
  lblSerieMarca: string = 'Contenedor'
  lblalert: string = ''
  lbltipoAlerta: string = ''
  lblNotificacionRechazo: string = ''
  lblfhfecharegistro: string = ''
  lbletransaccion: string = ''

  //Textarea *comentarion
  maxCaracteres: number = 256
  maxCarateresMarcas: number = 0;
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  isReadonly: boolean = false

  //etransaccion
  etransaccion: number = 0;

  //Now DATE
  nowFechaServicio: any;

  //@ViewChild("myNameElem") myNameElem: ElementRef;
  tmarcas = ''

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Selected true or false
  ngSelectTipoServicio: string = ""
  ngSelectServicios: string = ""
  ngSelectServicioEspecifico: string = ""

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  respuestaConfirmar: any;
  seleccion: any;
  seleccionNaviera: any;

  //Change's
  changeCount = 0;
  changeCountMercancia = 0;

  //Submit's
  submitted = false;
  submitBien = false;
  submitDetalleBien = false;
  submitGuardar = false;
  submitServicios = false

  // Div Show Hidden
  divCarga: boolean = true;
  divMercancia: boolean = false;
  divecodCarga: boolean = true;
  divDetalleBien: boolean = true;
  divServicioEspecifico: boolean = false
  divOperacion: boolean = true;
  divNotificacion: boolean = false
  divAlerta: boolean = false

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any
  datosTramite: any
  datosNaviera: any;
  datosEmbalaje: any;
  datosTipoContenedor: any;
  datosRutas: any
  datosTipoTransporte: any

  //Otros's
  bienes: any;
  carga: any;
  datosBien: any;
  listDetallesBienNew: any;
  servicios: Array<any> = []
  arratipoServicios: Array<any> = []
  arrservicio: Array<any> = []
  arrtiposolicitud: Array<any> = []
  listDetallesBien: Array<IdatosMercancia>;



  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Contador rows tables
  contadorRowBien: number = 1;

  //Forms's
  FormSolicitudServicios = new FormGroup({
    trfc: new FormControl('', Validators.required),
    edireccion: new FormControl('', Validators.required),
    emetodopago: new FormControl('', Validators.required),
    ebanco: new FormControl('', Validators.required),
    ecfdi: new FormControl('', Validators.required),
    ecuenta: new FormControl('', [
      Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    ]),
    tmoneda: new FormControl('', Validators.required),
    fhfechaservicio: new FormControl('', Validators.required),
    tcorreo: new FormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new FormControl('', [
      Validators.required,
      Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
    ]),
    treferencia: new FormControl('', null),
    tobservaciones: new FormControl('', null),
    truta: new FormControl('', Validators.required),
    ttramite: new FormControl('', Validators.required),
    ttipocarga: new FormControl('', Validators.required),
    ttipotransporte: new FormControl('', Validators.required),

  })

  FormDatosBien = new FormGroup({
    econtadorRowBien: new FormControl(0, null),
    eguia: new FormControl(0, Validators.required),
    ecodembalaje: new FormControl('', Validators.required),
    ecodnaviera: new FormControl('', Validators.required),
    tmarcas: new FormControl('', Validators.required),
    ttipocontenedor: new FormControl('', Validators.required),
    epesoneto: new FormControl('', [
      Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesobruto: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
    ),
    ebultos: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
    ),
    //ttramite: new FormControl('', Validators.required),
    //ttipocarga: new FormControl('', Validators.required),
    tsellos: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
    ])
  })


  FormDatosDetallesBien = new FormGroup({
    econtadorRow: new FormControl(0, null),
    eguia: new FormControl(0, null),
    tfacturas: new FormControl('', Validators.required),
    tmarcas: new FormControl('', Validators.required),
    tdescripcion: new FormControl('', Validators.required),
    ecantidad: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesobruto: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesoneto: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    evolumen: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]),
    ecodembalaje: new FormControl('', Validators.required),
    //tembalaje: new FormControl('', Validators.required)
  });

  FormServicios = new FormGroup({
    etipomercancia: new FormControl(null, Validators.required),
    etiposervicio: new FormControl(null, Validators.required),
    etiposolicitud: new FormControl(null, Validators.required),
  })


  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any
  globalIdCliente: any

  //Autocomplete
  controlRfc = new FormControl('');
  opcionesRfc!: Array<any>;
  filtrarOpcionesRfc?: Observable<any>;

  constructor(
    private api: classApiCatalogo,
    private router: Router,
    private route: ActivatedRoute,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
    private apiServiceSolicitudServicios: apiServiceSolicitudServicios,
    private serviceCatalogos: serviceCatalogos,

  ) {

    //Clear
    this.bienes = [];
    this.listDetallesBien = [];
    this.datosNaviera = [];
    this.datosEmbalaje = [];
    this.datosTipoContenedor = [];
    this.datosMetodoPago = [];

  }


  //////// Autocomplete /////////

  e_filtrarRfc(value: any) {
    let filterValue = '';
    if (typeof value === "string") {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.trfc.toLowerCase();
    }

    return this.opcionesRfc.filter(
      option => option.trfc.toLowerCase().indexOf(filterValue) === 0
    );

  }


  e_seleccionarRfc(dato: any) {
    console.log('*Dato rfc');
    console.log(dato);
    this.datosDirecciones = dato.direcciones
    this.FormSolicitudServicios.get('trfc')?.setValue(dato);

  }

  // true o false validador regex
  regexValidador(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null as any;
      }
      const valid = regex.test(control.value);
      return valid ? null as any : error;
    };
  }

  onChangeEmbalajeBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    //this.FormDatosBien.get('tembalaje')?.setValue(dato);
  }

  /////////////////////////// ONINIT /////////////////
  ngOnInit(): void {

    //Date
    const datePipe = new DatePipe('en-Us');
    this.nowFechaServicio = datePipe.transform(new Date(), 'yyyy-MM-dd');


    //Catalogo de naviera
    /*this.api.GetNavieras().subscribe(data => {
      let dato = {
        ecodnaviera: null,
        tnombre: 'SELECCIONAR'
      }
      this.datosNaviera = data;
      this.datosNaviera.push(dato)

    })*/

    this.datosNaviera = this.serviceCatalogos.catalogoNavieras


    //Catalogo de Embalajes
    /*this.api.GetEmbalajes().subscribe(data => {
      let dato = {
        ecodembalaje: null,
        tnombre: 'SELECCIONAR'
      }
      this.datosEmbalaje = data;
      this.datosEmbalaje.push(dato)

    })*/
    this.datosEmbalaje = this.serviceCatalogos.catalogoEmbalajes


    //Catalogo de Tipos de contenedores
    this.api.GetTipoContenedores().subscribe(data => {
      let dato = {
        id: null,
        ttipo: 'SELECCIONAR'
      }
      this.datosTipoContenedor = data;
      this.datosTipoContenedor.push(dato)

    })

    //Catalogo de metodo de pago
    /*this.api.GetMetodoPago().subscribe(data => {
      this.datosMetodoPago = data;
    })*/

    this.datosMetodoPago = this.serviceCatalogos.catalogoMetodoPago


    //Catalogo de Bancos
    /*this.api.GetBancos().subscribe(data => {
      this.datosBancos = data;
    })*/
    this.datosBancos = this.serviceCatalogos.catalogoBancos



    //Catalogo de metodo de pago
    /*this.api.GetCfdi().subscribe(data => {
      this.datosCfdi = data;
    })*/
    this.datosCfdi = this.serviceCatalogos.catalogoCfdi


    //Catalogo de ruta
    let arrRutas = [
      {
        truta: null,
        tdescripcion: "SELECCIONAR",
      },
      {
        truta: "LOCAL",
        tdescripcion: "LOCAL",
      },
      {
        truta: "FORANEO",
        tdescripcion: "FORANEO",
      }
    ]
    this.datosRutas = arrRutas

    //Catalogo de tipo de transporte
    let arrTipoTransporte = [
      {
        ttipotransporte: null,
        tdescripcion: "SELECCIONAR",
      },
      {
        ttipotransporte: "SENCILLO",
        tdescripcion: "SENCILLO",
      },
      {
        ttipotransporte: "FULL",
        tdescripcion: "FULL",
      }
    ]

    this.datosTipoTransporte = arrTipoTransporte


    //Catalogo de tramite
    // this.datosTramite
    let arrTramite = [
      {
        ttramite: null,
        tdescripcion: "SELECCIONAR",
      },
      {
        ttramite: "IMPORTACION",
        tdescripcion: "IMPORTACION",
      },
      {
        ttramite: "EXPORTACION",
        tdescripcion: "EXPORTACION",
      }
    ]
    this.datosTramite = arrTramite

    //Consultar los clientes
    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        this.e_procesar_datos_clientes(response)

        //Auto complete
        this.opcionesRfc = response.data;

        this.filtrarOpcionesRfc = this.controlRfc.valueChanges.pipe(
          startWith(''),
          map(value => this.e_filtrarRfc(value)),
        );

        //Consultar solicitud
        this.etransaccion = this.route.snapshot.params['id'];
        this.e_consultaSolicitud(this.etransaccion);

      }
    )

    //Consultar los tipos de servicios
    let parametroServicios = {
      tunidad: "TRANSPORTE",
      tservicio: "MOVIMIENTO"
    }

    this.apiServiceSolicitudServicios.postConsultarTiposServicios(parametroServicios).subscribe(
      (response) => {
        //this.arratipoServicios =  response
        this.e_procesarDatosServicios(response);
        // this.e_procesar_datos_clientes(response)
        //this.rowData =  response
        //console.log(response);
      }
    )


    //Selected
    /*this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    this.FormDatosBien.controls['ttipocontenedor'].setValue(null);

    this.FormSolicitudServicios.controls['truta'].setValue(null);
    this.FormSolicitudServicios.controls['ttramite'].setValue(null);
    this.FormSolicitudServicios.controls['ttipocarga'].setValue(null);
    this.FormSolicitudServicios.controls['ttipotransporte'].setValue(null);
    */



  }

  /// Consulta de manifiesto
  e_consultaSolicitud(etransaccion: number) {
    let Iparametros: Iparametros;
    let productos: any = [];

    Iparametros = {
      etransaccion: etransaccion
    }

    this.apiServiceSolicitudServicios.postConsultarSolicitudTransporte(Iparametros).subscribe(
      data => {
        //this.bienesServicios = data.mercancias
        ////console.log(data.mercancias)
        this.e_procesarConsultaSolicitud(data)
      }
    )
  }

  e_procesarConsultaSolicitud(datos: any) {

    //Carga(s)
    let Icarga: any = {};
    let IListadoCargas: Array<Icarga> = [];

    //Mercancia(s)
    let Imercancia: any = {};
    let IListadoMercancias: Array<Imercancia> = [];


    //Auxiliares
    let tnombreNaviera = '';
    let tnombreEmbalaje = '';
    let tnombreEmbalajeMercancia = '';
    // Nofificaciones
    let arrNotificaciones: any

    //Contadores Bienes
    let contadorDetallesBien: number = 0;

    let contadorRowBien: number = 1;


    let sellos: any = [];

    //Estatus de la solicitud
    this.testatus = datos.testatus;

    //Mercancia(s)
    IListadoCargas = [];


    //Procesar la busqueda de la direccion
    this.datosClientes.forEach((datocliente: any, index: any) => {
      if (datocliente.ecliente == datos.ecliente) {
        this.datosDirecciones = datocliente.direcciones
      }
    })

    //console.log('*Solicitud');
    //console.log(datos);

    let solicitud = {
      trfc: datos.trfc,
      edireccion: datos.edireccion,
      emetodopago: datos.emetodopago,
      ebanco: datos.ebanco,
      ecfdi: datos.ecfdi,
      ecuenta: datos.ecuenta,
      tmoneda: datos.tmoneda,
      fhfechaservicio: datos.fhfechaservicio,
      tcorreo: datos.tcorreo,
      ttelefono: datos.ttelefono,
      treferencia: datos.treferencia,
      tobservaciones: datos.tobservaciones,
      truta: datos.operaciones[0].truta,
      ttramite: datos.operaciones[0].ttramite,
      ttipocarga: datos.operaciones[0].ttipocarga,
      ttipotransporte: datos.operaciones[0].ttipotransporte,
    }

    //console.log(solicitud);
    this.ngformsolicitud.form.setValue(solicitud)


    //Servicios
    this.servicios = datos.servicios


    //Servicios
    this.servicios = datos.servicios

    // Set Label's
    this.lbletransaccion = datos.etransaccion;
    this.lblfhfecharegistro = datos.fhfecharegistro;
    //this.lbltnombreprogramo = 'PENDIENTE';
    //this.lblttelefono = datos.ttelefono;
    //this.lbltcorreo = datos.tcorreo;

    // Validar si todo los bienes ya ingresaron en su totalidad

    if (datos.tingresototal == 'SI') {
      this.divAlerta = true
      this.tingresoTotal = 'SI'
    }

    //arreglo notificaciones
    arrNotificaciones = datos.notificaciones

    if (arrNotificaciones.length != 0) {
      this.divNotificacion = true
      arrNotificaciones.forEach((dato: any, index: any) => {
        this.lblNotificacionRechazo += '* ' + dato.tobservaciones + ' ' + dato.fhfecharegistro + '<br/>'
      })
    }


    //Estatus
    if (datos.testatus == 'PENDIENTE') {
      this.lblalert = "SOLICITUD PENDIENTE"
      this.lbltipoAlerta = "warning"
    } else if (datos.testatus == 'AUTORIZADA') {
      this.lblalert = "SOLICITUD AUTORIZADA"
      this.lbltipoAlerta = "primary"
    } else if (datos.testatus == 'RECHAZADA') {
      this.lblalert = "SOLICITUD RECHAZADA"
      this.lbltipoAlerta = "danger"

    }


    datos['operaciones'].forEach((operaciones: any, index: any) => {

      operaciones['bienes'].forEach((datocarga: any, index: any) => {

        //Clear
        tnombreNaviera = '';
        tnombreEmbalaje = '';
        tnombreEmbalajeMercancia = '';

        sellos = [];
        IListadoMercancias = [];

        //Clear contadores
        contadorDetallesBien = 0



        // Busco los textos de los catalogos de la naviera ya los tengo a la mano
        this.datosNaviera.forEach((naviera: any, navindex: any) => {
          if (naviera['ecodnaviera'] == datocarga['ecodnaviera']) {
            tnombreNaviera = naviera['tnombre']
          }
        });

        //Sellos(s)
        datocarga['sellos'].forEach((datosello: any, index: any) => {
          sellos.push(datosello['tsello']);
        });

        // Nombre embalaje mercancia
        this.datosEmbalaje.forEach((embalaje: any, index: any) => {
          if (embalaje['ecodembalaje'] == datocarga['ecodembalaje']) {
            // //console.log('Embalaje')
            // //console.log(embalaje)
            tnombreEmbalajeMercancia = embalaje['tnombre']
          }
        });


        //Mercancia(s)
        datocarga['detallesbien'].forEach((datoMercancia: any, index: any) => {

          //console.log(datoMercancia);

          this.datosEmbalaje.forEach((embalaje: any, index: any) => {
            if (embalaje['ecodembalaje'] == datoMercancia['ecodembalaje']) {
              tnombreEmbalaje = embalaje['tnombre']
            }
          });



          Imercancia = {
            econtadorRow: contadorRowBien,
            eguia: datoMercancia.edetalleguia,
            tfacturas: datoMercancia.tfacturas,
            tmarcas: datoMercancia.tmarcas,
            tdescripcion: datoMercancia.tdescripcion,
            ecantidad: datoMercancia.ecantidad,
            epesobruto: datoMercancia.epesobruto,
            epesoneto: datoMercancia.epesoneto,
            tembalaje: tnombreEmbalaje,
            ecodembalaje: datoMercancia.ecodembalaje,
            evolumen: datoMercancia.evolumen
          }


          IListadoMercancias.push(Imercancia);

          contadorRowBien++;


        });


        Icarga = {
          econtadorRowBien: contadorRowBien,
          eguia: datocarga.eguia,
          tembalaje: tnombreEmbalajeMercancia,
          ecodembalaje: datocarga['ecodembalaje'],
          tnaviera: tnombreNaviera,
          ecodnaviera: datocarga['ecodnaviera'],
          tmarcas: datocarga['tmarcas'],
          ttipocontenedor: datocarga['ttipocontenedor'],
          epesoneto: datocarga['epesoneto'],
          epesobruto: datocarga['epesobruto'],
          ebultos: datocarga['ecantidad'],
          //ttramite: datocarga['ttramite'],
          //ttipocarga: datocarga['ttipocarga'],
          tsellos: sellos.join('/'),
          texistencia: datocarga.texistencia,
          detallesbien: IListadoMercancias
        }


        IListadoCargas.push(Icarga);

        contadorRowBien++;

        // Change select2 
        /*$('.select2').val(datos.ecliente).trigger('change');
        let parametros = {
          ecliente: datos.ecliente
        }
        $('#ecliente').trigger('eValorCliente', parametros);
        */
        /////////////////////////////////////////////////////

      });

      this.bienes = IListadoCargas;

    });

    //console.log('*Resultado');
    //console.log( this.bienes);
  }




  ////////////////////// ONCHANGE ////////////////////

  //Onchange tipo de carga
  //Onchange tipo de carga
  onChangeTipoCarga(datos: any) {

    //Reset
    this.FormDatosBien.controls['tmarcas'].setValue('');


    let error: string = 'OK!';
    let mensaje: string = ''
    let alerta: any = {};

    //console.log(datos)

    if (datos != null) {

      if (datos != 'CONTENERIZADA') {
        this.lblSerieMarca = 'Marca'
        this.maxCarateresMarcas = 25
        this.isReadonly = true
        this.FormDatosBien.controls['ttipocontenedor'].setValue('NA');
        this.FormDatosBien.controls['tsellos'].setValue('NA');
        this.maxCarateresMarcas = 25;
      } else {
        this.lblSerieMarca = 'Contenedor'
        this.maxCarateresMarcas = 11
        this.isReadonly = false
        this.FormDatosBien.controls['ttipocontenedor'].setValue('');
        this.FormDatosBien.controls['tsellos'].setValue('');
        this.maxCarateresMarcas = 11;
      }


      if (this.bienes.length != 0) {

        this.bienes.forEach((dato: any, index: any) => {
          if (datos != dato.ttipocarga) {
            //Reset
            //this.FormDatosBien.controls['ttipocarga'].setValue(null);
            error = 'ERROR!'
          }
        })
      }

      if (error == 'ERROR!') {

        alerta['text'] = 'NO ES POSIBLE COMBINAR DIFERENTES TIPO DE CARGA EN LA SOLICITUD';
        alerta['tipo'] = 'error';
        alerta['footer'] = 'ENTRADA';
        this.alerta(alerta);

      }
    }

  }

  onChangeDetalleBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    //this.FormDatosDetallesBien.get('tembalaje')?.setValue(dato);
  }

  /*
  onChangeNaviera(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    //this.FormDatosBien.get('tnaviera')?.setValue(dato);
  }
  */

  //funcion para evitar que los usuarios abandonen accidentalmente una ruta / página
  canDeactivate(): Observable<boolean> | boolean {
    if (this.unSaved) {
      const result = window.confirm('Hay cambios sin guardar, ¿desea descartarlos?');
      return of(result);
    }
    return true;
  }



  /// ALERTAS
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
      if (result.isConfirmed && datos['tipo'] == 'success') {
        this.unSaved = false
        // this.etransaccion se llena cuando responde el response success
        this.router.navigate(['dashboard/customer/transporte/detalle', this.etransaccion]);
      }
    })
  }

  alertaConfirm(dato: any, callback: any) {
    let valor: boolean = false;
    Swal.fire({
      title: 'ATENCIÓN',
      text: dato['text'],
      icon: dato['tipo'],
      showCancelButton: true,
      confirmButtonColor: '#22bab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: "CANCELAR"
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(valor);
      }
    })
    return valor;
  }

  /////////////// CLIENTES ////////////////////////
  e_procesar_datos_clientes(datos: any) {
    //console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);

    })*/
    this.datosClientes = datos.data
  }

  //////////////  AGERGAR BIEN ////////////////////////

  // convenience getter for easy access to form fields
  //get f() { return this.FormDatosBien.controls; }

  //////////////  BIEN(ES) ////////////////////////
  e_agregarBien(): void {


    if (this.FormDatosBien.invalid) {
      console.log('error.');
      return;
    }



    //let datosBien: any = {};
    this.datosBien = {}
    this.datosBien.econtadorRowBien = this.FormDatosBien.value.econtadorRowBien;
    this.datosBien.tembalaje = '';
    this.datosBien.ecodembalaje = this.FormDatosBien.value.ecodembalaje;
    this.datosBien.tnaviera = '';
    this.datosBien.ecodnaviera = this.FormDatosBien.value.ecodnaviera;
    this.datosBien.tmarcas = this.FormDatosBien.value.tmarcas;
    this.datosBien.ttipocontenedor = this.FormDatosBien.value.ttipocontenedor;
    this.datosBien.epesoneto = this.FormDatosBien.value.epesoneto;
    this.datosBien.epesobruto = this.FormDatosBien.value.epesobruto;
    this.datosBien.ebultos = this.FormDatosBien.value.ebultos;
    //this.datosBien.ttramite = this.FormDatosBien.value.ttramite;
    //this.datosBien.ttipocarga = this.FormDatosBien.value.ttipocarga;
    this.datosBien.tsellos = this.FormDatosBien.value.tsellos;
    //this.datosBien.bienes = this.FormDatosBien.value.tsellos;


    //Nombre naviera
    this.datosNaviera.forEach((valor: any, index: any) => {
      if (valor.ecodnaviera == this.datosBien.ecodembalaje) {
        this.datosBien.tnaviera = valor.tnombre;
      }
    });


    //Nombre embalaje
    this.datosEmbalaje.forEach((valor: any, index: any) => {
      if (valor.ecodembalaje == this.datosBien.ecodembalaje) {
        this.datosBien.tembalaje = valor.tnombre;
      }
    });

    //Eliminar registro del arreglo bienes
    if (this.datosBien.econtadorRowBien != 0) {
      this.bienes.forEach((value: any, index: any) => {
        if (value.econtadorRowBien == this.datosBien.econtadorRowBien) {
          //Recuperar los datalles antes de eliminar

          if (value.detallesbien) {
            if (value.detallesbien.length == 0) {
              this.datosBien.detallesbien = [];
            } else {
              this.datosBien.detallesbien = value.detallesbien;
            }
          }
          //Eliminar
          this.bienes.splice(index, 1);
        }
      })
    } else {
      this.datosBien.detallesbien = [];
    }


    //Crear un nuevo identificador row
    this.datosBien.econtadorRowBien = this.contadorRowBien;
    this.datosBien.eguia = this.FormDatosBien.value.eguia;


    //Agregar
    this.bienes.push(this.datosBien);

    //Contador++
    this.contadorRowBien++;

    //Reset
    this.FormDatosBien.reset();

    //Reset items
    this.FormDatosBien.get('econtadorRowBien')!.setValue(0);
    this.FormDatosBien.get('eguia')!.setValue(0);

    console.log('*Bienes')
    console.log(this.bienes);


  }

  e_eliminarBien(element: any) {
    //////console.log(element);

    this.bienes.forEach((value: any, index: any) => {
      if (value == element) {
        this.bienes.splice(index, 1);
        //this.FormDatosBien.get('idsequence')?.setValue(this.bienes.length);
      }
    });
  }

  e_editarBien(datos: any) {

    //Item's
    this.FormDatosBien = new FormGroup({
      econtadorRowBien: new FormControl(datos.econtadorRowBien, null),
      eguia: new FormControl(datos.eguia, null),
      ecodembalaje: new FormControl(datos.ecodembalaje, Validators.required),
      ecodnaviera: new FormControl(datos.ecodnaviera, Validators.required),
      tmarcas: new FormControl(datos.tmarcas, Validators.required),
      ttipocontenedor: new FormControl(datos.ttipocontenedor, Validators.required),
      epesoneto: new FormControl(datos.epesoneto, [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
        this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new FormControl(datos.epesobruto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ebultos: new FormControl(datos.ebultos, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      //ttramite: new FormControl(datos.ttramite, Validators.required),
      //ttipocarga: new FormControl(datos.ttipocarga, Validators.required),
      tsellos: new FormControl(datos.tsellos, [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })


  }

  //////////////////////////////////////////////////// DETALLES DE BIEN /////////////////////////////////////////////////////////////

  //agregar Detalles del bien
  e_agregarDetalleBien() {

    console.log('*Datos bien');
    console.log(this.datosBien);

    console.log('*Detalles bienes');
    console.log(this.FormDatosDetallesBien)

    // stop here if form is invalid
    if (this.FormDatosDetallesBien.invalid) {
      console.log('error.');
      return;
    }


    let datosDetallesBien: any = {}
    datosDetallesBien.econtadorRow = this.FormDatosDetallesBien.value.econtadorRow;
    datosDetallesBien.eguia = this.FormDatosDetallesBien.value.eguia;
    datosDetallesBien.tfacturas = this.FormDatosDetallesBien.value.tfacturas;
    datosDetallesBien.tmarcas = this.FormDatosDetallesBien.value.tmarcas;
    datosDetallesBien.tdescripcion = this.FormDatosDetallesBien.value.tdescripcion;
    datosDetallesBien.ecantidad = this.FormDatosDetallesBien.value.ecantidad;
    datosDetallesBien.epesobruto = this.FormDatosDetallesBien.value.epesobruto;
    datosDetallesBien.epesoneto = this.FormDatosDetallesBien.value.epesoneto;
    datosDetallesBien.evolumen = this.FormDatosDetallesBien.value.evolumen;
    datosDetallesBien.ecodembalaje = this.FormDatosDetallesBien.value.ecodembalaje;

    //Nombre embalaje
    this.datosEmbalaje.forEach((valor: any, index: any) => {
      if (valor.ecodembalaje == datosDetallesBien.ecodembalaje) {
        datosDetallesBien.tembalaje = valor.tnombre;
      }
    });

    //Eliminar el registro del arreglo
    //Lo reemplazar por uno nuevo id
    if (datosDetallesBien.econtadorRow != 0) {
      this.listDetallesBien.forEach((value: any, index: any) => {
        if (value.econtadorRow == datosDetallesBien.econtadorRow) {
          //Eliminar
          this.listDetallesBien.splice(index, 1);
        }
      })
    }


    //Crear un nuevo identificador row.
    datosDetallesBien.econtadorRow = this.contadorRowBien;

    //Agregar
    this.listDetallesBien.push(datosDetallesBien);

    //Agregar el detalle en el bien correspondiente.
    this.bienes.forEach((value: any, index: any) => {
      if (value.econtadorRowBien == this.datosBien.econtadorRowBien) {
        this.bienes[index].detallesbien = this.listDetallesBien;
      }
    });

    //Contador++
    this.contadorRowBien++;

    //Reset
    this.FormDatosDetallesBien.reset();

    //Nuevo
    this.FormDatosDetallesBien.get('econtadorRow')!.setValue(0);
    this.FormDatosDetallesBien.get('eguia')!.setValue(0);


  }

  //Form para iniciar la captura de los detalles del bien
  e_capturarDetalleBien(datos: any) {

    console.log('* Detalles bien')
    console.log(datos)

    //Cargas los datos
    this.datosBien = datos

    this.listDetallesBien = datos.detallesbien;

    //Show Hidden div
    this.divCarga = !this.divCarga
    this.divMercancia = true

  }

  //Editar el detalles del bien
  e_editarDetalleBien(datos: any) {

    // Set value del sequence
    //this.idSequenceDetalleBien.nativeElement.value = dato.idSequenceDetalleBien;

    console.log(datos);

    this.FormDatosDetallesBien = new FormGroup({
      econtadorRow: new FormControl(datos.econtadorRow, null),
      eguia: new FormControl(datos.eguia, null),
      tfacturas: new FormControl(datos.tfacturas, Validators.required),
      tmarcas: new FormControl(datos.tmarcas, Validators.required),
      tdescripcion: new FormControl(datos.tdescripcion, Validators.required),
      ecantidad: new FormControl(datos.ecantidad, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new FormControl(datos.epesobruto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesoneto: new FormControl(datos.epesoneto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      evolumen: new FormControl(datos.evolumen, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      ecodembalaje: new FormControl(datos.ecodembalaje, Validators.required)
    });



  }


  //ELiminar el detalles del bien 
  e_eliminarDetalleBien(dato: any) {

    this.listDetallesBien.forEach((value: any, index: any) => {
      if (value == dato) {
        this.listDetallesBien.splice(index, 1);
        //this.FormDatosDetallesBien.get('idSequenceDetalleBien')?.setValue(this.listDetallesBien.length);
      }
    });
  }

  //Form para iniciar la captura de los detalles del bien
  e_mercancias(datos: any) {

    //Selected
    this.FormDatosBien.controls['ecodembalaje'].setValue(null);

    ////console.log('Agregar detalles bien....')
    ////console.log(datos)

    //Reset a los submit
    this.submitDetalleBien = false
    this.submitted = false

    //Cargas los datos
    this.datosBien = datos


    //En caso de que el bien ya tenga cargado los detalles del bien se pinta  entonces !!!
    if (Boolean(this.datosBien.detallesbien) == true) {
      this.listDetallesBien = this.datosBien.detallesbien
    }

    //Show Hidden div
    this.divCarga = !this.divCarga
    this.divMercancia = true

  }

  e_eliminarMercancia(dato: any) {

    this.listDetallesBien.forEach((value: any, index: any) => {
      if (value == dato) {
        this.listDetallesBien.splice(index, 1);
        //this.FormDatosDetallesBien.get('idSequenceDetalleBien')?.setValue(this.listDetallesBien.length);
      }
    });
  }

  e_carga(datos: any) {


    //Clear
    this.listDetallesBien = [];

    //Show Hidden div
    this.divCarga = true;
    this.divMercancia = false;


  }

  ////////////////////////// GUARDAR ///////////////////////

  // convenience getter for easy access to form fields
  get fcontacto() { return this.FormSolicitudServicios.controls; }


  e_guardar(solicitud: NgForm) {

    console.log(solicitud);


    //Validar datos del contacto
    this.submitGuardar = true;

    // stop y valido
    if (solicitud.invalid) {
      ////console.log('error.');
      return;
    }



    if (this.bienes.length == 0) {

      let alertaCarga: any = {};

      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);

    }


    ////console.log('Antes');
    ////console.log(JSON.stringify(this.bienes));


    if (this.bienes.length != 0) {

      // Procesando datos

      // Interfaces
      //let rootNotifaManifiesto: IRootNotificaUnManifiesto;

      //let datosNotificaManifiesto: InotificaManifiesto;

      let Isolicitud: any;
      let arrServivios: Array<any> = []

      //let datosCredencial: Icredencial;

      let datosParametros: Iparametros;


      let carga: any;
      let listaCarga: Array<Imercancias> = [];

      let sellos: Isellos;
      let listaSellos: Array<Isellos> = [];


      let mercancia: Idetallemercancias;
      let listaMercancias: Array<Idetallemercancias> = [];



      this.bienes.forEach((dato: any, index: any) => {
        ////console.log(index);
        ////console.log(dato['idsequence']);

        //clear
        listaMercancias = []
        listaSellos = []


        /* if (Boolean(dato['detallesbien']) == false) {
 
           let alerta: any = {};
 
           alerta['text'] = 'CAPTURAR EL DETALLE DE LAS MERCANCIAS';
           alerta['tipo'] = 'warning';
           alerta['footer'] = '';
           this.alerta(alerta);
 
         }*/

        //DETALLE MERCANCIA
        if (dato['detallesbien']) {
          dato['detallesbien'].forEach((detallebien: any, index: any) => {
            mercancia = {
              edetalleguia: detallebien.eguia,
              tfacturas: detallebien.tfacturas,
              ecodpropietario: detallebien.ecodpropietario,
              tmarcas: detallebien.tmarcas,
              tdescripcion: detallebien.tdescripcion,
              ecantidad: detallebien.ecantidad,
              epesobruto: detallebien.epesobruto,
              epesoneto: detallebien.epesoneto,
              ecodembalaje: detallebien.ecodembalaje,
              evolumen: detallebien.evolumen,
            }

            listaMercancias.push(mercancia);

          });
        }

        // SELLOS
        let Splitsellos = dato['tsellos'].split("/");
        Splitsellos.forEach((datosello: any, index: any) => {
          sellos = {
            tsello: datosello,
            ttiposello: 'TAPON'
          }
          listaSellos.push(sellos);
        })

        carga = {
          eguia: dato.eguia,
          ttipocarga: dato.ttipocarga,
          ttramite: dato.ttramite,
          ecodnaviera: dato.ecodnaviera,
          ttipocontenedor: dato.ttipocontenedor,
          ecodembalaje: dato.ecodembalaje,
          tmarcas: dato.tmarcas,
          epesobruto: dato.epesobruto,
          epesoneto: dato.epesoneto,
          ecantidad: dato.ebultos,
          truta: dato.truta,
          ttipotransporte: dato.ttipotransporte,
          sellos: listaSellos,
          detallesbien: listaMercancias
        }

        listaCarga.push(carga);

      });


      ///Servicios
      this.servicios.forEach((dato: any, valor: any) => {
        let valores = {
          eservicio: dato.eservicio
        }
        arrServivios.push(valores)
      })



      //Datos del usuaro por [local storage]
      let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

      /*
           truta: new FormControl('', Validators.required),
    ttramite: new FormControl('', Validators.required),
    ttipocarga: new FormControl('', Validators.required),
    ttipotransporte: new FormControl('', Validators.required),
      
      
      */


      /////////// OPERACIONES ///////////
      let operaciones: any;

      operaciones = {
        truta: solicitud.value.truta,
        ttramite: solicitud.value.ttramite,
        ttipocarga: solicitud.value.ttipocarga,
        ttipotransporte: solicitud.value.ttipotransporte,
        bienes: listaCarga

      }

      let arrOperaciones: any = [];

      arrOperaciones.push(operaciones);


      //Parche buscar el id del cliente por el RFC
      this.datosClientes.forEach((dato: any, valor: any) => {
        if (dato.trfc == solicitud.value.trfc) {
          solicitud.value.cliente = dato.ecliente;
        }
      })

      Isolicitud = {
        etransaccion: this.etransaccion,
        ecliente: solicitud.value.cliente,
        edireccion: solicitud.value.edireccion,
        emetodopago: solicitud.value.emetodopago,
        ebanco: solicitud.value.ebanco,
        ecfdi: solicitud.value.ecfdi,
        ecuenta: solicitud.value.ecuenta,
        tmoneda: solicitud.value.tmoneda,
        ttiposolicitud: 'SERVICIO',
        tcorreo: solicitud.value.tcorreo,
        ttelefono: solicitud.value.ttelefono,
        treferencia: solicitud.value.treferencia,
        fhfechaservicio: solicitud.value.fhfechaservicio,
        tobservaciones: solicitud.value.tobservaciones,
        ecodusuario: datosUsuario.ecodusuario,
        servicios: arrServivios,
        operaciones: arrOperaciones
      }


      //datosParametros = { orden: Isolicitud }

      console.log(JSON.stringify(Isolicitud));




      let alerta: any = {};

      alerta['text'] = 'DESEA CONTINUAR ? ';
      alerta['tipo'] = 'question';
      alerta['footer'] = '';


      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.e_generarSolicitudServicio(Isolicitud);
        }
      });
    }

  }

  e_generarSolicitudServicio(datos: any) {
    let alerta: any = {};
    let text = '';
    let success: boolean

    //Consumir el api
    this.apiServiceSolicitudServicios.postActualizarSolicitudTransporte(datos).subscribe(
      (response) => {

        if (response.data) {
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
            if (dato.attributes.etransaccion) {
              this.etransaccion = dato.attributes.etransaccion

            }

          })
        }

        if (response.errors) {
          success = false
          response.errors.forEach((dato: any, index: any) => {
            //console.log(dato.attributes.text)
            text += dato.attributes.text + '\n'
          })
        }

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "SERVICIO";
        this.alerta(alerta);
      })
  }


  /////////////////////// SERVICIOS ////////////////////////
  //Agregar servicio(s)
  //get fservicios() { return this.FormServicios.controls; }

  e_agregarServicio(datos: NgForm) {

    console.log('Servicios');
    console.log(datos);

    //Validamos el Forms
    //this.submitServicios = true;
    // Stop en caso de detectar error
    if (datos.invalid) {
      //console.log('error.');
      return;
    }

    //servicios argregados
    console.log('Servicios agregados')
    console.log(this.servicios)

    let alerta: any = {}
    let exitencia: string = 'NO'

    if (this.servicios.length > 0) {
      this.servicios.forEach((servicio: any, valor: any) => {
        if (datos.value.etiposolicitud.eservicio == servicio.eservicio) {
          exitencia = 'SI';
        }

      })
    }

    if (exitencia == 'SI') {
      alerta['text'] = 'EL SERVICIO YA SE ENCUENTRA AGREGADO';
      alerta['tipo'] = 'error';
      alerta['footer'] = '';
      this.alerta(alerta);
    } else {

      let datoservicios = {}

      if (datos.value.etiposolicitud > 0) {
        datoservicios = {
          ttipomercancia: datos.value.etipomercancia.tdescripcion,
          ttiposervicio: datos.value.etiposervicio.tdescripcion,
          ttiposolicitud: datos.value.etiposolicitud.tdescripcion,
          eservicio: datos.value.etiposolicitud.eservicio
        }
      } else {
        datoservicios = {
          ttipomercancia: datos.value.etipomercancia.tdescripcion,
          ttiposervicio: datos.value.etiposervicio.tdescripcion,
          ttiposolicitud: datos.value.etiposolicitud.tdescripcion,
          eservicio: datos.value.etiposolicitud.eservicio
        }
      }

      this.servicios.push(datoservicios)

      /*this.FormServicios = new FormGroup({
        etipomercancia: new FormControl(null, Validators.required),
        etiposervicio: new FormControl(null, Validators.required),
        etiposolicitud: new FormControl(null, Validators.required),
      })*/

      //Reset
      this.FormServicios.reset();


    }

  }

  //Eliminar servicio
  e_eliminar_servicio(datos: any) {
    this.servicios.forEach((servicio: any, valor: any) => {
      if (servicio.eservicio == datos.eservicio) {
        // console.log('eliminar!');
        this.servicios.splice(valor, 1);
      }
    })
  }


  //Onchage tipo servicio
  e_onChangeTipoServicio(datos: any) {

    //Ocultar especificacion del servicio
    this.divServicioEspecifico = false

    //Clear
    this.arrservicio = []
    //this.arrtiposolicitud = []

    //Seleccionar primera posicio (reset)
    this.ngSelectServicios = ""
    this.ngSelectServicioEspecifico = ""


    if (datos.value.childs) {
      datos.value.childs.forEach((dato: any, valor: any) => {
        this.arrservicio.push(dato)
        /*if (dato.servicios.length > 0) {
          this.arrtiposolicitud = []
          console.log(dato.servicios)
          this.arrtiposolicitud = dato.servicios
        }*/
      })
    }
  }

  //Onchage servicios
  e_onChangeServicio(datos: any) {

    this.arrtiposolicitud = []

    //console.log('Servicios')
    //console.log(datos.servicios.length)
    this.arrtiposolicitud = []

    if (datos.value.childs) {
      if (datos.value.childs.length > 0) {

        this.ngSelectServicioEspecifico = ''

        //Mostrar especificacion del servicio
        this.divServicioEspecifico = true
        datos.value.childs.forEach((dato: any, valor: any) => {
          this.arrtiposolicitud.push(dato)
        })
      }
    }
  }

  //Procesar los datos los servicios para el arragles
  e_procesarDatosServicios(datos: any) {
    //Clear
    this.arrservicio = []
    this.arrtiposolicitud = []

    //Seleccionar primera posicio (reset)
    this.ngSelectTipoServicio = ""
    this.ngSelectServicios = ""
    this.ngSelectServicioEspecifico = ""


    this.arratipoServicios = datos.data
  }


  /////////////////// DIRECCIONES ////////////////

  e_procesarDirecciones(datos: any) {
    //console.log('datos')
    //console.log(datos)
    //this.FormSolicitudServicios.controls.ecliente.setValue(datos.ecliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.ecliente == datos.ecliente) {
        //console.log(dato.direcciones)
        this.datosDirecciones = dato.direcciones
      }
    })
  }


  //Redirecionar al reporte de consultar
  e_consulta() {
    this.router.navigate(['dashboard/customer/transporte/consultar']);
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/transporte/nuevo']);
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
