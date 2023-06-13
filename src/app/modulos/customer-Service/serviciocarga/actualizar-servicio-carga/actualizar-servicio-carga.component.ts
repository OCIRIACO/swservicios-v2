import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


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


@Component({
  selector: 'app-actualizar-servicio-carga',
  templateUrl: './actualizar-servicio-carga.component.html',
  styleUrls: ['./actualizar-servicio-carga.component.css']
})
export class ActualizarServicioCargaComponent implements OnInit {

  @ViewChild('idsequence', { static: false }) idsequence!: ElementRef;
  @ViewChild('idSequenceDetalleBien', { static: false }) idSequenceDetalleBien!: ElementRef;

  //Etique  dinamica cuando el selecciona el tipo de carga esto cambia
  lblSerieMarca: string = 'Contenedor'

  //Notificaciones
  lblNotificacionRechazo: string = ''

  //Textarea *comentarion
  maxCaracteres: number = 256
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;
  isReadonly: boolean = false


  //Selected true or false
  ngSelectTipoServicio: string = ""
  ngSelectServicios: string = ""
  ngSelectServicioEspecifico: string = ""

  // Numero de transaccion
  etransaccion: number = 0;

  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  id?: string;

  //Label's
  lbletransaccion?: string;
  lblfhfecharegistro?: string;
  lbltnombreprogramo?: string;
  lbltcorreo?: string;
  lblttelefono?: string;
  lbltreferencia: string = '';
  texistencia: string = ''
  tingresoTotal: string = ''
  testatus: string = ''
  lblalert: string = ''
  lbltipoAlerta: string = ''

  listDatosCarga: any;
  datoBien: any = {};

  listDetallesBien: Array<IdatosMercancia>;
  datosBien: any = {};


  //Datos bien (Array)
  bienesServicios: Array<any> = [];
  servicios: Array<any> = []
  arratipoServicios: Array<any> = []
  arrservicio: Array<any> = []
  arrtiposolicitud: Array<any> = []

  // Div Show Hidden
  divCarga: boolean = true;
  divMercancia: boolean = false;
  divecodCarga: boolean = true;
  divDetalleBien: boolean = true;
  divAlerta: boolean = false
  divServicioEspecifico: boolean = false
  divNotificacion: boolean = false

  // Submit's 
  submitGuardar = false;
  submitBien = false;
  submitDetalleBien = false;
  submitServicios = false

  //Select's catalogo's
  datosNaviera: Array<any> = [];
  datosEmbalaje: Array<any> = [];
  datosTipoContenedor: Array<any> = [];
  datosTramite: any

  datosMetodoPago: any = [];
  datosBancos: any
  datosCfdi: any

  /// Numero de orden
  eNumeroOrden: number = 0;

