import { Component, ElementRef, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validator, Validators, FormsModule, NgForm, ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { Iparametros } from 'src/app/modelos/solicitudEntradas/datosconsultamanifiesto.interfase';
import { Icarga, Imercancia } from 'src/app/modelos/solicitudEntradas/datosformulariomanifiesto.interfase';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Idetallemercancias, Imanifiesto, Imercancias, Isellos, IparametrosEditar } from 'src/app/modelos/solicitudEntradas/rectificamanifiesto.interfase';
import { GlobalConstants } from 'src/app/modelos/global';
import { IdatosMercancia } from 'src/app/modelos/datosmercancias.interfase';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { DatePipe } from '@angular/common';

import * as $ from 'jquery';
import 'select2';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-editarmanifiesto',
  templateUrl: './editarmanifiesto.component.html',
  styleUrls: ['./editarmanifiesto.component.css']
})

export class EditarmanifiestoComponent implements OnInit {

  @ViewChild('solicitudForm') ngformsolicitudentrada: NgForm;

  //
  etransaccion: number = 0;

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Textarea *comentarion
  maxCaracteres: number = 150
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;
  isReadonly: boolean = false

  //Now DATE
  nowFechaServicio: any;

  //@ViewChild("myNameElem") myNameElem: ElementRef;
  tmarcas = ''

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  respuestaConfirmar: any;
  seleccion: any;
  seleccionNaviera: any;

  //Change's
  //changeCount = 0;
  //changeCountMercancia = 0;

  //Otros's
  bienes: any = [];
  carga: any;
  datosBien: any = {};
  listDetallesBienNew: any;

  listDetallesBien: Array<IdatosMercancia>;
  //datosDetalleBien: IdatosMercancia;


  // Div Show Hidden
  divCarga: boolean = true;
  divMercancia: boolean = false;
  divecodCarga: boolean = false;
  divDetalleBien: boolean = true;

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any
  datosTramite: any


