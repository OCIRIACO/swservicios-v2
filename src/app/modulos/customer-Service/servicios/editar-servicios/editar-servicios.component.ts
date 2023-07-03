import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios'
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-editar-servicios',
  templateUrl: './editar-servicios.component.html',
  styleUrls: ['./editar-servicios.component.css']
})
export class EditarServiciosComponent implements OnInit {

  @ViewChild('solicitudForm') ngformsolicitud: NgForm;


  //Textarea *comentarion
  maxCaracteres: number = 256
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  //Selected true or false
  ngSelectTipoServicio: string = ""
  ngSelectServicios: string = ""
  ngSelectServicioEspecifico: string = ""

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
  divServicioEspecifico: boolean = false


  //Bienes
  arrDatosBienes: Array<any> = []
  bienesServicios: Array<any> = []
  servicios: Array<any> = []
  arratipoServicios: Array<any> = []
  arrservicio: Array<any> = []
  arrtiposolicitud: Array<any> = []


  //Informativos
  informativo: string = ''

  //Autocomplete
  controlRfc = new FormControl('');
  opcionesRfc!: Array<any>;
  filtrarOpcionesRfc?: Observable<any>;


  //Radio Button
  selectedBusqueda = "MARCA"

  // Submit's 
  submitBusqueda = false
  submitGuardar = false
  submitServicios = false


  //Form's
  FormBusqueda = new FormGroup({
    tvalor: new FormControl('', Validators.required),
    tbusqueda: new FormControl('', Validators.required)
  })


  FormSolicitudServicios = new FormGroup({
    trfc: new FormControl('', Validators.required),
    edireccion: new FormControl('', Validators.required),
    emetodopago: new FormControl('', Validators.required),
    ebanco: new FormControl('', Validators.required),
    ecfdi: new FormControl('', Validators.required),
    ecuenta: new FormControl('', Validators.required),
    tmoneda: new FormControl('', Validators.required),
    fhfechaservicio: new FormControl('', Validators.required),
    tcorreo: new FormControl('', Validators.required),
    ttelefono: new FormControl('', Validators.required),
    treferencia: new FormControl('', null),
    tobservaciones: new FormControl('', null)

  })

  FormServicios = new FormGroup({
    etipomercancia: new FormControl(null, Validators.required),
    etiposervicio: new FormControl(null, Validators.required),
    etiposolicitud: new FormControl(null, Validators.required),
  })

  //Folio web 
  etransaccion: number = 0 // Variable que se llenara al realizar la peticion y NO VA SER MODIFICADA

