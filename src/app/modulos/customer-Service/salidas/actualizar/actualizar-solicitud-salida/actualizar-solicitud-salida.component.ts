import { Component, OnInit, ViewChild } from '@angular/core';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { Iparametros } from 'src/app/modelos/solicitudSalidas/consultarSolicitudSalidas'
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceSolicituSalida } from 'src/app/serviciosRest/Customer/solicitudSalidas/api.service.salidas'
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/modelos/global';
import { Isolicitud, Ibienes, IdetalleBienes } from 'src/app/modelos/solicitudSalidas/actualizarSolicitudSalida'
import Swal from 'sweetalert2';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import * as $ from 'jquery';
import 'select2';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-actualizar-solicitud-salida',
  templateUrl: './actualizar-solicitud-salida.component.html',
  styleUrls: ['./actualizar-solicitud-salida.component.css']
})
export class ActualizarSolicitudSalidaComponent implements OnInit {

  @ViewChild('solicitudForm') ngformsolicitud: NgForm;

  //Textarea *comentarion
  maxCaracteres: number = 256
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  //Now DATE
  nowFechaServicio: any;

  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Select's catalogo's
  datosMetodoPago: any = [];
  datosBancos: any
  datosCfdi: any

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Parametro URL
  id?: string

  //Mostrar u Ocultar Div's
  divBienes: boolean = false

  //Bienes
  arrDatosBienes: Array<any> = []
  arrDatosBienesLiberar: Array<any> = []

  //Informativos
  informativo: string = ''

  //Radio Button
  selectedBusqueda = "MARCA"

  // Submit's 
  submitBusqueda = false
  submitGuardar = false


  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'


  //Form's
  FormBusqueda = new FormGroup({
    tvalor: new FormControl('', Validators.required),
    tbusqueda: new FormControl('', Validators.required)
  })


  FormSolicitudServicios = new FormGroup({
    cliente: new FormControl('', Validators.required),
    edireccion: new FormControl('', Validators.required),
    emetodopago: new FormControl('', Validators.required),
    ebanco: new FormControl('', Validators.required),
    ecfdi: new FormControl('', Validators.required),
    ecuenta: new FormControl('',
      [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      ]

    ),
    tmoneda: new FormControl('', Validators.required),
    // ttipocarga: new FormControl('', Validators.required),
    fhfechaservicio: new FormControl('', Validators.required),
    tcorreo: new FormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new FormControl('',
      [
        Validators.required,
        Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
      ]
    ),
    treferencia: new FormControl('', null),
    tobservaciones: new FormControl('', null)
  })

  //Folio web 
  etransaccion: number = 0 // Variable que se llenara al realizar la peticion y NO VA SER MODIFICADA

  //Label's
  lbletransaccion: string = ''
  lblfhfecharegistro: string = ''

  //Autocomplete
  controlRfc = new FormControl('');
  opcionesRfc!: Array<any>;
  filtrarOpcionesRfc?: Observable<any>;


  constructor(private serviceCatalogos: serviceCatalogos,
    private route: ActivatedRoute,
    private router: Router,
    private apiSalidas: ApiServiceSolicituSalida,
    private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,

  ) { }


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