  //Contador rows tables
  contadorRowBien: number = 1;


  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Forms's
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
    ttramite: new FormControl('', Validators.required),
    ttipocarga: new FormControl('', Validators.required),
    tsellos: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
    ])
  })

  FormDatosDetallesBien = new FormGroup({
    econtadorRow: new FormControl(0, null),
    tfactura: new FormControl('', Validators.required),
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

  FormSolicitudEntrada = new FormGroup({
    //trfc: new FormControl('', Validators.required),
    cliente: new FormControl('', Validators.required),
    edireccion: new FormControl('', Validators.required),
    emetodopago: new FormControl(0, Validators.required),
    ebanco: new FormControl('', Validators.required),
    ecfdi: new FormControl('', Validators.required),
    ecuenta: new FormControl('', Validators.required),
    tmoneda: new FormControl('', Validators.required),
    fhfechaservicio: new FormControl('', Validators.required),
    tcorreo: new FormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new FormControl('', [Validators.required,
    Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
    ]),
    treferencia: new FormControl('', null),
    tobservaciones: new FormControl('', null)
  })



  datosNaviera: any;
  datosEmbalaje: any;
  datosTipoContenedor: any;
  inputvalue = "";
  lbletransaccion = '';


  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any

  //Etique  dinamica cuando el selecciona el tipo de carga esto cambia
  lblSerieMarca: string = 'Contenedor'

  myControl = new FormControl('');
  options!: Array<any>;
  filteredOptions?: Observable<any>;

  //Index table


  //Solicitud
  datosManifiesto!: Imanifiesto;

  constructor(
    private route: ActivatedRoute,
    private api: classApiCatalogo,
    private apiManifiesto: ApiServiceManifiesto,
    private router: Router,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
    private formBuilder: FormBuilder,
    private serviceCatalogos: serviceCatalogos,
  ) {

  }



  //funcion para evitar que los usuarios abandonen accidentalmente una ruta / página
  canDeactivate(): Observable<boolean> | boolean {
    if (this.unSaved) {
      const result = window.confirm('Hay cambios sin guardar, ¿desea descartarlos?');
      return of(result);
    }
    return true;
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
    // this.FormDatosBien.get('tembalaje').setValue(dato);
  }

  onChangeDetalleBien(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    //this.FormDatosDetallesBien.get('tembalaje')?.setValue(dato);
  }

  onChangeNaviera(event: any) {
    let dato = event.target.options[event.target.options.selectedIndex].text;
    //this.FormDatosBien.get('tnaviera')?.setValue(dato);
  }

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

      console.log(this.datosEmbalaje);


    })*/
    this.datosEmbalaje = this.serviceCatalogos.catalogoEmbalajes

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
      },
      {
        ttramite: "NINGUNO",
        tdescripcion: "NINGUNO",
      }
    ]
    this.datosTramite = arrTramite

    //Catalogo de Tipos de contenedores
    this.api.GetTipoContenedores().subscribe(data => {

      //console.log(data)
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


    //Consultar los clientes
    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        this.e_procesar_datos_clientes(response)
        //this.rowData =  response

        this.options = response.data;
        //console.log(this.options);

        //Auto complete
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );

      }
    )

    //Selected
    //this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    //this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    //this.FormDatosBien.controls['ttramite'].setValue(null);
    //this.FormDatosBien.controls['ttipocarga'].setValue(null);
    //this.FormDatosBien.controls['ttipocontenedor'].setValue(null);

    this.etransaccion = this.route.snapshot.params['id'];
    this.e_consultarTransaccion(this.etransaccion);

  }


  //Consultar datos de la transaccion
  e_consultarTransaccion(etransaccion: number) {

    let parametros = {
      etransaccion: etransaccion
    }

    this.apiManifiesto.postConsultaManifiesto(parametros).subscribe(
      data => {
        //productos = data;
        this.e_procesarDatos(data);
        //console.log(data)
      }
    )
  }

  //Procesar datos
  e_procesarDatos(datos: any) {


    console.log('*Solicitud')
    console.log(datos)

    let solicitud = {
      cliente: datos.trfc,
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
    }

    this.ngformsolicitudentrada.form.setValue(solicitud)


    //Bien(es)
    datos['bienes'].forEach((dato: any, index: any) => {




      //Detalle(s) Bien(es)
      let listDetallesBien: any = [];
      dato.detallesbien.forEach((datoDetalle: any, index: any) => {

        //Nombre embalaje
        this.datosEmbalaje.forEach((valor: any, index: any) => {
          if (valor.ecodembalaje == datoDetalle.ecodembalaje) {
            datoDetalle.tembalaje = valor.tnombre;
          }
        });

        let datosDetallesBien = {
          econtadorRow: this.contadorRowBien,
          edetalleguia: datoDetalle.edetalleguia,
          tfactura: datoDetalle.tfacturas,
          tmarcas: datoDetalle.tmarcas,
          tdescripcion: datoDetalle.tdescripcion,
          ecantidad: datoDetalle.ecantidad,
          epesobruto: datoDetalle.epesobruto,
          epesoneto: datoDetalle.epesoneto,
          evolumen: datoDetalle.evolumen,
          ecodembalaje: datoDetalle.ecodembalaje,
          tembalaje: datoDetalle.tembalaje,

        };

        listDetallesBien.push(datosDetallesBien);

        //Contador
        this.contadorRowBien++;

      })



      //Nombre embalaje
      this.datosEmbalaje.forEach((valor: any, index: any) => {
        if (valor.ecodembalaje == dato.ecodembalaje) {
          dato.tembalaje = valor.tnombre;
        }
      });

      //Nombre naviera
      this.datosNaviera.forEach((valor: any, index: any) => {
        if (valor.ecodnaviera == dato.ecodnaviera) {
          dato.tnaviera = valor.tnombre;
        }
      });

      //Sellos(s)
      let sellos: any = [];
      dato.sellos.forEach((datosello: any, index: any) => {
        sellos.push(datosello['tsello']);
      });


      let bienes = {}
      bienes = {
        econtadorRowBien: this.contadorRowBien,
        eguia: dato.eguia,
        tembalaje: dato.tembalaje,
        ecodembalaje: dato.ecodembalaje,
        tnaviera: dato.tnaviera,
        ecodnaviera: dato.ecodnaviera,
        tmarcas: dato.tmarcas,
        ttipocontenedor: dato.ttipocontenedor,
        epesoneto: dato.epesoneto,
        epesobruto: dato.epesobruto,
        ebultos: dato.ecantidad,
        ttramite: dato.ttramite,
        ttipocarga: dato.ttipocarga,
        tsellos: sellos.join('/'),
        texistencia: dato.texistencia,
        detallesbien: listDetallesBien
      }

      this.bienes.push(bienes);

      //Contador
      this.contadorRowBien++;

    });

  }

  //////// OTROS /////////

  _filter(value: any) {
    let filterValue = '';
    if (typeof value === "string") {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.trfc.toLowerCase();
    }

    return this.options.filter(
      option => option.trfc.toLowerCase().indexOf(filterValue) === 0
    );

  }


  OnHumanSelected(dato: any) {
    console.log('*Dato rfc');
    console.log(dato);

    this.datosDirecciones = dato.direcciones
    this.FormSolicitudEntrada.get('cliente')?.setValue(dato);

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
        this.router.navigate(['../dashboard/customer/entradas/detalle', this.lbletransaccion]);
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

  e_procesar_datos_clientes(datos: any) {
    ////console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);

    })*/
    this.datosClientes = datos.data
  }

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
    this.datosBien.ttramite = this.FormDatosBien.value.ttramite;
    this.datosBien.ttipocarga = this.FormDatosBien.value.ttipocarga;
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
    ////////console.log(element);

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
      ttramite: new FormControl(datos.ttramite, Validators.required),
      ttipocarga: new FormControl(datos.ttipocarga, Validators.required),
      tsellos: new FormControl(datos.tsellos, [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })

  }

  ////////////// DETALLES DEL / LOS BIEN(ES) ////////////////////////
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
    datosDetallesBien.tfactura = this.FormDatosDetallesBien.value.tfactura;
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

  e_eliminarDetalleBien(dato: any) {

    this.listDetallesBien.forEach((value: any, index: any) => {
      if (value == dato) {
        this.listDetallesBien.splice(index, 1);
        //this.FormDatosDetallesBien.get('idSequenceDetalleBien')?.setValue(this.listDetallesBien.length);
      }
    });
  }

  //Editar el detalles del bien
  e_editarDetalleBien(datos: any) {

    this.FormDatosDetallesBien = new FormGroup({
      econtadorRow: new FormControl(datos.econtadorRow, null),
      tfactura: new FormControl(datos.tfactura, Validators.required),
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

  e_carga(datos: any) {


    //Clear
    this.listDetallesBien = [];

    //Show Hidden div
    this.divCarga = true;
    this.divMercancia = false;


  }


  //////////////  CONTACTO ////////////////////////
  e_guardar(solicitud: NgForm) {

    //let datosManifiesto: Imanifiesto;
    let datosParametros: Iparametros;
    let carga: Imercancias;
    let listaCarga: Array<Imercancias> = [];
    let sellos: Isellos;
    let listaSellos: Array<Isellos> = [];
    let mercancia: Idetallemercancias;
    let listaMercancias: Array<Idetallemercancias> = [];

    // stop y valido
    if (solicitud.invalid) {
      console.log('*error');
      return;
    }
    console.log('*Solicitud');
    console.log(solicitud);


    if (this.bienes.length == 0) {

      let alertaCarga: any = {};

      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);

    }
    if (this.bienes.length != 0) {



      let estado: string = 'OK!'
      let mensaje: string = ''

      this.bienes.forEach((dato: any, index: any) => {

        listaMercancias = []
        listaSellos = []
        estado = 'OK!'

        if (estado == 'ERROR!') {

          let alerta: any = {};

          alerta['text'] = mensaje;
          alerta['tipo'] = 'error';
          alerta['footer'] = '';
          this.alerta(alerta);


        } else {

          //DETALLE MERCANCIA
          if (dato['detallesbien']) {
            dato['detallesbien'].forEach((datomercancias: any, index: any) => {
              mercancia = {
                edetalleguia: datomercancias.edetalleguia,
                tfacturas: datomercancias.tfactura,
                ecodpropietario: datomercancias.ecodpropietario,
                tmarcas: datomercancias.tmarcas,
                tdescripcion: datomercancias.tdescripcion,
                ecantidad: datomercancias.ecantidad,
                epesobruto: datomercancias.epesobruto,
                epesoneto: datomercancias.epesoneto,
                ecodembalaje: datomercancias.ecodembalaje,
                evolumen: datomercancias.evolumen,
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
            sellos: listaSellos,
            detallesbien: listaMercancias
          }

          listaCarga.push(carga);
        }

      });

      //Validar que todo este OK
      if (estado == 'OK!') {

        //Datos del usuaro por [local storage]
        let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

        //Parche buscar el id del cliente por el RFC
        this.datosClientes.forEach((dato: any, valor: any) => {
      

          if (dato.trfc == solicitud.value.cliente) {
            solicitud.value.cliente = dato.ecliente;
          }
        })


        this.datosManifiesto = {
          etransaccion: this.etransaccion,
          ecliente: solicitud.value.cliente,
          edireccion: solicitud.value.edireccion,
          emetodopago: solicitud.value.emetodopago,
          ebanco: solicitud.value.ebanco,
          ecfdi: solicitud.value.ecfdi,
          ecuenta: solicitud.value.ecuenta,
          tmoneda: solicitud.value.tmoneda,
          ttiposolicitud: 'ENTRADA',
          tcorreo: solicitud.value.tcorreo,
          ttelefono: solicitud.value.ttelefono,
          treferencia: solicitud.value.treferencia,
          fhfechaservicio: solicitud.value.fhfechaservicio,
          tobservaciones: solicitud.value.tobservaciones,
          ecodusuario: datosUsuario.ecodusuario,
          bienes: listaCarga
        }



        console.log(JSON.stringify(this.datosManifiesto));



        let datosParametros = { orden: this.datosManifiesto }



        let alerta: any = {};

        alerta['text'] = '¿ DESEA CONTINUAR ? ';
        alerta['tipo'] = 'question';
        alerta['footer'] = '';


        this.alertaConfirm(alerta, (confirmed: boolean) => {
          if (confirmed == true) {
            this.enotificarManifiesto(datosParametros);
            //console.log(JSON.stringify(this.datosManifiesto));
          }
        });



      }
    }


  }

  enotificarManifiesto(datos: any) {
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

        if (response.errors) {
          success = false
          response.errors.forEach((dato: any, index: any) => {
            //console.log(dato.attributes.text)
            text += dato.attributes.text + '\n'
          })
        }


        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "ENTRADA";
        this.alerta(alerta);

      }
    )
  }

  //Redirecionar al reporte de consultar
  e_consulta() {
    this.router.navigate(['dashboard/customer/entradas/consulta']);
  }

  e_procesarDirecciones(datos: any) {
    ////console.log('datos')
    ////console.log(datos)
    this.FormSolicitudEntrada.controls.cliente.setValue(datos.cliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.cliente == datos.cliente) {
        ////console.log(dato.direcciones)
        this.datosDirecciones = dato.direcciones
      }
    })
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

        this.FormDatosBien.controls['ttipocarga'].setValue(null);
      }
    }

  }

}



