import { Component, OnInit } from '@angular/core';
import { Form, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import 'select2';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { GlobalConstants } from 'src/app/modelos/global';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';


import { apiServiceSolicitudServicios } from 'src/app/serviciosRest/Customer/solicitudServicios/api.service.servicios'
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-crear-servicios',
  templateUrl: './crear-servicios.component.html',
  styleUrls: ['./crear-servicios.component.css']
})
export class CrearServiciosComponent implements OnInit {

  //Textarea *comentarion
  maxCaracteres: number = 150
  reglaLenght: string = ''


  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  //Selected true or false
  ngSelectTipoServicio: string = ""
  ngSelectServicios: string = ""
  ngSelectServicioEspecifico: string = ""

  //Now DATE
  now: any;

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  // Numero de orden
  etransaccion: number = 0

  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any

  //Radio Button
  selectedBusqueda = "MARCA"

  // Submit's 
  submitBusqueda = false
  submitGuardar = false
  submitServicios = false

  //Datos bien (Array)
  datosBien: Array<any> = [];
  bienesServicios: Array<any> = [];
  servicios: Array<any> = []
  arratipoServicios: Array<any> = []
  arrservicio: Array<any> = []
  arrtiposolicitud: Array<any> = []

  //Mostrar u Ocultar Div's
  divBienes: boolean = false
  divServicioEspecifico: boolean = false

  //Informativos
  informativo: string = ''

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
    // ttipocarga: new FormControl('', Validators.required),
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

