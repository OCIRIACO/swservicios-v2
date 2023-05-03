import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { GlobalConstants } from 'src/app/modelos/global';
import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios'
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceCatalogos } from 'src/app/service/service.catalogos'
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-editar-servicios',
  templateUrl: './editar-servicios.component.html',
  styleUrls: ['./editar-servicios.component.css']
})
export class EditarServiciosComponent implements OnInit {

  //Textarea *comentarion
  maxCaracteres: number = 150
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

  //Radio Button
  selectedBusqueda = "MARCA"

  // Submit's 
  submitBusqueda = false
  submitGuardar = false
  submitServicios = false


  //Form's
  FormBusqueda = new UntypedFormGroup({
    tvalor: new UntypedFormControl('', Validators.required),
    tbusqueda: new UntypedFormControl('', Validators.required)
  })


  FormSolicitudServicios = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    edireccion: new UntypedFormControl('', Validators.required),
    emetodopago: new UntypedFormControl('', Validators.required),
    ebanco: new UntypedFormControl('', Validators.required),
    ecfdi: new UntypedFormControl('', Validators.required),
    ecuenta: new UntypedFormControl('', Validators.required),
    tmoneda: new UntypedFormControl('', Validators.required),
    fhfechaservicio: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('', Validators.required),
    ttelefono: new UntypedFormControl('', Validators.required),
    treferencia: new UntypedFormControl('', null),
    tobservaciones: new UntypedFormControl('', null)

  })

  FormServicios = new UntypedFormGroup({
    etipomercancia: new UntypedFormControl(null, Validators.required),
    etiposervicio: new UntypedFormControl(null, Validators.required),
    etiposolicitud: new UntypedFormControl(null, Validators.required),
  })

  //Folio web 
  auxEsolitud: number = 0 // Variable que se llenara al realizar la peticion y NO VA SER MODIFICADA

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
        //this.rowData =  response
        ////console.log(response);
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
    this.e_consultaSolicitud(this.id);

    //// Configurar el select2

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

      // Preparar
      /*datosbien.eguia = datos.eguia
      datosbien.ttipocarga = datos.ttipocarga;
      datosbien.ttramite = datos.ttramite;
      datosbien.ttipocontenedor = datos.ttipocontenedor;
      datosbien.tmarcas = datos.tmarcas;
      datosbien.epesorecibido = datos.epesorecibido;
      datosbien.ecantidadrecibido = datos.ecantidadrecibido;*/

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


  e_guardar(datos: any) {

    //console.log('guardar');
    //console.log(this.bienesServicios);

    //Alerta
    let alerta: any = {};
    let arrServivios: Array<any> = []

    let estado: string = 'OK!'
    let mensaje: string = ''

    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (this.FormSolicitudServicios.invalid) {
      //console.log('error.');
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

      Isolicitud = {
        etransaccion: this.auxEsolitud,
        ecliente: datos.ecliente,
        edireccion: datos.edireccion,
        ttiposolicitud: 'SERVICIO',
        tcorreo: datos.tcorreo,
        ttelefono: datos.ttelefono,
        fhfechaservicio: datos.fhfechaservicio,
        treferencia: datos.treferencia,
        emetodopago: datos.emetodopago,
        ebanco: datos.ebanco,
        ecfdi: datos.ecfdi,
        ecuenta: datos.ecuenta,
        tmoneda: datos.tmoneda,
        tobservaciones: datos.tobservaciones,
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
  e_consultaSolicitud(datos: any) {
    let Iparametros: any;
    Iparametros = {
      etransaccion: datos
    }

    this.apiServiceSolicitudServicios.postConsultarSolicitudServicio(Iparametros).subscribe(
      data => {
        //this.bienesServicios = data.mercancias
        //console.log(data.mercancias)
        this.e_procesarConsultaSolicitud(data)
      }
    )

    //console.log(this.bienesServicios)
  }

  ////////// Procesar Datos (parseo) /////
  e_procesarConsultaSolicitud(datos: any) {

    this.auxEsolitud = datos.etransaccion  // Valor que no va cambiar nunca

    //Label's informativos para el usuario nada mas
    this.lbletransaccion = datos.etransaccion
    this.lblfhfecharegistro = datos.fhfecharegistro

    this.FormSolicitudServicios = new UntypedFormGroup({
      ecliente: new UntypedFormControl(datos.ecliente, Validators.required),
      edireccion: new UntypedFormControl(datos.edireccion, Validators.required),
      emetodopago: new UntypedFormControl(datos.emetodopago, Validators.required),
      ebanco: new UntypedFormControl(datos.ebanco, Validators.required),
      ecfdi: new UntypedFormControl(datos.ecfdi, Validators.required),
      ecuenta: new UntypedFormControl(datos.ecuenta, Validators.required),
      tmoneda: new UntypedFormControl(datos.tmoneda, Validators.required),
      fhfechaservicio: new UntypedFormControl(datos.fhfechaservicio, Validators.required),
      tcorreo: new UntypedFormControl(datos.tcorreo, Validators.required),
      ttelefono: new UntypedFormControl(datos.ttelefono, Validators.required),
      treferencia: new UntypedFormControl(datos.treferencia, null),
      tobservaciones: new UntypedFormControl(datos.tobservaciones, null)
    })

    //Extraer todos los bienes a liberar amparador en la solicitud
    //this.bienesServicios = datos.mercancias
    this.bienesServicios = datos.bienes


    //Servicios
    this.servicios = datos.servicios


    // Change select2 
    $('.select2').val(datos.ecliente).trigger('change');
    let parametros = {
      ecliente: datos.ecliente
    }
    $('#ecliente').trigger('eValorCliente', parametros);
    /////////////////////////////////////////////////////

  }

  e_procesarDirecciones(datos: any) {
    //console.log('datos')
    //console.log(datos)
    this.FormSolicitudServicios.controls.ecliente.setValue(datos.ecliente);

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

}