  //No recuerdo XD
  seleccion: any;

  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  // Form contacto
  FormSolicitudEntrada = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    edireccion: new UntypedFormControl('', Validators.required),
    emetodopago: new UntypedFormControl('', Validators.required),
    ebanco: new UntypedFormControl('', Validators.required),
    ecfdi: new UntypedFormControl('', Validators.required),
    ecuenta: new UntypedFormControl('', Validators.required),
    tmoneda: new UntypedFormControl('', Validators.required),
    fhfechaservicio: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    ]),
    ttelefono: new UntypedFormControl('', [Validators.required,
    Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
    ]),
    treferencia: new UntypedFormControl('', null),
    tobservaciones: new UntypedFormControl('', null)
  });



  // Form Bienes
  FormDatosBien = new UntypedFormGroup({
    idsequence: new UntypedFormControl('', null),
    eguia: new UntypedFormControl(0, Validators.required),
    tembalaje: new UntypedFormControl('', Validators.required),
    ecodembalaje: new UntypedFormControl('', Validators.required),
    tnaviera: new UntypedFormControl('', Validators.required),
    ecodnaviera: new UntypedFormControl('', Validators.required),
    tmarcas: new UntypedFormControl('', Validators.required),
    ttipocontenedor: new UntypedFormControl('', Validators.required),
    epesoneto: new UntypedFormControl('', [
      Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesobruto: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
    ),
    ebultos: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
    ),
    ttramite: new UntypedFormControl('', Validators.required),
    //ttipocarga: new UntypedFormControl('', Validators.required),
    tsellos: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
    ])
  })


  FormDatosDetalleBien = new UntypedFormGroup({
    idSequenceDetalleBien: new UntypedFormControl('', null),
    edetalleguia: new UntypedFormControl(0, Validators.required),
    tfacturas: new UntypedFormControl('', Validators.required),
    tmarcas: new UntypedFormControl('', Validators.required),
    tdescripcion: new UntypedFormControl('', Validators.required),
    ecantidad: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesobruto: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesoneto: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    evolumen: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]),
    ecodembalaje: new UntypedFormControl('', Validators.required),
    tembalaje: new UntypedFormControl('', Validators.required)
  });

  FormServicios = new UntypedFormGroup({
    etipomercancia: new UntypedFormControl(null, Validators.required),
    etiposervicio: new UntypedFormControl(null, Validators.required),
    etiposolicitud: new UntypedFormControl(null, Validators.required),
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiServiceSolicitudServicios: apiServiceSolicitudServicios,
    private api: classApiCatalogo,
    private spinner: NgxSpinnerService,
    private serviceDatosUsuario: serviceDatosUsuario,
    private serviceCatalogos: serviceCatalogos,
    private apiCliente: apiCliente,

  ) {
    this.listDetallesBien = [];

  }

  //funcion para evitar que los usuarios abandonen accidentalmente una ruta / página
  canDeactivate(): Observable<boolean> | boolean {
    if (this.unSaved) {
      const result = window.confirm('Hay cambios sin guardar, ¿desea descartarlos?');
      return of(result);
    }
    return true;
  }

  ngOnInit(): void {
    //Consultar los clientes
    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        this.e_procesar_datos_clientes(response)
      }
    )
    ///////////////////////////////////////////////////////////


    //Default
    this.submitGuardar = false;
    this.submitBien = false;
    this.submitDetalleBien = false;


    //Api catalogos para los selects
    //Catalogo de naviera
    this.spinner.show();

    //Catalogo de metodo de pago
    this.datosMetodoPago = this.serviceCatalogos.catalogoMetodoPago

    //Catalogo bancos
    this.datosBancos = this.serviceCatalogos.catalogoBancos

    //Catalogo Cfdi
    this.datosCfdi = this.serviceCatalogos.catalogoCfdi

    //Catalogo embalaje
    let datoEmbalaje = {
      ecodembalaje: null,
      tnombre: 'SELECCIONAR'
    }
    this.datosEmbalaje = this.serviceCatalogos.catalogoEmbalajes
    this.datosEmbalaje.push(datoEmbalaje)


    //Catalogo naviera
    let datoNaviera = {
      ecodnaviera: null,
      tnombre: 'SELECCIONAR'
    }
    this.datosNaviera = this.serviceCatalogos.catalogoNavieras
    this.datosNaviera.push(datoNaviera)


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


    /*this.api.GetNavieras().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosNaviera.push(dato);
      });
    })

    //Catalogo de Embalajes
    this.api.GetEmbalajes().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosEmbalaje.push(dato);
      });
    })*/

    //Catalogo de Tipos de contenedores
    this.api.GetTipoContenedores().subscribe(data => {
      let dato = {
        id: null,
        ttipo: 'SELECCIONAR'
      }
      this.datosTipoContenedor = data;
      this.datosTipoContenedor.push(dato)

    })



    //Spinner Hide
    this.spinner.hide();

    this.id = this.route.snapshot.params['id'];
    this.eNumeroOrden = this.route.snapshot.params['id'];
    this.e_consultaSolicitud(this.id);


    //// Configurar el select2

    $('#ecliente').on('eValorCliente', (ev, dato) => {
      //////console.log('Datos:'+dato)
      this.e_procesarDirecciones(dato)
    });


    $(document).ready(function () {
      //$('.select2').select2(); //initialize 
      (<any>$('.select2')).select2();
    });

    $(".select2").on("select2:select", function (e) {
      let dato_rfc: any = $(e.currentTarget).val()!
      //console.log(dato_rfc)
      //$('#ecliente').val(dato_rfc).trigger("change");
      let parametros = {
        ecliente: dato_rfc
      }
      $('#ecliente').trigger('eValorCliente', parametros);
    });

    ////////////////////////////////

    //Consultar los tipos de servicios
    let parametroServicios = {
      tunidad: "BIENES",
      tservicio: "MOVIMIENTO"
    }

    this.apiServiceSolicitudServicios.postConsultarTiposServicios(parametroServicios).subscribe(
      (response) => {
        //this.arratipoServicios =  response
        this.e_procesarDatosServicios(response);
        // this.e_procesar_datos_clientes(response)
        //this.rowData =  response
        ////console.log(response);
      }
    )

    //Selected
    this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    this.FormDatosBien.controls['ttramite'].setValue(null);
    //this.FormDatosBien.controls['ttipocarga'].setValue(null);
    this.FormDatosBien.controls['ttipocontenedor'].setValue(null);


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


  /// Alertas
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      html: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitGuardar = false;
        this.submitBien = false;
        this.submitDetalleBien = false;
        this.unSaved = false

        if (result.isConfirmed && datos['tipo'] == 'success') {
          this.unSaved = false
          this.router.navigate(['dashboard/customer/serviciocarga/detalle', this.lbletransaccion]);
        }
      }
    })
  }


  alertaConfirm(dato: any, callback: any) {
    let valor: boolean = false;
    Swal.fire({
      title: 'ATENCIÓN',
      html: dato['text'],
      icon: dato['tipo'],
      showCancelButton: true,
      confirmButtonColor: '#22bab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(valor);
      }
    })
    return valor;
  }

  // Procesar los datos del cliente
  e_procesar_datos_clientes(datos: any) {
    ////console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);

    })*/
    this.datosClientes = datos.data
  }

  /// onChange's
  onChangeEmbalajeBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    this.FormDatosBien.get('tembalaje')?.setValue(dato);
  }


  onChangeEmbalajeDetalleBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    this.FormDatosDetalleBien.get('tembalaje')?.setValue(dato);
  }


  onChangeNaviera(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    this.FormDatosBien.get('tnaviera')?.setValue(dato);
  }


  /////////////////////////////////////////////////////////////////////////////


  /// Consulta de manifiesto
  e_consultaSolicitud(idtransaccion: any) {

    // Root
    //let RootConsultaUnManifiesto: IRootConsultaUnManifiesto;
    //let IconsultaUnManifiesto: IconsultaUnManifiesto;
    //let Icredencial: Icredencial;
    let Iparametros: Iparametros;

    let productos: any = [];

    Iparametros = {
      etransaccion: idtransaccion
    }



    this.apiServiceSolicitudServicios.postConsultarSolicitudServicio(Iparametros).subscribe(
      data => {
        //this.bienesServicios = data.mercancias
        ////console.log(data.mercancias)
        this.e_procesarConsultaSolicitud(data)
      }
    )


  }

  e_procesarConsultaSolicitud(datos?: any) {

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

    let contadorBien: number = 0;


    let sellos: any = [];

    //Estatus de la solicitud
    this.testatus = datos.testatus;



    //Mercancia(s)
    IListadoCargas = [];

    // Datos del contacto
    this.FormSolicitudEntrada = new UntypedFormGroup({
      ecliente: new UntypedFormControl(datos.ecliente, Validators.required),
      edireccion: new UntypedFormControl(datos.edireccion, Validators.required),
      emetodopago: new UntypedFormControl(datos.emetodopago, Validators.required),
      ebanco: new UntypedFormControl(datos.ebanco, Validators.required),
      ecfdi: new UntypedFormControl(datos.ecfdi, Validators.required),
      ecuenta: new UntypedFormControl(datos.ecuenta, Validators.required),
      tmoneda: new UntypedFormControl(datos.tmoneda, Validators.required),
      fhfechaservicio: new UntypedFormControl(datos.fhfechaservicio, Validators.required),
      tcorreo: new UntypedFormControl(datos.tcorreo, [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]),
      ttelefono: new UntypedFormControl(datos.ttelefono, [Validators.required,
      Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
      ]),
      treferencia: new UntypedFormControl(datos.treferencia, null),
      tobservaciones: new UntypedFormControl(datos.tobservaciones, null)
    });

    //Servicios
    this.servicios = datos.servicios

    // Set Label's
    this.lbletransaccion = datos.etransaccion;
    this.lblfhfecharegistro = datos.fhfecharegistro;
    this.lbltnombreprogramo = 'PENDIENTE';
    this.lblttelefono = datos.ttelefono;
    this.lbltcorreo = datos.tcorreo;

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


    datos['bienes'].forEach((datocarga: any, index: any) => {

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

        this.datosEmbalaje.forEach((embalaje: any, index: any) => {
          if (embalaje['ecodembalaje'] == datoMercancia['ecodembalaje']) {
            tnombreEmbalaje = embalaje['tnombre']
          }
        });





        Imercancia = {
          edetalleguia: datoMercancia['edetalleguia'],
          tfacturas: datoMercancia['tfacturas'],
          tmarcas: datoMercancia['tmarcas'],
          tdescripcion: datoMercancia['tdescripcion'],
          ecantidad: datoMercancia['ecantidad'],
          epesobruto: datoMercancia['epesobruto'],
          epesoneto: datoMercancia['epesoneto'],
          tembalaje: tnombreEmbalaje,
          ecodembalaje: datoMercancia['ecodembalaje'],
          evolumen: datoMercancia['evolumen'],
          idSequenceDetalleBien: contadorDetallesBien
        }

        contadorDetallesBien++;

        IListadoMercancias.push(Imercancia);


      });


      Icarga = {
        eguia: datocarga.eguia,
        idsequence: contadorBien,
        tembalaje: tnombreEmbalajeMercancia,
        ecodembalaje: datocarga['ecodembalaje'],
        tnaviera: tnombreNaviera,
        ecodnaviera: datocarga['ecodnaviera'],
        tmarcas: datocarga['tmarcas'],
        ttipocontenedor: datocarga['ttipocontenedor'],
        epesoneto: datocarga['epesoneto'],
        epesobruto: datocarga['epesobruto'],
        ebultos: datocarga['ecantidad'],
        ttramite: datocarga['ttramite'],
        //ttipocarga: datocarga['ttipocarga'],
        tsellos: sellos.join('/'),
        texistencia: datocarga.texistencia,
        detallesbien: IListadoMercancias
      }

      contadorBien++;

      IListadoCargas.push(Icarga);

      // Change select2 
      $('.select2').val(datos.ecliente).trigger('change');
      let parametros = {
        ecliente: datos.ecliente
      }
      $('#ecliente').trigger('eValorCliente', parametros);
      /////////////////////////////////////////////////////

    });


    this.listDatosCarga = IListadoCargas;


  }


  ///////// Contacto /////////
  //
  get fcontacto() { return this.FormSolicitudEntrada.controls; }


  ///////// Detalle Mercancias  /////////
  e_mercancias(datos: any) {

    ////console.log(datos);

    //Carga(s)
    let Icarga: Icarga;
    //let IListadoCargas: Array<Icarga> = [];

    //Auxiliares
    let tnombreNaviera = '';
    let tnombreEmbalaje = '';
    let sellos: any = [];

    // Busco los textos de los catalogos de la naviera ya los tengo a la mano
    this.datosNaviera.forEach((naviera: any, navindex: any) => {
      if (naviera['ecodnaviera'] == datos['ecodnaviera']) {
        tnombreNaviera = naviera['tnombre']
      }
    });

    this.datosEmbalaje.forEach((embalaje: any, index: any) => {
      if (embalaje['ecodembalaje'] == datos['ecodembalaje']) {
        tnombreEmbalaje = embalaje['tembalaje']
      }
    });



    //IListadoCargas.push(Icarga);

    // Lo cargo todo para el table
    this.datosBien = datos;

    //En caso de que el bien ya tenga cargado los detalles del bien se pinta  entonces !!!
    if (Boolean(this.datosBien.detallesbien) == true) {
      this.listDetallesBien = this.datosBien.detallesbien
    }




    //Show Hidden div's
    this.divCarga = false;
    this.divMercancia = true;

    //Reset al form de  detalle mercancias
    this.FormDatosDetalleBien.reset();
    this.submitDetalleBien = false;

    //Reser el form de los detalles del bien 
    /*this.FormDatosDetalleBien = new FormGroup({
      idSequenceDetalleBien: new FormControl('', null),
      edetalleguia: new FormControl(0, Validators.required),
      tfacturas: new FormControl('', Validators.required),
      tmarcas: new FormControl('', Validators.required),
      tdescripcion: new FormControl('', Validators.required),
      ecantidad: new FormControl('', Validators.required),
      epesobruto: new FormControl('', Validators.required),
      epesoneto: new FormControl('', Validators.required),
      evolumen: new FormControl('', Validators.required),
      ecodembalaje: new FormControl('', Validators.required),
      tembalaje: new FormControl('', Validators.required)
    });*/

    //Reset Form
    this.FormDatosDetalleBien = new UntypedFormGroup({
      idSequenceDetalleBien: new UntypedFormControl('', null),
      edetalleguia: new UntypedFormControl(0, Validators.required),
      tfacturas: new UntypedFormControl('', Validators.required),
      tmarcas: new UntypedFormControl('', Validators.required),
      tdescripcion: new UntypedFormControl('', Validators.required),
      ecantidad: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesoneto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      evolumen: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]),
      ecodembalaje: new UntypedFormControl('', Validators.required),
      tembalaje: new UntypedFormControl('', Validators.required)
    });


  }


  e_carga(datos: any) {

    //Clear
    this.listDetallesBien = [];

    // Reset submit
    this.submitBien = false;

    //Show o Hidden div
    this.divCarga = true;
    this.divMercancia = false;

    //Reser Form detalle biene
    //Reset Form
    this.FormDatosDetalleBien = new UntypedFormGroup({
      idSequenceDetalleBien: new UntypedFormControl('', null),
      edetalleguia: new UntypedFormControl(0, Validators.required),
      tfacturas: new UntypedFormControl('', Validators.required),
      tmarcas: new UntypedFormControl('', Validators.required),
      tdescripcion: new UntypedFormControl('', Validators.required),
      ecantidad: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesoneto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      evolumen: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]),
      ecodembalaje: new UntypedFormControl('', Validators.required),
      tembalaje: new UntypedFormControl('', Validators.required)
    });


  }


  //Editar el detalles del bien
  e_editarDetalleBien(dato: any) {

    // Set value del sequence
    this.idSequenceDetalleBien.nativeElement.value = dato.idSequenceDetalleBien;

    this.FormDatosDetalleBien = new UntypedFormGroup({
      idSequenceDetalleBien: new UntypedFormControl(dato.idSequenceDetalleBien, null),
      edetalleguia: new UntypedFormControl(dato.edetalleguia, null),
      tfacturas: new UntypedFormControl(dato.tfacturas, Validators.required),
      tmarcas: new UntypedFormControl(dato.tmarcas, Validators.required),
      tdescripcion: new UntypedFormControl(dato.tdescripcion, Validators.required),
      ecantidad: new UntypedFormControl(dato.ecantidad, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl(dato.epesobruto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesoneto: new UntypedFormControl(dato.epesoneto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      evolumen: new UntypedFormControl(dato.evolumen, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      ecodembalaje: new UntypedFormControl(dato.ecodembalaje, Validators.required)
    });


    /*this.FormDatosDetalleBien = new FormGroup({
      idSequenceDetalleBien: new FormControl(dato.idSequenceDetalleBien, null),
      edetalleguia: new FormControl(dato.edetalleguia, null),
      tfacturas: new FormControl(dato.tfacturas, Validators.required),
      tmarcas: new FormControl(dato.tmarcas, Validators.required),
      tdescripcion: new FormControl(dato.tdescripcion, Validators.required),
      ecantidad: new FormControl(dato.ecantidad, Validators.required),
      epesobruto: new FormControl(dato.epesobruto, Validators.required),
      epesoneto: new FormControl(dato.epesoneto, Validators.required),
      evolumen: new FormControl(dato.evolumen, Validators.required),
      tembalaje: new FormControl(dato.tembalaje, Validators.required),
      ecodembalaje: new FormControl(dato.ecodembalaje, Validators.required)
    });*/
  }
  //Eliminar los detalle del bien
  e_eliminarDetalleBien(datoDetalleBien: any) {
    this.listDetallesBien.forEach((dato: any, valor: any) => {
      if (dato.idSequenceDetalleBien == datoDetalleBien.idSequenceDetalleBien) {
        this.listDetallesBien.splice(valor, 1);
      }
    })
  }

  // Valido datos de form
  get fdetallebien() { return this.FormDatosDetalleBien.controls; }

  e_agregarDetalleBien(dato: any) {

    ////console.log('Agregar detalle bien...')
    ////console.log(dato)

    //Get id sequence
    dato.idSequenceDetalleBien = this.idSequenceDetalleBien.nativeElement.value;

    ////console.log(dato.idSequenceDetalleBien)


    // Stop en caso de detectar error
    this.submitDetalleBien = true;

    if (this.FormDatosDetalleBien.invalid) {
      ////console.log('error!')
      return;
    }



    let datosDetalleBien: any = {}

    //datosDetalleBien.edetalleguia = dato.idSequenceDetalleBien;
    datosDetalleBien.edetalleguia = dato.edetalleguia;
    datosDetalleBien.tfacturas = dato.tfacturas;
    datosDetalleBien.tmarcas = dato.tmarcas;
    datosDetalleBien.tdescripcion = dato.tdescripcion;
    datosDetalleBien.ecantidad = dato.ecantidad;
    datosDetalleBien.epesobruto = dato.epesobruto;
    datosDetalleBien.epesoneto = dato.epesoneto;
    datosDetalleBien.evolumen = dato.evolumen;
    datosDetalleBien.ecodembalaje = dato.ecodembalaje;


    datosDetalleBien.tembalaje = dato.tembalaje;


    // Insert da inicio a la sequencen
    if (this.listDetallesBien.length == 0) {

      //Sequence
      datosDetalleBien.idSequenceDetalleBien = (this.listDetallesBien.length);

      this.listDetallesBien.push(datosDetalleBien);
    } else {

      //Verificar si existe la sequence
      if (Boolean(this.listDetallesBien[dato.idSequenceDetalleBien]) == true) {
        ////console.log('Actualizando...');

        this.listDetallesBien[dato.idSequenceDetalleBien].edetalleguia = datosDetalleBien.edetalleguia;
        this.listDetallesBien[dato.idSequenceDetalleBien].tfacturas = datosDetalleBien.tfacturas;
        this.listDetallesBien[dato.idSequenceDetalleBien].tmarcas = datosDetalleBien.tmarcas;
        this.listDetallesBien[dato.idSequenceDetalleBien].tdescripcion = datosDetalleBien.tdescripcion;
        this.listDetallesBien[dato.idSequenceDetalleBien].ecantidad = datosDetalleBien.ecantidad;
        this.listDetallesBien[dato.idSequenceDetalleBien].epesobruto = datosDetalleBien.epesobruto;
        this.listDetallesBien[dato.idSequenceDetalleBien].epesoneto = datosDetalleBien.epesoneto;
        this.listDetallesBien[dato.idSequenceDetalleBien].evolumen = datosDetalleBien.evolumen;
        this.listDetallesBien[dato.idSequenceDetalleBien].ecodembalaje = datosDetalleBien.ecodembalaje;
        this.listDetallesBien[dato.idSequenceDetalleBien].tembalaje = datosDetalleBien.tembalaje;


      } else {
        ////console.log('Insert...');
        //Sequence

        datosDetalleBien.idSequenceDetalleBien = (this.listDetallesBien.length);

        this.listDetallesBien.push(datosDetalleBien);

        //this.listDatosCarga.push(this.carga);

      }
    }


    this.datosBien.detallesbien = this.listDetallesBien;


    //Reset
    this.submitDetalleBien = false;

    // RESET


    this.FormDatosDetalleBien = new UntypedFormGroup({
      idSequenceDetalleBien: new UntypedFormControl('', null),
      edetalleguia: new UntypedFormControl(0, Validators.required),
      tfacturas: new UntypedFormControl('', Validators.required),
      tmarcas: new UntypedFormControl('', Validators.required),
      tdescripcion: new UntypedFormControl('', Validators.required),
      ecantidad: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesoneto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      evolumen: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]),
      ecodembalaje: new UntypedFormControl('', Validators.required),
      tembalaje: new UntypedFormControl('', Validators.required)
    });



  }

  ///////// Mercancia /////////
  get fbien() { return this.FormDatosBien.controls; }

  e_agregarBien(dato: any) {

    //.log('Agregar bien...')
    ////console.log(dato)

    //Get idsequence
    let idSecuenceBien = this.idsequence.nativeElement.value


    //Validamos el Forms
    this.submitBien = true;

    // Stop en caso de detectar error
    if (this.FormDatosBien.invalid) {
      ////console.log('error.');
      return;
    }


    //Clear
    this.datoBien = {};

    this.datoBien.eguia = dato.eguia;
    this.datoBien.tembalaje = dato.tembalaje;
    this.datoBien.ecodembalaje = dato.ecodembalaje;
    this.datoBien.tnaviera = dato.tnaviera;
    this.datoBien.ecodnaviera = dato.ecodnaviera;
    this.datoBien.tmarcas = dato.tmarcas;
    this.datoBien.ttipocontenedor = dato.ttipocontenedor;
    this.datoBien.epesoneto = dato.epesoneto;
    this.datoBien.epesobruto = dato.epesobruto;
    this.datoBien.ebultos = dato.ebultos;
    this.datoBien.ttramite = dato.ttramite;
    //this.datoBien.ttipocarga = dato.ttipocarga;
    this.datoBien.tsellos = dato.tsellos;


    // Insert da inicio a la sequencen
    if (this.listDatosCarga.length == 0) {

      //Sequence
      this.datoBien.idsequence = (this.listDatosCarga.length);

      this.listDatosCarga.push(this.datoBien);

    } else {

      //Verificar si existe la sequence
      if (Boolean(this.listDatosCarga[idSecuenceBien]) == true) {
        ////console.log('Actualizando...');


        this.listDatosCarga[idSecuenceBien].tembalaje = this.datoBien.tembalaje;
        this.listDatosCarga[idSecuenceBien].ecodembalaje = this.datoBien.ecodembalaje;
        this.listDatosCarga[idSecuenceBien].tnaviera = this.datoBien.tnaviera;
        this.listDatosCarga[idSecuenceBien].ecodnaviera = this.datoBien.ecodnaviera;
        this.listDatosCarga[idSecuenceBien].tmarcas = this.datoBien.tmarcas;
        this.listDatosCarga[idSecuenceBien].ttipocontenedor = this.datoBien.ttipocontenedor;
        this.listDatosCarga[idSecuenceBien].epesoneto = this.datoBien.epesoneto;
        this.listDatosCarga[idSecuenceBien].epesobruto = this.datoBien.epesobruto;
        this.listDatosCarga[idSecuenceBien].ebultos = this.datoBien.ebultos;
        this.listDatosCarga[idSecuenceBien].ttramite = this.datoBien.ttramite;
        //this.listDatosCarga[idSecuenceBien].ttipocarga = this.datoBien.ttipocarga;
        this.listDatosCarga[idSecuenceBien].tsellos = this.datoBien.tsellos;

      } else {
        ////console.log('Insert...');
        //Sequence
        this.datoBien.idsequence = (this.listDatosCarga.length);

        this.listDatosCarga.push(this.datoBien);

      }

    }

    //Final
    ////console.log(this.listDatosCarga);

    //Reset
    //this.FormDatosBien.reset()


    //////console.log(form);
    this.submitBien = false;

    //Reset
    this.FormDatosBien = new UntypedFormGroup({
      idsequence: new UntypedFormControl('', null),
      eguia: new UntypedFormControl(0, Validators.required),
      tembalaje: new UntypedFormControl('', Validators.required),
      ecodembalaje: new UntypedFormControl('', Validators.required),
      tnaviera: new UntypedFormControl('', Validators.required),
      ecodnaviera: new UntypedFormControl('', Validators.required),
      tmarcas: new UntypedFormControl('', Validators.required),
      ttipocontenedor: new UntypedFormControl('', Validators.required),
      epesoneto: new UntypedFormControl('', [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
        this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ebultos: new UntypedFormControl('', [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ttramite: new UntypedFormControl('', Validators.required),
      //ttipocarga: new UntypedFormControl('', Validators.required),
      tsellos: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })

    //Selected
    this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    this.FormDatosBien.controls['ttramite'].setValue(null);
    //this.FormDatosBien.controls['ttipocarga'].setValue(null);
    this.FormDatosBien.controls['ttipocontenedor'].setValue(null);

  }

  e_editarBien(dato: any) {
    ////console.log('Editar bien...')
    ////console.log(dato)

    //Reset
    this.FormDatosBien.reset();

    //Load datos
    /*this.FormDatosBien = new FormGroup({
      idsequence: new FormControl(dato.idsequence, null),
      eguia: new FormControl(dato.eguia, Validators.required),
      tembalaje: new FormControl(dato.tembalaje, Validators.required),
      ecodembalaje: new FormControl(dato.ecodembalaje, Validators.required),
      tnaviera: new FormControl(dato.tnaviera, Validators.required),
      ecodnaviera: new FormControl(dato.ecodnaviera, Validators.required),
      tmarcas: new FormControl(dato.tmarcas, Validators.required),
      ttipocontenedor: new FormControl(dato.ttipocontenedor, Validators.required),
      epesoneto: new FormControl(dato.epesoneto, Validators.required),
      epesobruto: new FormControl(dato.epesobruto, Validators.required),
      ebultos: new FormControl(dato.ebultos, Validators.required),
      ttramite: new FormControl(dato.ttramite, Validators.required),
      ttipocarga: new FormControl(dato.ttipocarga, Validators.required),
      tsellos: new FormControl(dato.tsellos, Validators.required)

    })*/

    this.FormDatosBien = new UntypedFormGroup({
      idsequence: new UntypedFormControl(dato.idsequence, null),
      eguia: new UntypedFormControl(dato.eguia, Validators.required),
      tembalaje: new UntypedFormControl(dato.tembalaje, Validators.required),
      ecodembalaje: new UntypedFormControl(dato.ecodembalaje, Validators.required),
      tnaviera: new UntypedFormControl(dato.tnaviera, Validators.required),
      ecodnaviera: new UntypedFormControl(dato.ecodnaviera, Validators.required),
      tmarcas: new UntypedFormControl(dato.tmarcas, Validators.required),
      ttipocontenedor: new UntypedFormControl(dato.ttipocontenedor, Validators.required),
      epesoneto: new UntypedFormControl(dato.epesoneto, [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
        this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl(dato.epesobruto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ebultos: new UntypedFormControl(dato.ebultos, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ttramite: new UntypedFormControl(dato.ttramite, Validators.required),
      //ttipocarga: new UntypedFormControl(dato.ttipocarga, Validators.required),
      tsellos: new UntypedFormControl(dato.tsellos, [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })


  }

  //Eliminar Bien
  e_eliminarBien(datosBien: any) {
    this.listDatosCarga.forEach((dato: any, valor: any) => {
      if (dato.idsequence == datosBien.idsequence) {
        this.listDatosCarga.splice(valor, 1);
      }
    })
  }

  ///////// Guardar /////////

  e_guardar(datos: any) {

    //console.log('solicitud')
    //console.log(datos)

    //Seguridad
    //let localData = localStorage.getItem("token");
    //let seguridad = localData ? JSON.parse(localData) : [];

    //El resto del fomulario
    this.submitGuardar = true;

    // Stop en caso de error
    if (this.FormSolicitudEntrada.invalid) {
      ////console.log('error');
      return;
    }

    // Interfaces
    let IdetalleMercancia: Idetallemercancias;
    let IlistaDetMercancias: Array<Idetallemercancias> = [];

    let Isellos: Isellos;
    let IlistaSellos: Array<Isellos> = [];

    let Imercancia: any;
    let IlistaMercancia: Array<Imercancias> = [];

    let Isolicitud: any;

    let arrServivios: Array<any> = []


    let estado: string = 'OK!'
    let mensaje: string = ''

    //let IrectificaUnManifiesto: IrectificaUnManifiesto;
    //let IRootrectificaUnManifiesto: IRootrectificaUnManifiesto;


    //Proceso los datos
    ////console.log('datos');
    ////console.log(this.listDatosCarga);

    //Revisar servicios agregados
    //SERVICIOS
    if (this.servicios.length == 0) {
      estado = 'ERROR!'
      mensaje += 'NO SE DETECTA SERVICIOS AGREGADO PARA ESTA OPERACIÓN\n';
    }

    //Revisar registros
    if (this.listDatosCarga.length == 0) {

      /* let alertaCarga: any = {};
 
       alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
       alertaCarga['tipo'] = 'warning';
       alertaCarga['footer'] = '';
       this.alerta(alertaCarga);*/

      estado = 'ERROR!'
      mensaje += 'NO SE DETECTA SERVICIOS AGREGADO PARA ESTA OPERACIÓN\n';


    }

    // Validar que existe una bien agregado
    if (estado == 'ERROR!') {

      let alerta: any = {};

      alerta['text'] = mensaje;
      alerta['tipo'] = 'error';
      alerta['footer'] = '';
      this.alerta(alerta);


    } else {

      //Recorrer el array para prepar el json de envio al API

      this.listDatosCarga.forEach((mercancia: any, index: any) => {

        //Clear
        IlistaSellos = [];
        IlistaDetMercancias = [];
        let arrServivios: Array<any> = []


        if (Boolean(mercancia['detallesbien']) == false) {
          let alerta: any = {};
          alerta['text'] = 'CAPTURAR EL DETALLE DE LAS MERCANCIAS';
          alerta['tipo'] = 'warning';
          alerta['footer'] = '';
          this.alerta(alerta);
        }

        //Detalle mercancia(s)
        if (mercancia['detallesbien']) {
          mercancia['detallesbien'].forEach((detmercancia: any, index: any) => {

            IdetalleMercancia = {
              edetalleguia: detmercancia['edetalleguia'],
              tfacturas: detmercancia['tfacturas'],
              ecodpropietario: 0,
              tmarcas: detmercancia['tmarcas'],
              tdescripcion: detmercancia['tdescripcion'],
              ecantidad: detmercancia['ecantidad'],
              epesobruto: detmercancia['epesobruto'],
              epesoneto: detmercancia['epesoneto'],
              ecodembalaje: detmercancia['ecodembalaje'],
              evolumen: detmercancia['evolumen'],
            }
            IlistaDetMercancias.push(IdetalleMercancia);
          });
        }

        // Sello(s)
        let Splitsellos = mercancia['tsellos'].split("/");
        Splitsellos.forEach((datosello: any, index: any) => {
          Isellos = {
            tsello: datosello,
            ttiposello: 'TAPON' // por ahora default
          }
          IlistaSellos.push(Isellos);
        })

        //Mercancia(s)
        Imercancia = {
          eguia: mercancia['eguia'],
          //ttipocarga: mercancia['ttipocarga'],
          ttramite: mercancia['ttramite'],
          ecodnaviera: mercancia['ecodnaviera'],
          ttipocontenedor: mercancia['ttipocontenedor'],
          ecodembalaje: mercancia['ecodembalaje'],
          tmarcas: mercancia['tmarcas'],
          epesobruto: mercancia['epesobruto'],
          epesoneto: mercancia['epesoneto'],
          ecantidad: mercancia['ebultos'],
          sellos: IlistaSellos,
          detallesbien: IlistaDetMercancias
        }
        IlistaMercancia.push(Imercancia);

      })

      ///Servicios
      this.servicios.forEach((dato: any, valor: any) => {
        let valores = {
          eservicio: dato.eservicio
        }
        arrServivios.push(valores)
      })


      //Datos del usuaro por [local storage]
      let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

      Isolicitud = {
        etransaccion: this.eNumeroOrden,
        ecliente: datos.ecliente,
        edireccion: datos.edireccion,
        ttiposolicitud: 'SERVICIO',
        tcorreo: datos.tcorreo,
        treferencia: datos.treferencia,
        emetodopago: datos.emetodopago,
        ebanco: datos.ebanco,
        ecfdi: datos.ecfdi,
        ecuenta: datos.ecuenta,
        tmoneda: datos.tmoneda,
        fhfechaservicio: datos.fhfechaservicio,
        tobservaciones: datos.tobservaciones,
        ttelefono: datos.ttelefono,
        ecodusuario: datosUsuario.ecodusuario,
        servicios: arrServivios,
        bienes: IlistaMercancia,

      }


      //IdatosParametros = { orden: Isolicitud }


      let alerta: any = {};

      alerta['text'] = '¿ DESEA CONTINUAR ? ';
      alerta['tipo'] = 'question';
      alerta['footer'] = '';


      /*this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          this.e_rectificaUnManifiesto(IdatosParametros);
        }
      });*/

      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          //console.log(JSON.stringify(Isolicitud));
          this.e_actualizarSolicitudServicio(Isolicitud);
        }
      });
    }


  }


  /// Procesar API actualizar solicitud
  e_actualizarSolicitudServicio(datos: any) {
    //Consumir el servicio api
    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiServiceSolicitudServicios.postActualizarSolicitudServicioGuia(datos).subscribe(
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
            ////console.log(dato.attributes.text)
            text += dato.attributes.text + '\n'
          })
        }

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "SERVICIO CARGA";

        this.alerta(alerta);
      }
    )
  }

  /*e_rectificaUnManifiesto(datos: any) {

    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiManifiesto.postRectificaUnManifiesto(datos).subscribe(
      (response) => {

        if (response.data) {
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
            if (dato.attributes.order) {
              this.lbletransaccion = dato.attributes.order
            }
          })
        }

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "CLIENTE";
        this.alerta(alerta);
      }
    )

  }*/

  e_consulta() {
    this.router.navigate(['dashboard/customer/serviciocarga/consultar']);
  }

  e_procesarDirecciones(datos: any) {
    ////console.log('datos')
    ////console.log(datos)
    this.FormSolicitudEntrada.controls.ecliente.setValue(datos.ecliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.ecliente == datos.ecliente) {
        ////console.log(dato.direcciones)
        this.datosDirecciones = dato.direcciones
      }
    })
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/serviciocarga/nuevo']);
  }

  //agregar servicios
  get fservicios() { return this.FormServicios.controls; }

  e_agregarServicio(datos: any) {

    console.log('Servicios');
    console.log(datos);

    //Validamos el Forms
    this.submitServicios = true;
    // Stop en caso de detectar error
    if (this.FormServicios.invalid) {
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
        if (datos.etiposolicitud.eservicio == servicio.eservicio) {
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

      if (datos.etiposolicitud > 0) {
        datoservicios = {
          ttipomercancia: datos.etipomercancia.tdescripcion,
          ttiposervicio: datos.etiposervicio.tdescripcion,
          ttiposolicitud: datos.etiposolicitud.tdescripcion,
          eservicio: datos.etiposolicitud.eservicio
        }
      } else {
        datoservicios = {
          ttipomercancia: datos.etipomercancia.tdescripcion,
          ttiposervicio: datos.etiposervicio.tdescripcion,
          ttiposolicitud: datos.etiposolicitud.tdescripcion,
          eservicio: datos.etiposolicitud.eservicio
        }
      }

      this.servicios.push(datoservicios)

      this.FormServicios = new UntypedFormGroup({
        etipomercancia: new UntypedFormControl(null, Validators.required),
        etiposervicio: new UntypedFormControl(null, Validators.required),
        etiposolicitud: new UntypedFormControl(null, Validators.required),
      })
    }

  }

  //Onchange servicio
  e_onChangeServicio(datos: any) {

    this.arrtiposolicitud = []

    //console.log('Servicios')
    //console.log(datos.servicios.length)
    this.arrtiposolicitud = []

    if (datos.childs) {
      if (datos.childs.length > 0) {

        this.ngSelectServicioEspecifico = ''

        //Mostrar especificacion del servicio
        this.divServicioEspecifico = true
        datos.childs.forEach((dato: any, valor: any) => {
          this.arrtiposolicitud.push(dato)
        })
      }
    }
  }
  //Eliminar servicio
  e_eliminar_servicio(datos: any) {
    this.servicios.forEach((servicio: any, valor: any) => {
      if (servicio.eservicio == datos.eservicio) {
        // //console.log('eliminar!');
        this.servicios.splice(valor, 1);
      }
    })
  }
  //Onchage tipo de servicio
  e_onChangeTipoServicio(datos: any) {

    //Ocultar especificacion del servicio
    this.divServicioEspecifico = false

    //Clear
    this.arrservicio = []
    //this.arrtiposolicitud = []

    //Seleccionar primera posicio (reset)
    this.ngSelectServicios = ""
    this.ngSelectServicioEspecifico = ""


    if (datos.childs) {
      datos.childs.forEach((dato: any, valor: any) => {
        this.arrservicio.push(dato)
        /*if (dato.servicios.length > 0) {
          this.arrtiposolicitud = []
          console.log(dato.servicios)
          this.arrtiposolicitud = dato.servicios
        }*/
      })
    }
  }

  //Onchange tipo de carga
  onChangeTipoCarga(datos: any) {

    let error: string = 'OK!';
    let mensaje: string = ''
    let alerta: any = {};



    if (datos != null) {

      if (datos != 'CONTENERIZADA') {
        this.lblSerieMarca = 'Marca'
        this.isReadonly = true
        this.FormDatosBien.controls['ttipocontenedor'].setValue('NA');
        this.FormDatosBien.controls['tsellos'].setValue('NA');
      } else {
        this.lblSerieMarca = 'Contenedor'
        this.isReadonly = false
        this.FormDatosBien.controls['ttipocontenedor'].setValue('');
        this.FormDatosBien.controls['tsellos'].setValue('');
      }


      /*if (this.listDatosCarga.length != 0) {

        this.listDatosCarga.forEach((dato: any, index: any) => {
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

        this.FormDatosBien.controls['ttipocarga'].setValue(null);
      }*/
    }


    /*if (this.listDatosCarga.length == 0) {
 
      let alertaCarga: any = {};
 
      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);
 
    }*/


  }

}