        this.etransaccion = this.route.snapshot.params['id'];
        //Cosnultar la solicitud web de salida del bien(es)
        this.e_consultaSolicitud(this.etransaccion);

      }
    )
    ///////////////////////////////////////////////////////////



    //Catalogo de metodo de pago
    this.datosMetodoPago = this.serviceCatalogos.catalogoMetodoPago

    //Catalogo bancos
    this.datosBancos = this.serviceCatalogos.catalogoBancos

    //Catalogo Cfdi
    this.datosCfdi = this.serviceCatalogos.catalogoCfdi




    //// Configurar el select2

    /* $('#ecliente').on('eValorCliente', (ev, dato) => {
       ////console.log('Datos:'+dato)
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
     });*/

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
    this.datosDirecciones = dato.direcciones
    this.FormSolicitudServicios.get('cliente')?.setValue(dato);

  }

  //Alerta
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      html: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
      if (result.isConfirmed && datos['tipo'] == 'success') {
        this.unSaved = false
        this.router.navigate(['dashboard/customer/salidas/detalles', this.lbletransaccion]);
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


  //Cosnultar la solicitud web de salida del bien(es)
  e_consultaSolicitud(datos: any) {
    let Iparametros: Iparametros;
    Iparametros = {
      etransaccion: datos
    }

    this.apiSalidas.postConsultarSolicitudSalida(Iparametros).subscribe(
      data => {
        //this.arrDatosBienesLiberar = data.mercancias
        //console.log(data.mercancias)
        this.e_procesarConsultaSolicitud(data)
      }
    )

    //console.log(this.arrDatosBienesLiberar)
  }

  ////////// Procesar Datos (parseo) /////
  e_procesarConsultaSolicitud(datos: any) {

    this.etransaccion = datos.etransaccion  // Valor que no va cambiar nunca

    //Label's informativos para el usuario nada mas
    this.lbletransaccion = datos.etransaccion
    this.lblfhfecharegistro = datos.fhfecharegistro

    //Procesar la busqueda de la direccion
    this.datosClientes.forEach((datocliente: any, index: any) => {
      if (datocliente.ecliente == datos.ecliente) {
        this.datosDirecciones = datocliente.direcciones
      }
    })


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

    this.ngformsolicitud.form.setValue(solicitud)


    /*this.FormSolicitudServicios = new FormGroup({
      ecliente: new FormControl(datos.ecliente, Validators.required),
      edireccion: new FormControl(datos.edireccion, Validators.required),
      emetodopago: new FormControl(datos.emetodopago, Validators.required),
      ebanco: new FormControl(datos.ebanco, Validators.required),
      ecfdi: new FormControl(datos.ecfdi, Validators.required),
      ecuenta: new FormControl(datos.ecuenta, Validators.required),
      tmoneda: new FormControl(datos.tmoneda, Validators.required),
      fhfechaservicio: new FormControl(datos.fhfechaservicio, Validators.required),
      tcorreo: new FormControl(datos.tcorreo, Validators.required),
      ttelefono: new FormControl(datos.ttelefono, Validators.required),
      treferencia: new FormControl(datos.treferencia, null),
      tobservaciones: new FormControl(datos.tobservaciones, null)
    })*/

    //Extraer todos los bienes a liberar amparador en la solicitud
    //this.arrDatosBienesLiberar = datos.mercancias
    this.arrDatosBienesLiberar = datos.bienes


    // Change select2 
    $('.select2').val(datos.ecliente).trigger('change');
    let parametros = {
      ecliente: datos.ecliente
    }
    $('#ecliente').trigger('eValorCliente', parametros);
    /////////////////////////////////////////////////////


  }


  ///////// Agregar Bien /////////
  e_agregar(datos: any) {

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesLiberar);
    this.arrDatosBienesLiberar.forEach((bien: any, valor: any) => {
      if (bien.ebien == datos.ebien) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA(BIEN) YA SE ENCUENTRA AGREGADO PARA LIBERAR';
    } else {

      // Preparar
      /*datosbien.ebien = datos.ebien
      datosbien.ttipocarga = datos.ttipocarga;
      datosbien.ttramite = datos.ttramite;
      datosbien.ttipocontenedor = datos.ttipocontenedor;
      datosbien.tmarcas = datos.tmarcas;
      datosbien.epesorecibido = datos.epesorecibido;
      datosbien.ecantidadrecibido = datos.ecantidadrecibido;*/

      //Preparara el reporte para visualizar las cargas a liberar
      this.arrDatosBienesLiberar.push(datos);

      //Clear al reporte que busca los bienes 
      this.arrDatosBienes = [];

      //Oculto el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = false;

      //console.log(datos);

      //Reset
      this.FormBusqueda.reset();

    }



  }

  ///////// Busqueda Bien /////////

  get fbusqueda() { return this.FormBusqueda.controls; }

  e_buscar(datos: any) {

    //Oculto el reporte de los bienes que se realizo con el boton [buscar]
    this.divBienes = false;

    this.informativo = ''

    //Validamos el Forms
    this.submitBusqueda = true;

    // Stop en caso de detectar error
    if (this.FormBusqueda.invalid) {
      //console.log('error.');
      return;
    }

    //Consumir el microservicio
    this.apiSalidas.postValidarSalidaBienes(datos).subscribe(
      (response) => {
        //console.log(response);
        if (response.success == false) {
          this.informativo = response.errors[0].detail;
        } else {
          this.divBienes = true;
          //this.arrDatosBienes = response.data;
          this.e_procesarBusqueda(response)
        }
      }
    )

    //console.log(datos);
  }

  e_procesarBusqueda(datos: any) {

    //Hide el reporte de los bienes que se realizo con el boton [buscar]
    this.divBienes = false;

    //console.log(datos)

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesLiberar);
    this.arrDatosBienesLiberar.forEach((bien: any, valor: any) => {
      if (bien.ebien == datos.data[0].ebien) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA(BIEN) YA SE ENCUENTRA AGREGADO PARA LIBERAR';
    } else {

      //Show el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = true;

      this.arrDatosBienes = datos.data;
    }

  }


  ///////// Generar Solicitud de Salida /////////

  get fguardar() { return this.FormSolicitudServicios.controls; }


  e_guardar(solicitud: NgForm) {

    //console.log('guardar');
    //console.log(this.arrDatosBienesLiberar);

    //Alerta
    let alerta: any = {};


    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (solicitud.invalid) {
      //console.log('error.');
      return;
    }

    // Validar que existan bienes 

    if (this.arrDatosBienesLiberar.length == 0) {


      alerta['text'] = "AGREGUE LA(S) MERCANCIA(S)/BIENE(S) A  LIBERAR";
      alerta['tipo'] = "error";
      alerta['footer'] = "";
      this.alerta(alerta);

    }

    //console.log(this.bienesLiberar);

    // Preparar los datos para el envio al API

    let Isolicitud: Isolicitud
    let arrBienes: Array<Ibienes> = [];
    let arrDetalleBienes: Array<IdetalleBienes> = [];

    let bienes: Ibienes
    let detBien: IdetalleBienes

    //console.log(this.bienesLiberar);

    this.arrDatosBienesLiberar.forEach((bien: any, valor: any) => {
      //Detalles Bienes
      arrDetalleBienes = [];

      bien.detallesbien.forEach((detalleBien: any, valor: any) => {

        detBien = {
          edetallebien: detalleBien.edetallebien,
          tfactura: detalleBien.tfacturas,
          tmarcas: detalleBien.tmarcas,
          tdescripcion: detalleBien.tmarcas,
          ecantidad: detalleBien.ecantidad,
          epesobruto: detalleBien.epesobruto,
          epesoneto: detalleBien.epesoneto,
          ecodembalaje: 0,
          evolumen: detalleBien.evolumen
        }

        //Push
        arrDetalleBienes.push(detBien);
      })

      //Bienes
      bienes = {
        eguia: bien.eguia,
        ttipocarga: bien.ttipocarga,
        ttramite: bien.ttramite,
        ttipocontenedor: bien.ttipocontenedor,
        tmarcas: bien.tmarcas,
        epesobruto: bien.epesobruto,
        epesoneto: bien.epesoneto,
        ecantidad: bien.ecantidad,
        ecodnaviera: bien.ecodnaviera,
        ecodembalaje: bien.ecodembalaje,
        detallesbien: arrDetalleBienes
      }

      // Push
      arrBienes.push(bienes);
    })




    //////////////////////////////////////////////////

    //Datos del usuaro por [local storage]
    let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

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
      ttiposolicitud: 'SALIDA',
      tcorreo: solicitud.value.tcorreo,
      ttelefono: solicitud.value.ttelefono,
      fhfechaservicio: solicitud.value.fhfechaservicio,
      treferencia: solicitud.value.treferencia,
      emetodopago: solicitud.value.emetodopago,
      ebanco: solicitud.value.ebanco,
      ecfdi: solicitud.value.ecfdi,
      ecuenta: solicitud.value.ecuenta,
      tmoneda: solicitud.value.tmoneda,
      ecodusuario: datosUsuario.ecodusuario,
      tobservaciones: solicitud.value.tobservaciones,
      bienes: arrBienes
    }

    //console.log(JSON.stringify(Isolicitud));


    //Consumir el servicio api
    let text = '';
    let success: boolean

    // Confirmar la programacion

    alerta['text'] = '¿ DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';
    alerta['footer'] = 'SALIDA';


    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {

        //Inicia el llamado
        this.apiSalidas.postActualizarSolicitud(Isolicitud).subscribe(
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
                text += dato.attributes.text + '\n'
              })
            }

            alerta['text'] = text;
            alerta['tipo'] = (success == true ? "success" : "error");
            alerta['footer'] = "SALIDA";

            this.alerta(alerta);
          }
        )
      }
    })



  }


  ///////// Eliminar /////////
  e_eliminar(datosBien: any) {

    this.arrDatosBienesLiberar.forEach((dato: any, valor: any) => {
      if (dato.ebien == datosBien.ebien) {
        // console.log('eliminar!');
        this.arrDatosBienesLiberar.splice(valor, 1);
      }
    })
  }

  //Cosnultar detalles
  e_consultar() {
    this.router.navigate(['dashboard/customer/salidas/consultar']);
  }

  // Procesar los datos del cliente
  e_procesar_datos_clientes(datos: any) {
    //console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);
 
    })*/
    this.datosClientes = datos.data
  }


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

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/salidas/nuevo']);
  }

}