  //Label's
  lbletransaccion: string = ''
  lblfhfecharegistro: string = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiServiceSolicitudServicios: apiServiceSolicitudServicios,
    private serviceCatalogos: serviceCatalogos,
  ) { }

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

        //Auto complete
        this.opcionesRfc = response.data;

        this.filtrarOpcionesRfc = this.controlRfc.valueChanges.pipe(
          startWith(''),
          map(value => this.e_filtrarRfc(value)),
        );
      }
    )
    ///////////////////////////////////////////////////////////

    //Catalogo de metodo de pago
    this.datosMetodoPago = this.serviceCatalogos.catalogoMetodoPago

    //Catalogo bancos
    this.datosBancos = this.serviceCatalogos.catalogoBancos

    //Catalogo Cfdi
    this.datosCfdi = this.serviceCatalogos.catalogoCfdi


    this.id = this.route.snapshot.params['id'];

    //Cosnultar la solicitud web de salida del bien(es)
    this.e_consultarTransaccion(this.id);

    //// Configurar el select2

    /*
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
*/
    //Consultar los tipos de servicios
    let parametroServicios = {
      tunidad: "ALMACEN",
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
        this.router.navigate(['dashboard/customer/servicios/detalle', this.lbletransaccion]);
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
    this.apiServiceSolicitudServicios.postConsultarServicioBien(datos).subscribe(
      (response) => {
        console.log(response);
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

  /// Procesar datos de la busquqeda
  e_procesarBusqueda(datos: any) {

    //Hide el reporte de los bienes que se realizo con el boton [buscar]
    this.divBienes = false;

    //console.log(datos)

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesLiberar);
    this.bienesServicios.forEach((bien: any, valor: any) => {
      if (bien.eguia == datos.data[0].eguia) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA(BIEN) YA SE ENCUENTRA AGREGADO';
    } else {

      //Show el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = true;

      this.arrDatosBienes = datos.data;
    }


  }

  ///////// Agregar Bien /////////
  e_agregar(datos: any) {

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesLiberar);
    this.bienesServicios.forEach((bien: any, valor: any) => {
      if (bien.eguia == datos.eguia) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA(BIEN) YA SE ENCUENTRA AGREGADO';
    } else {

      //Preparara el reporte para visualizar las cargas a liberar
      this.bienesServicios.push(datos);

      //Clear al reporte que busca los bienes 
      this.arrDatosBienes = [];

      //Oculto el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = false;

      //console.log(datos);

      //Reset
      this.FormBusqueda.reset();

    }

  }

  ///////// Generar Solicitud de Salida /////////

  get fguardar() { return this.FormSolicitudServicios.controls; }


  e_guardar(solicitud: NgForm) {

    console.log('*Guardar');
    console.log(solicitud);

    //Alerta
    let alerta: any = {};
    let arrServivios: Array<any> = []

    let estado: string = 'OK!'
    let mensaje: string = ''

    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (solicitud.invalid) {
      console.log('error.');
      return;
    }

    // Validar que existan bienes 

    //BIENES
    if (this.bienesServicios.length == 0) {
      estado = 'ERROR!'
      mensaje += 'NO SE DETECTA NINGÚNBIEN PARA ESTA OPERACIÓN\n';
    }

    //SERVICIOS
    if (this.servicios.length == 0) {
      estado = 'ERROR!'
      mensaje += 'NO SE DETECTA SERVICIOS AGREGADO PARA ESTA OPERACIÓN\n';
    }

    //console.log(this.bienesLiberar);

    // Preparar los datos para el envio al API

    let Isolicitud: any
    let arrBienes: Array<any> = [];
    let arrDetalleBienes: Array<any> = [];

    let bienes: any
    let detBien: any

    // Validar
    if (estado == 'ERROR!') {

      let alerta: any = {};

      alerta['text'] = mensaje;
      alerta['tipo'] = 'error';
      alerta['footer'] = '';
      this.alerta(alerta);


    } else {

      this.bienesServicios.forEach((bien: any, valor: any) => {
        //Detalles Bienes
        arrDetalleBienes = [];

        bien.detallesbien.forEach((detalleBien: any, valor: any) => {

          detBien = {
            edetalleguia: detalleBien.edetalleguia,
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


      ///Servicios
      this.servicios.forEach((dato: any, valor: any) => {
        let valores = {
          eservicio: dato.eservicio
        }
        arrServivios.push(valores)
      })

      //////////////////////////////////////////////////
      //Datos del usuaro por [local storage]
      let datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);


      //Parche buscar el id del cliente por el RFC
      console.log('*Cliente')
      console.log(this.datosClientes)

      this.datosClientes.forEach((dato: any, valor: any) => {
        if (dato.trfc == solicitud.value.trfc) {
          solicitud.value.cliente = dato.ecliente;
        }
      })

      Isolicitud = {
        etransaccion: this.etransaccion,
        ecliente: solicitud.value.cliente,
        edireccion: solicitud.value.edireccion,
        ttiposolicitud: 'SERVICIO',
        tcorreo: solicitud.value.tcorreo,
        ttelefono: solicitud.value.ttelefono,
        fhfechaservicio: solicitud.value.fhfechaservicio,
        treferencia: solicitud.value.treferencia,
        emetodopago: solicitud.value.emetodopago,
        ebanco: solicitud.value.ebanco,
        ecfdi: solicitud.value.ecfdi,
        ecuenta: solicitud.value.ecuenta,
        tmoneda: solicitud.value.tmoneda,
        tobservaciones: solicitud.value.tobservaciones,
        ecodusuario: datosUsuario.ecodusuario,
        servicios: arrServivios,
        bienes: arrBienes
      }

      ///Confirmar servicios
      alerta['text'] = 'DESEA CONTINUAR ? ';
      alerta['tipo'] = 'question';
      alerta['footer'] = '';


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

    this.apiServiceSolicitudServicios.postActualizarSolicitudServicios(datos).subscribe(
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
        alerta['footer'] = "SERVICIO";

        this.alerta(alerta);
      }
    )
  }

  ///////// Eliminar /////////
  e_eliminar(datosBien: any) {

    this.bienesServicios.forEach((dato: any, valor: any) => {
      if (dato.eguia == datosBien.eguia) {
        // console.log('eliminar!');
        this.bienesServicios.splice(valor, 1);
      }
    })
  }

  //Cosnultar solicitude
  e_consultar() {
    this.router.navigate(['dashboard/customer/servicios/consultar']);
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

  //Cosnultar la solicitud web de salida del bien(es)
  e_consultarTransaccion(datos: any) {
    let Iparametros: any;
    Iparametros = {
      etransaccion: datos
    }

    this.apiServiceSolicitudServicios.postConsultarSolicitudServicio(Iparametros).subscribe(
      data => {
        //this.bienesServicios = data.mercancias
        //console.log(data.mercancias)
        this.e_procesarDatos(data)
      }
    )

    //console.log(this.bienesServicios)
  }

  ////////// Procesar Datos (parseo) /////
  e_procesarDatos(datos: any) {

    console.log('*Solicitud');
    console.log(datos);

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
    }

    this.ngformsolicitud.form.setValue(solicitud)

    //Extraer todos los bienes a liberar amparador en la solicitud
    //this.bienesServicios = datos.mercancias
    this.bienesServicios = datos.bienes

    console.log(this.bienesServicios);


    //Servicios
    this.servicios = datos.servicios


    // Change select2 
    /*$('.select2').val(datos.ecliente).trigger('change');
    let parametros = {
      ecliente: datos.ecliente
    }
    $('#ecliente').trigger('eValorCliente', parametros);
    */
    /////////////////////////////////////////////////////

  }

  e_procesarDirecciones(datos: any) {
    //console.log('datos')
    //console.log(datos)
    this.FormSolicitudServicios.controls.trfc.setValue(datos.ecliente);

    this.datosClientes.forEach((dato: any, valor: any) => {
      if (dato.ecliente == datos.ecliente) {
        //console.log(dato.direcciones)
        this.datosDirecciones = dato.direcciones
      }
    })
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/servicios/nuevo']);
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

  //agregar servicios
  get fservicios() { return this.FormServicios.controls; }

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

      this.FormServicios = new FormGroup({
        etipomercancia: new FormControl(null, Validators.required),
        etiposervicio: new FormControl(null, Validators.required),
        etiposolicitud: new FormControl(null, Validators.required),
      })
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

}
