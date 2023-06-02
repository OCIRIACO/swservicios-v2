import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { Idetallemercancias, Imanifiesto, Imercancias, Iparametros, Isellos } from 'src/app/modelos/solicitudEntradas/notificamanifiesto.interfase';
import { IdatosMercancia } from 'src/app/modelos/datosmercancias.interfase';
import { Router } from '@angular/router';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, Validator, Validators, FormsModule, NgForm, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios'

import * as $ from 'jquery';
import 'select2';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-crear-servicio-carga',
  templateUrl: './crear-servicio-carga.component.html',
  styleUrls: ['./crear-servicio-carga.component.css']
})
export class CrearServicioCargaComponent implements OnInit {


  @ViewChild('idsequence', { static: false }) idsequence!: ElementRef;
  @ViewChild('idSequenceDetalleBien', { static: false }) idSequenceDetalleBien!: ElementRef;


  //Etique  dinamica cuando el selecciona el tipo de carga esto cambia
  lblSerieMarca: string = 'Contenedor'

  //Notificaciones
  lblNotificacionRechazo: string = ''

  //Textarea *comentarion
  maxCaracteres: number = 150
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

  //Otros's
  listDatosCarga: any;
  carga: any;
  datosBien: any;
  listDetallesBienNew: any;
  servicios: Array<any> = []
  arratipoServicios: Array<any> = []
  arrservicio: Array<any> = []
  arrtiposolicitud: Array<any> = []
  listDetallesBien: Array<IdatosMercancia>;
  //datosDetalleBien: IdatosMercancia;


  // Div Show Hidden
  divCarga: boolean = true;
  divMercancia: boolean = false;
  divecodCarga: boolean = true;
  divDetalleBien: boolean = true;
  divServicioEspecifico: boolean = false

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any
  datosTramite: any

