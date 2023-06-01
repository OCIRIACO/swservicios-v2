import { Component, ElementRef, HostListener, NgModule, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, Validator, Validators, FormsModule, NgForm, ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms'


import { Router } from '@angular/router';
import { IdatosCarga } from 'src/app/modelos/datoscarga.interfase';
import { IdatosMercancia } from 'src/app/modelos/datosmercancias.interfase';
import { IdatosNaviera } from 'src/app/modelos/datosnaviera.interfase';
import { Idetallemercancias, Imanifiesto, Imercancias, InotificaManifiesto, Iparametros, IRootNotificaUnManifiesto, Isellos } from 'src/app/modelos/solicitudEntradas/notificamanifiesto.interfase';
import { IseguridadLogin } from 'src/app/modelos/seguridad/seguridad.interfase';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { MatTable } from '@angular/material/table';

import * as $ from 'jquery';
import 'select2';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-notificamanifiesto',
  templateUrl: './notificamanifiesto.component.html',
  styleUrls: ['./notificamanifiesto.component.css',
  ]
})

export class NotificamanifiestoComponent implements OnInit {





  userDetails = { countryId: '' }
  @ViewChild('idsequence', { static: false }) idsequence!: ElementRef;
  @ViewChild('idSequenceDetalleBien', { static: false }) idSequenceDetalleBien!: ElementRef;


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

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);


  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  respuestaConfirmar: any;
  seleccion: any;
  seleccionNaviera: any;

  //Change's
  changeCount = 0;
  changeCountMercancia = 0;

  //Otros's
  bienes: any;
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

  //Submit's
  submitted = false;
  submitBien = false;
  submitDetalleBien = false;
  submitGuardar = false;

  //Contador rows tables
  contadorRowBien: number = 1;


  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Forms's
  FormDatosBien = new UntypedFormGroup({
    econtadorRowBien: new UntypedFormControl(0, null),
    //tembalaje: new UntypedFormControl('', Validators.required),
    ecodembalaje: new UntypedFormControl('', Validators.required),
    //tnaviera: new UntypedFormControl('', Validators.required),
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
    ttipocarga: new UntypedFormControl('', Validators.required),
    tsellos: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
    ])
  })

  FormDatosDetalleBien = new UntypedFormGroup({
    econtadorRowBien: new UntypedFormControl(0, null),
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
    //tembalaje: new UntypedFormControl('', Validators.required)
  });

  FormSolicitudEntrada = new FormGroup({
    trfc: new FormControl('', Validators.required),
    ecliente: new FormControl('', Validators.required),
    edireccion: new FormControl('', Validators.required),
    emetodopago: new FormControl(null, Validators.required),
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



  constructor(
    private api: classApiCatalogo,
    private apiManifiesto: ApiServiceManifiesto,
    private router: Router,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
    private formBuilder: FormBuilder
  ) {
    this.bienes = [];
    this.listDetallesBien = [];
    this.datosNaviera = [];
    this.datosEmbalaje = [];
    this.datosTipoContenedor = [];
    this.datosMetodoPago = [];
    this.datosTramite = []

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

  ngOnInit(): void {





    //Date
    const datePipe = new DatePipe('en-Us');
    this.nowFechaServicio = datePipe.transform(new Date(), 'yyyy-MM-dd');


    /* $('#ecliente').on('eValorCliente', (ev, dato) => {
       //console.log(dato)
       this.e_procesarDirecciones(dato)
     });*/


    /* $(document).ready(function () {
       //$('.select2').select2(); //initialize
       (<any>$('.select2')).select2();
     });
 
     $(".select2").on("select2:select", function (e) {
       let dato_rfc: any = $(e.currentTarget).val();
       //console.log(dato_rfc)
       //$('#ecliente').val(dato_rfc).trigger("change");
       let parametros = {
         ecliente: dato_rfc
       }
       $('#ecliente').trigger('eValorCliente', parametros);
     });*/


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




    //Consultar los clientes
    let parametros = {
      eperfil: this.datosUsuario.eperfil
    }

    this.apiCliente.postConsultarCarteraClientes(parametros).subscribe(
      (response) => {
        this.e_procesar_datos_clientes(response)
        //this.rowData =  response

        this.options = response.data;
        console.log(this.options);

        //Auto complete
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );

      }
    )

    //Selected
    this.FormDatosBien.controls['ecodembalaje'].setValue(null);
    this.FormDatosBien.controls['ecodnaviera'].setValue(null);
    this.FormDatosBien.controls['ttramite'].setValue(null);
    this.FormDatosBien.controls['ttipocarga'].setValue(null);
    this.FormDatosBien.controls['ttipocontenedor'].setValue(null);







  }


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

  AutoCompleteDisplay(item: any) {
    /*if (item && item.trfc) {
      return item.trfc.toLowerCase();
    } else {
      return item
    }*/
    return item ? item.trfc : undefined;

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

  OnHumanSelected(dato: any) {
    //console.log('### Trigger');
    //console.log(SelectedHuman);
    this.datosDirecciones = dato.direcciones

  }

  ///
  e_procesar_datos_clientes(datos: any) {
    ////console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);

    })*/
    this.datosClientes = datos.data
  }

  //////////////  AGERGAR BIEN ////////////////////////


  // convenience getter for easy access to form fields
  //get f() { return this.FormDatosBien.controls; }


  e_agregarBien(): void {

    //////console.log(dato)
    //let idSecuenceBien = this.idsequence.nativeElement.value


    ////////console.log(form);
    //this.submitBien = true;

    // stop here if form is invalid
    //Procesar los datos
    //console.log(this.FormDatosBien)

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

    //Agregar
    this.bienes.push(this.datosBien);

    //Contador++
    this.contadorRowBien++;

    //Reset
    this.FormDatosBien.reset();

    //Nuevo
    this.FormDatosBien.get('econtadorRowBien')!.setValue(0);

    console.log('*Bienes')
    console.log(this.bienes);


    /*
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
   if (this.bienes.length == 0) {

     //Sequence
     this.carga.idsequence = (this.bienes.length);

     this.bienes.push(this.carga);

   } else {

     //Verificar si existe la sequence
     if (Boolean(this.bienes[idSecuenceBien]) == true) {
       //////console.log('Actualizando...');


       this.bienes[idSecuenceBien].tembalaje = this.carga['tembalaje'];
       this.bienes[idSecuenceBien].ecodembalaje = this.carga['ecodembalaje'];
       this.bienes[idSecuenceBien].tnaviera = this.carga['tnaviera'];
       this.bienes[idSecuenceBien].ecodnaviera = this.carga['ecodnaviera'];
       this.bienes[idSecuenceBien].tmarcas = this.carga['tmarcas'];
       this.bienes[idSecuenceBien].ttipocontenedor = this.carga['ttipocontenedor'];
       this.bienes[idSecuenceBien].epesoneto = this.carga['epesoneto'];
       this.bienes[idSecuenceBien].epesobruto = this.carga['epesobruto'];
       this.bienes[idSecuenceBien].ebultos = this.carga['ebultos'];
       this.bienes[idSecuenceBien].ttramite = this.carga['ttramite'];
       this.bienes[idSecuenceBien].ttipocarga = this.carga['ttipocarga'];
       this.bienes[idSecuenceBien].tsellos = this.carga['tsellos'];

     } else {
       //////console.log('Insert...');
       //Sequence
       this.carga.idsequence = (this.bienes.length);

       this.bienes.push(this.carga);

     }

   }


   //Final
   //////console.log(this.bienes);

   //Reset
   //this.FormDatosBien.reset()

   ////////console.log(form);
   this.submitBien = false;

   ///
   // this.idsequence.nativeElement.value = null;

   //Forms's
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
     ttipocarga: new UntypedFormControl('', Validators.required),
     tsellos: new UntypedFormControl('', [
       Validators.required,
       Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
     ])
   })

   //Selected
   this.FormDatosBien.controls['ecodembalaje'].setValue(null);
   this.FormDatosBien.controls['ecodnaviera'].setValue(null);
   this.FormDatosBien.controls['ttramite'].setValue(null);
   this.FormDatosBien.controls['ttipocarga'].setValue(null);
   this.FormDatosBien.controls['ttipocontenedor'].setValue(null);
   */

  }


  e_eliminar(element: any) {
    ////////console.log(element);

    this.bienes.forEach((value: any, index: any) => {
      if (value == element) {
        this.bienes.splice(index, 1);
        this.FormDatosBien.get('idsequence')?.setValue(this.bienes.length);
      }
    });
  }

  e_editar(datos: any) {


    //Eliminar registro del arreglo bienes
    /*this.bienes.forEach((value: any, index: any) => {
      if (value.econtadorRowBien == datos.econtadorRowBien) {
        this.bienes.splice(index, 1);
      }
    })*/

    //Item's
    this.FormDatosBien = new UntypedFormGroup({
      econtadorRowBien: new UntypedFormControl(datos.econtadorRowBien, null),
      // tembalaje: new UntypedFormControl(datos.tembalaje, Validators.required),
      ecodembalaje: new UntypedFormControl(datos.ecodembalaje, Validators.required),
      // tnaviera: new UntypedFormControl(datos.tnaviera, Validators.required),
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
      ttipocarga: new UntypedFormControl(datos.ttipocarga, Validators.required),
      tsellos: new UntypedFormControl(datos.tsellos, [
        Validators.required,
        Validators.pattern('[a-z0-9-A-Z0-9/\\s]+')
      ])
    })

  }

  //////////////////////////////////////////////////// DETALLES DE BIEN /////////////////////////////////////////////////////////////

  // convenience getter for easy access to form fields
  //get fmercancia() { return this.FormDatosDetalleBien.controls; }


  //agregar Detalles del bien
  e_agregarDetalleBien() {

    //Get id sequence
    //dato.idSequenceDetalleBien = this.idSequenceDetalleBien.nativeElement.value;

    //console.log(dato)

    //this.submitDetalleBien = true
    console.log('*Datos bien');
    console.log(this.datosBien);

    console.log('*Detalles bienes');
    console.log(this.FormDatosDetalleBien)

    // stop here if form is invalid
    if (this.FormDatosDetalleBien.invalid) {
      console.log('error.');
      return;
    }


    let datosDetallesBien: any = {}
    datosDetallesBien.econtadorRowBien = this.FormDatosDetalleBien.value.econtadorRowBien;
    datosDetallesBien.tfactura = this.FormDatosDetalleBien.value.tfactura;
    datosDetallesBien.tmarcas = this.FormDatosDetalleBien.value.tmarcas;
    datosDetallesBien.tdescripcion = this.FormDatosDetalleBien.value.tdescripcion;
    datosDetallesBien.ecantidad = this.FormDatosDetalleBien.value.ecantidad;
    datosDetallesBien.epesobruto = this.FormDatosDetalleBien.value.epesobruto;
    datosDetallesBien.epesoneto = this.FormDatosDetalleBien.value.epesoneto;
    datosDetallesBien.evolumen = this.FormDatosDetalleBien.value.evolumen;
    datosDetallesBien.ecodembalaje = this.FormDatosDetalleBien.value.ecodembalaje;

    this.listDetallesBien.push(datosDetallesBien);

    this.bienes.forEach((value: any, index: any) => {

      if (value.econtadorRowBien == this.datosBien.econtadorRowBien) {
        this.bienes[index].detallesbien = this.listDetallesBien;
      }

    });

    //Reset
    this.FormDatosDetalleBien.reset();


    //console.log(this.FormDatosDetalleBien)


    //this.bienes[dato.idsequence].bienes = this.listDetallesBien;


    /*
    let datosDetalleBien: any = {}

    //datosDetalleBien.edetalleguia = dato.idSequenceDetalleBien;
    datosDetalleBien.tfacturas = dato.tfactura;
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
        //////console.log('Actualizando...');

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
        //////console.log('Insert...');
        //Sequence

        datosDetalleBien.idSequenceDetalleBien = (this.listDetallesBien.length);

        this.listDetallesBien.push(datosDetalleBien);

        //this.bienes.push(this.carga);

      }
    }


    //Join
    // ////console.log(this.datosBien)
    //this.bienes[dato.idsequence].bienes = this.listDetallesBien;

    this.datosBien.detallesbien = this.listDetallesBien;


    ////////console.log('Despues');
    //////console.log(JSON.stringify(this.datosBien));

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
    */


  }

  //Form para iniciar la captura de los detalles del bien
  e_mercancias(datos: any) {

    //Selected
    //this.FormDatosBien.controls['ecodembalaje'].setValue(null);

    console.log('* Detalles bien')
    console.log(datos)

    //Reset a los submit
    //this.submitDetalleBien = false
    //this.submitted = false

    //Cargas los datos
    //this.datosBien = datos


    //En caso de que el bien ya tenga cargado los detalles del bien se pinta  entonces !!!
    //if (Boolean(this.datosBien.detallesbien) == true) {
    //  this.listDetallesBien = this.datosBien.detallesbien
    //}

    this.listDetallesBien = datos.detallesbien;

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


    /*this.FormDatosDetalleBien = new FormGroup({
      idSequenceDetalleBien: new FormControl('', null),
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
      tembalaje: new FormControl('', Validators.required)
    });*/
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

    //captador de conveniencia para un fácil acceso a los campos de formulario
    this.submitGuardar = true;

    // stop y valido
    if (this.FormSolicitudEntrada.invalid) {
      console.log(this.FormSolicitudEntrada.invalid)
      return;
    }



    if (this.bienes.length == 0) {

      let alertaCarga: any = {};

      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);

    }
    if (this.bienes.length != 0) {



      let datosManifiesto: Imanifiesto;
      let datosParametros: Iparametros;
      let carga: Imercancias;
      let listaCarga: Array<Imercancias> = [];
      let sellos: Isellos;
      let listaSellos: Array<Isellos> = [];
      let mercancia: Idetallemercancias;
      let listaMercancias: Array<Idetallemercancias> = [];

      let estado: string = 'OK!'
      let mensaje: string = ''

      this.bienes.forEach((dato: any, index: any) => {

        //clear
        listaMercancias = []
        listaSellos = []
        estado = 'OK!'   // validar el detalle

        // Validaciones
        /*
        if (!dato['detallesbien']) {
          estado = 'ERROR!'
          mensaje = 'CAPTURAR EL DETALLE DE LAS MERCANCIAS PARA CARGA:' + dato.ttipocarga + ' MARCA:' + dato.tmarcas;
          //console.log('Error')
        }
        */

        // Validar el detalle
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
            ttipocarga: dato['ttipocarga'],
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
        }

      });

      //Validar que todo este OK
      if (estado == 'OK!') {

        //Datos del usuaro por [local storage]
        let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);


        datosManifiesto = {
          ecliente: datos.ecliente,
          edireccion: datos.edireccion,
          emetodopago: datos.emetodopago,
          ebanco: datos.ebanco,
          ecfdi: datos.ecfdi,
          ecuenta: datos.ecuenta,
          tmoneda: datos.tmoneda,
          ttiposolicitud: 'ENTRADA',
          tcorreo: datos.tcorreo,
          ttelefono: datos.ttelefono,
          treferencia: datos.treferencia,
          fhfechaservicio: datos.fhfechaservicio,
          tobservaciones: datos.tobservaciones,
          ecodusuario: datosUsuario.ecodusuario,
          bienes: listaCarga
        }


        datosParametros = { orden: datosManifiesto }



        let alerta: any = {};

        alerta['text'] = '¿ DESEA CONTINUAR ? ';
        alerta['tipo'] = 'question';
        alerta['footer'] = '';


        this.alertaConfirm(alerta, (confirmed: boolean) => {
          if (confirmed == true) {
            this.enotificarManifiesto(datosParametros);
            // //console.log(datosParametros)
          }
        });

      }
    }

  }

  enotificarManifiesto(datos: any) {
    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiManifiesto.postNotifcaManifiesto(datos).subscribe(
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
    this.FormSolicitudEntrada.controls.ecliente.setValue(datos.ecliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.ecliente == datos.ecliente) {
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


    /*if (this.bienes.length == 0) {

      let alertaCarga: any = {};

      alertaCarga['text'] = 'NO SE DETECTA NINGUNA CARGA PARA ESTA OPERACIÓN';
      alertaCarga['tipo'] = 'error';
      alertaCarga['footer'] = '';
      this.alerta(alertaCarga);

    }*/


  }

}