  constructor(
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
    private apiCatalogos: classApiCatalogo,
    private apiServiceSolicitudServicios: apiServiceSolicitudServicios,
    private router: Router,
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

    //Date
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');

    //Configurar select2
    $('#ecliente').on('eValorCliente', (ev, dato) => {
      this.e_procesarDirecciones(dato)
    });


    $(document).ready(function () {
      //$('.select2').select2(); //initialize 
      (<any>$('.select2')).select2();
    });

    $(".select2").on("select2:select", function (e) {
      let dato_rfc: any = $(e.currentTarget).val()!
      //$('#ecliente').val(dato_rfc).trigger("change");
      let parametros = {
        ecliente: dato_rfc
      }
      $('#ecliente').trigger('eValorCliente', parametros);
    });

    ///////////////////////////////////

    //Catalogo de metodo de pago
    this.apiCatalogos.GetMetodoPago().subscribe(data => {
      this.datosMetodoPago = data;
    })

    //Catalogo de Bancos
    this.apiCatalogos.GetBancos().subscribe(data => {
      this.datosBancos = data;
    })


    //Catalogo de metodo de pago
    this.apiCatalogos.GetCfdi().subscribe(data => {
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
        ////console.log(response);
      }
    )

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
      if (datos['tipo'] == 'success') {
        if (result.isConfirmed && datos['tipo'] == 'success') {
          this.unSaved = false
          this.router.navigate(['dashboard/customer/servicios/detalle', this.etransaccion]);
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

  ///Procesar direcciones
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

  ///////// Busqueda /////////
  get fbusqueda() { return this.FormBusqueda.controls; }

  e_buscar(datos: any) {

    let alerta: any = {};
    let text = '';
    let success: boolean = true

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
        //console.log(response);

        if (response.data) {
          success = true
        }

        if (response.errors) {
          success = false
          response.errors.forEach((dato: any, index: any) => {
            //console.log(dato.attributes.text)
            text += dato.attributes.text + '\n'
          })
        }

        if (success == false) {
          this.informativo = text;

          alerta['text'] = text;
          alerta['tipo'] = "error";
          alerta['footer'] = "SERVICIO";
          this.alerta(alerta);

        } else {
          this.divBienes = true;
          //this.datosBien = response.data;
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

    //console.log(this.bienesServicios);
    this.bienesServicios.forEach((bien: any, valor: any) => {
      if (bien.eguia == datos.data[0].eguia) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA(BIEN) YA SE ENCUENTRA AGREGADO PARA LIBERAR';
    } else {

      //Show el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = true;

      this.datosBien = datos.data;
    }
  }

  ///////// Agregar /////////
  e_agregar(datos: any) {

    //console.log(datos);

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesServicios);
    this.bienesServicios.forEach((bien: any, valor: any) => {
      if (bien.eguia == datos.eguia) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA YA SE ENCUENTRA AGREGADO PARA LIBERAR';
    } else {


      //Preparara el reporte para visualizar las cargas a liberar
      this.bienesServicios.push(datos);

      //Clear al reporte que busca los bienes 
      this.datosBien = [];

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

    //console.log(datos);

    //Alerta
    let alerta: any = {};


    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (this.FormSolicitudServicios.invalid) {
      //console.log('error.');
      return;
    }
    //console.log(this.bienesLiberar);

    // Preparar los datos para el envio al API

    let Isolicitud: any
    let arrBienes: Array<any> = [];
    let arrServivios: Array<any> = []
    let arrDetalleBienes: Array<any> = [];

    let bienes: any
    let detBien: any

    //Validaciones

    let estado: string = 'OK!'
    let mensaje: string = ''

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




    // Validar
    if (estado == 'ERROR!') {

      let alerta: any = {};

      alerta['text'] = mensaje;
      alerta['tipo'] = 'error';
      alerta['footer'] = '';
      this.alerta(alerta);


    } else {

      //console.log(this.bienesLiberar);

      this.bienesServicios.forEach((datoBien: any, valor: any) => {
        //Detalles Bienes
        arrDetalleBienes = [];

        datoBien.detallesbien.forEach((detalleBien: any, valor: any) => {

          detBien = {
            edetalleguia: detalleBien.edetalleguia,
            tfactura: detalleBien.tfacturas,
            tmarcas: detalleBien.tmarcas,
            tdescripcion: detalleBien.tdescripcion,
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
          eguia: datoBien.eguia,
          ttipocarga: datoBien.ttipocarga,
          ttramite: datoBien.ttramite,
          ttipocontenedor: datoBien.ttipocontenedor,
          tmarcas: datoBien.tmarcas,
          epesoneto: datoBien.epesoneto,
          epesobruto: datoBien.epesobruto,
          ecantidad: datoBien.ecantidad,
          ecodnaviera: datoBien.ecodnaviera,
          ecodembalaje: datoBien.ecodembalaje,
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
        fhfechaservicio: datos.fhfechaservicio,
        treferencia: datos.treferencia,
        tobservaciones: datos.tobservaciones,
        ecodusuario: datosUsuario.ecodusuario,
        servicios: arrServivios,
        bienes: arrBienes
      }




      /*this.apiSalidas.postCrearSolicitudSalida(Isolicitud).subscribe(
        (response) => {
  
          if (response.data) {
            success = true
            response.data.forEach((dato: any, index: any) => {
              text += dato.attributes.text + '\n'
              if (dato.attributes.order) {
                this.lbletransaccion = dato.attributes.order
              }
            })
          }*/

      ///Confirmar servicios
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

  /// Procesar API generar solicitud
  e_generarSolicitudServicio(datos: any) {

    let alerta: any = {};

    //Consumir el servicio api
    let text = '';
    let success: boolean

    //Consumir el api
    this.apiServiceSolicitudServicios.postCrearSolicitudServicio(datos).subscribe(
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

  ///////// Eliminar /////////
  e_eliminar(datos: any) {

    this.bienesServicios.forEach((dato: any, valor: any) => {
      if (dato.eguia == datos.eguia) {
        // console.log('eliminar!');
        this.bienesServicios.splice(valor, 1);
      }
    })
  }


  e_procesar_datos_clientes(datos: any) {
    //console.log(datos.data)
    let datoClientes: Array<any> = [];
    /*datos.forEach((dato: any, index: any) => {
      datoClientes.push(dato.data);
  
    })*/
    this.datosClientes = datos.data
  }

  //Redirecionar al reporte de consultar
  e_consulta() {
    this.router.navigate(['dashboard/customer/servicios/consultar']);
  }


  //Procesar los datos los servicios para el arragles
  e_procesarDatosServicios(datos: any) {

    //console.log('datos')
    console.log(datos)
    //Clear
    this.arrservicio = []
    this.arrtiposolicitud = []

    //Seleccionar primera posicio (reset)
    this.ngSelectTipoServicio = ""
    this.ngSelectServicios = ""
    this.ngSelectServicioEspecifico = ""


    this.arratipoServicios = datos.data
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

}