  //Submit's
  submitted = false;
  submitBien = false;
  submitDetalleBien = false;
  submitGuardar = false;
  submitServicios = false

  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Forms's
  FormDatosBien = new UntypedFormGroup({
    idsequence: new UntypedFormControl('', null),
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
    tsellos: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
    ])
  })

  FormDatosDetalleBien = new UntypedFormGroup({
    idSequenceDetalleBien: new UntypedFormControl('', null),
    tfactura: new UntypedFormControl('', Validators.required),
    tmarcas: new UntypedFormControl('', Validators.required),
    tdescripcion: new UntypedFormControl('', Validators.required),
    ecantidad: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
    ]),
    epesobruto: new UntypedFormControl('', [
      Validators.required,
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


  FormSolicitudEntrada = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    edireccion: new UntypedFormControl('', Validators.required),
    emetodopago: new UntypedFormControl('', Validators.required),
    ebanco: new UntypedFormControl('', Validators.required),
    ecfdi: new UntypedFormControl('', Validators.required),
    ecuenta: new UntypedFormControl('', [
      Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
    ]),
    tmoneda: new UntypedFormControl('', Validators.required),
    fhfechaservicio: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
    ]),
    treferencia: new UntypedFormControl('', null),
    tobservaciones: new UntypedFormControl('', null)
  })





  datosNaviera: any;
  datosEmbalaje: any;
  datosTipoContenedor: any;

  inputvalue = "";

  lbletransaccion = '';


  keyword = "name"

  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any
  globalIdCliente: any

  constructor(
    private api: classApiCatalogo,
    private apiManifiesto: ApiServiceManifiesto,
    private router: Router,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
    private apiServiceSolicitudServicios: apiServiceSolicitudServicios,

  ) {

    //Clear
    this.listDatosCarga = [];
    this.listDetallesBien = [];
    this.datosNaviera = [];
    this.datosEmbalaje = [];
    this.datosTipoContenedor = [];
    this.datosMetodoPago = [];

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
    this.FormDatosBien.get('tembalaje')?.setValue(dato);
  }

  onChangeDetalleBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    this.FormDatosDetalleBien.get('tembalaje')?.setValue(dato);
  }

  onChangeNaviera(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    this.FormDatosBien.get('tnaviera')?.setValue(dato);
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

    //Date
    const datePipe = new DatePipe('en-Us');
    this.nowFechaServicio = datePipe.transform(new Date(), 'yyyy-MM-dd');


    $('#ecliente').on('eValorCliente', (ev, dato) => {
      ////console.log('Datos:'+dato)
      this.e_procesarDirecciones(dato)
    });


    $(document).ready(function () {
      //$('.select2').select2(); //initialize 
      (<any>$('.select2')).select2();
    });

    $(".select2").on("select2:select", function (e) {
      let dato_rfc: any = $(e.currentTarget).val()!
      console.log(dato_rfc)
      //$('#ecliente').val(dato_rfc).trigger("change");
      let parametros = {
        ecliente: dato_rfc
      }
      $('#ecliente').trigger('eValorCliente', parametros);
    });


    //Catalogo de naviera
    this.api.GetNavieras().subscribe(data => {
      let dato = {
        ecodnaviera: null,
        tnombre: 'SELECCIONAR'
      }
      this.datosNaviera = data;
      this.datosNaviera.push(dato)

    })

    //Catalogo de Embalajes
    this.api.GetEmbalajes().subscribe(data => {
      let dato = {
        ecodembalaje: null,
        tnombre: 'SELECCIONAR'
      }
      this.datosEmbalaje = data;
      this.datosEmbalaje.push(dato)

    })

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
    this.api.GetMetodoPago().subscribe(data => {
      this.datosMetodoPago = data;
    })

    //Catalogo de Bancos
    this.api.GetBancos().subscribe(data => {
      this.datosBancos = data;
    })


    //Catalogo de metodo de pago
    this.api.GetCfdi().subscribe(data => {
      this.datosCfdi = data;
    })

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
        //this.rowData =  response
        ////console.log(response);
      }
    )

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
        //console.log(response);
      }
    )


    //Selected
    this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    this.FormDatosBien.controls['ttramite'].setValue(null);
    //this.FormDatosBien.controls['ttipocarga'].setValue(null);
    this.FormDatosBien.controls['ttipocontenedor'].setValue(null);



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
        this.router.navigate(['dashboard/customer/serviciocarga/detalle', this.etransaccion]);
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

  ///
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
  get f() { return this.FormDatosBien.controls; }


  e_agregarBien(dato: any) {

    ////console.log(dato)
    let idSecuenceBien = this.idsequence.nativeElement.value


    //////console.log(form);
    this.submitBien = true;

    // stop here if form is invalid
    if (this.FormDatosBien.invalid) {
      ////console.log('error.');
      return;
    }


    //Clear
    this.carga = {};

    this.carga.tembalaje = dato.tembalaje;
    this.carga.ecodembalaje = dato.ecodembalaje;
    this.carga.tnaviera = dato.tnaviera;
    this.carga.ecodnaviera = dato.ecodnaviera;
    this.carga.tmarcas = dato.tmarcas;
    this.carga.ttipocontenedor = dato.ttipocontenedor;
    this.carga.epesoneto = dato.epesoneto;
    this.carga.epesobruto = dato.epesobruto;
    this.carga.ebultos = dato.ebultos;
    this.carga.ttramite = dato.ttramite;
    this.carga.ttipocarga = dato.ttipocarga;
    this.carga.tsellos = dato.tsellos;


    // Insert da inicio a la sequencen
    if (this.listDatosCarga.length == 0) {

      //Sequence
      this.carga.idsequence = (this.listDatosCarga.length);

      this.listDatosCarga.push(this.carga);

    } else {

      //Verificar si existe la sequence
      if (Boolean(this.listDatosCarga[idSecuenceBien]) == true) {
        ////console.log('Actualizando...');


        this.listDatosCarga[idSecuenceBien].tembalaje = this.carga['tembalaje'];
        this.listDatosCarga[idSecuenceBien].ecodembalaje = this.carga['ecodembalaje'];
        this.listDatosCarga[idSecuenceBien].tnaviera = this.carga['tnaviera'];
        this.listDatosCarga[idSecuenceBien].ecodnaviera = this.carga['ecodnaviera'];
        this.listDatosCarga[idSecuenceBien].tmarcas = this.carga['tmarcas'];
        this.listDatosCarga[idSecuenceBien].ttipocontenedor = this.carga['ttipocontenedor'];
        this.listDatosCarga[idSecuenceBien].epesoneto = this.carga['epesoneto'];
        this.listDatosCarga[idSecuenceBien].epesobruto = this.carga['epesobruto'];
        this.listDatosCarga[idSecuenceBien].ebultos = this.carga['ebultos'];
        this.listDatosCarga[idSecuenceBien].ttramite = this.carga['ttramite'];
        this.listDatosCarga[idSecuenceBien].ttipocarga = this.carga['ttipocarga'];
        this.listDatosCarga[idSecuenceBien].tsellos = this.carga['tsellos'];

      } else {
        ////console.log('Insert...');
        //Sequence
        this.carga.idsequence = (this.listDatosCarga.length);

        this.listDatosCarga.push(this.carga);

      }

    }


    //Final
    ////console.log(this.listDatosCarga);

    //Reset
    //this.FormDatosBien.reset()

    //////console.log(form);
    this.submitBien = false;

    ///
    // this.idsequence.nativeElement.value = null;

    //Forms's
    this.FormDatosBien = new UntypedFormGroup({
      idsequence: new UntypedFormControl('', null),
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


  e_eliminar(element: any) {
    //////console.log(element);

    this.listDatosCarga.forEach((value: any, index: any) => {
      if (value == element) {
        this.listDatosCarga.splice(index, 1);
        this.FormDatosBien.get('idsequence')?.setValue(this.listDatosCarga.length);
      }
    });
  }

  e_editar(datos: any, idarray: any) {
    //Reset
    //this.FormDatosBien.reset();

    // Set value del sequence
    //this.idsequence.nativeElement.value = datos.idsequence

    //Load datos
    /*this.FormDatosBien = new FormGroup({
      idsequence: new FormControl(datos.idsequence, null),
      tembalaje: new FormControl(datos.tembalaje, Validators.required),
      ecodembalaje: new FormControl(datos.ecodembalaje, Validators.required),
      tnaviera: new FormControl(datos.tnaviera, Validators.required),
      ecodnaviera: new FormControl(datos.ecodnaviera, Validators.required),
      tmarcas: new FormControl(datos.tmarcas, Validators.required),
      ttipocontenedor: new FormControl(datos.ttipocontenedor, Validators.required),
      epesoneto: new FormControl(datos.epesoneto, Validators.required),
      epesobruto: new FormControl(datos.epesobruto, Validators.required),
      ebultos: new FormControl(datos.ebultos, Validators.required),
      ttramite: new FormControl(datos.ttramite, Validators.required),
      ttipocarga: new FormControl(datos.ttipocarga, Validators.required),
      tsellos: new FormControl(datos.tsellos, Validators.required)

    })*/

    this.FormDatosBien = new UntypedFormGroup({
      idsequence: new UntypedFormControl(datos.idsequence, null),
      tembalaje: new UntypedFormControl(datos.tembalaje, Validators.required),
      ecodembalaje: new UntypedFormControl(datos.ecodembalaje, Validators.required),
      tnaviera: new UntypedFormControl(datos.tnaviera, Validators.required),
      ecodnaviera: new UntypedFormControl(datos.ecodnaviera, Validators.required),
      tmarcas: new UntypedFormControl(datos.tmarcas, Validators.required),
      ttipocontenedor: new UntypedFormControl(datos.ttipocontenedor, Validators.required),
      epesoneto: new UntypedFormControl(datos.epesoneto, [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
        this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })
      ]),
      epesobruto: new UntypedFormControl(datos.epesobruto, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ebultos: new UntypedFormControl(datos.ebultos, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      this.regexValidador(new RegExp(this.regNumericLogitud), { 'precision': true })]
      ),
      ttramite: new UntypedFormControl(datos.ttramite, Validators.required),
      //ttipocarga: new UntypedFormControl(datos.ttipocarga, Validators.required),
      tsellos: new UntypedFormControl(datos.tsellos, [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })


  }

  //////////////////////////////////////////////////// DETALLES DE BIEN /////////////////////////////////////////////////////////////

  // convenience getter for easy access to form fields
  get fmercancia() { return this.FormDatosDetalleBien.controls; }


  //agregar Detalles del bien
  e_agregarDetalleBien(dato: any) {

    //Get id sequence
    dato.idSequenceDetalleBien = this.idSequenceDetalleBien.nativeElement.value;

    //.log(dato)

    this.submitDetalleBien = true

    // stop here if form is invalid
    if (this.FormDatosDetalleBien.invalid) {
      ////console.log('error.');
      return;
    }




    let datosDetalleBien: any = {}

    //datosDetalleBien.edetalleguia = dato.idSequenceDetalleBien;
    datosDetalleBien.tfactura = dato.tfactura;
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

        this.listDetallesBien[dato.idSequenceDetalleBien].tfactura = datosDetalleBien.tfacturas;
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


    //Join 
    // //console.log(this.datosBien)
    //this.listDatosCarga[dato.idsequence].bienes = this.listDetallesBien;

    this.datosBien.detallesbien = this.listDetallesBien;


    //////console.log('Despues');
    ////console.log(JSON.stringify(this.datosBien));

    //Reset
    this.submitDetalleBien = false;

    // RESET
    // this.FormDatosDetalleBien.reset();

    //Reset Form
    this.FormDatosDetalleBien = new UntypedFormGroup({
      idSequenceDetalleBien: new UntypedFormControl('', null),
      tfactura: new UntypedFormControl('', Validators.required),
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


    //Set value sequence del detalle del bien
    //this.idSequenceDetalleBien.nativeElement.value = null;


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
        this.FormDatosDetalleBien.get('idSequenceDetalleBien')?.setValue(this.listDetallesBien.length);
      }
    });
  }

  //Editar el detalles del bien
  e_editarDetalleBien(dato: any) {

    // Set value del sequence
    this.idSequenceDetalleBien.nativeElement.value = dato.idSequenceDetalleBien;



    this.FormDatosDetalleBien = new UntypedFormGroup({
      tfactura: new UntypedFormControl(dato.tfactura, Validators.required),
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



  }

  e_carga(datos: any) {


    //Clear
    this.listDetallesBien = [];

    //Show Hidden div
    this.divCarga = true;
    this.divMercancia = false;


  }


  //////////////////////////////////// CONTACTO /////////////////////////////////////////

  // convenience getter for easy access to form fields
  get fcontacto() { return this.FormSolicitudEntrada.controls; }


  e_guardar(datos: any) {

    ////console.log(datos);


    //Validar datos del contacto
    this.submitGuardar = true;

    // stop y valido
    if (this.FormSolicitudEntrada.invalid) {
      ////console.log('error.');
      return;
    }



    if (this.listDatosCarga.length == 0) {

      let alertaCarga: any = {};

      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);

    }


    ////console.log('Antes');
    ////console.log(JSON.stringify(this.listDatosCarga));


    if (this.listDatosCarga.length != 0) {

      // Procesando datos

      // Interfaces
      //let rootNotifaManifiesto: IRootNotificaUnManifiesto;

      //let datosNotificaManifiesto: InotificaManifiesto;

      let Isolicitud: any;
      let arrServivios: Array<any> = []

      //let datosCredencial: Icredencial;

      let datosParametros: Iparametros;


      //let carga: Imercancias;
      let carga:  any = [];
      let listaCarga: Array<Imercancias> = [];

      let sellos: Isellos;
      let listaSellos: Array<Isellos> = [];


      let mercancia: Idetallemercancias;
      let listaMercancias: Array<Idetallemercancias> = [];



      this.listDatosCarga.forEach((dato: any, index: any) => {
        ////console.log(index);
        ////console.log(dato['idsequence']);

        //clear
        listaMercancias = []
        listaSellos = []


        if (Boolean(dato['detallesbien']) == false) {

          let alerta: any = {};

          alerta['text'] = 'CAPTURAR EL DETALLE DE LAS MERCANCIAS';
          alerta['tipo'] = 'warning';
          alerta['footer'] = '';
          this.alerta(alerta);

        }

        //DETALLE MERCANCIA
        if (dato['detallesbien']) {
          dato['detallesbien'].forEach((datomercancias: any, index: any) => {
            mercancia = {
              tfactura: datomercancias['tfactura'],
              ecodpropietario: datomercancias['ecodpropietario'],
              tmarcas: datomercancias['tmarcas'],
              tdescripcion: datomercancias['tdescripcion'],
              ecantidad: datomercancias['ecantidad'],
              epesobruto: datomercancias['epesobruto'],
              epesoneto: datomercancias['epesoneto'],
              ecodembalaje: datomercancias['ecodembalaje'],
              evolumen: datomercancias['evolumen'],
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
          ttramite: dato['ttramite'],
          ecodnaviera: dato['ecodnaviera'],
          ttipocontenedor: dato['ttipocontenedor'],
          ecodembalaje: dato['ecodembalaje'],
          tmarcas: dato['tmarcas'],
          epesobruto: dato['epesobruto'],
          epesoneto: dato['epesoneto'],
          ecantidad: dato['ebultos'],
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


      Isolicitud = {
        ecliente: datos.ecliente,
        edireccion: datos.edireccion,
        emetodopago: datos.emetodopago,
        ebanco: datos.ebanco,
        ecfdi: datos.ecfdi,
        ecuenta: datos.ecuenta,
        tmoneda: datos.tmoneda,
        ttiposolicitud: 'SERVICIO',
        tcorreo: datos.tcorreo,
        ttelefono: datos.ttelefono,
        treferencia: datos.treferencia,
        fhfechaservicio: datos.fhfechaservicio,
        tobservaciones: datos.tobservaciones,
        ecodusuario: datosUsuario.ecodusuario,
        servicios: arrServivios,
        bienes: listaCarga
      }


      datosParametros = { orden: Isolicitud }



      let alerta: any = {};

      alerta['text'] = 'DESEA CONTINUAR ? ';
      alerta['tipo'] = 'question';
      alerta['footer'] = '';


      this.alertaConfirm(alerta, (confirmed: boolean) => {
        if (confirmed == true) {
          //this.enotificarManifiesto(datosParametros);
          // console.log(datosParametros)
          //console.log(JSON.stringify(Isolicitud));
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
    this.apiServiceSolicitudServicios.postCrearSolicitudServicioGuia(datos).subscribe(
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

  //Redirecionar al reporte de consultar
  e_consulta() {
    this.router.navigate(['dashboard/customer/serviciocarga/consultar']);
  }

  e_procesarDirecciones(datos: any) {
    //console.log('datos')
    //console.log(datos)
    this.FormSolicitudEntrada.controls.ecliente.setValue(datos.ecliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.ecliente == datos.ecliente) {
        //console.log(dato.direcciones)
        this.datosDirecciones = dato.direcciones
      }
    })
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

  //Onchage servicio
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

  //Onchage servicios
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
        // console.log('eliminar!');
        this.servicios.splice(valor, 1);
      }
    })
  }


  //Agregar servicio(s)
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
          if (datos.etiposolicitud.eservicio == servicio.eservicio){
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
          ttiposolicitud:datos.etiposolicitud.tdescripcion,
          eservicio: datos.etiposolicitud.eservicio
        }
      } else {
        datoservicios = {
          ttipomercancia: datos.etipomercancia.tdescripcion,
          ttiposervicio: datos.etiposervicio.tdescripcion,
          ttiposolicitud:datos.etiposolicitud.tdescripcion,
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
