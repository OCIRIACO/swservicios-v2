import { Component, OnInit } from '@angular/core';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { Iparametros } from 'src/app/modelos/solicitudSalidas/consultarSolicitudSalidas'
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceSolicituSalida } from 'src/app/serviciosRest/Customer/solicitudSalidas/api.service.salidas'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-actualizar-solicitud-salida',
  templateUrl: './actualizar-solicitud-salida.component.html',
  styleUrls: ['./actualizar-solicitud-salida.component.css']
})
export class ActualizarSolicitudSalidaComponent implements OnInit {

  //Textarea *comentarion
  maxCaracteres: number = 150
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

  //Form's
  FormBusqueda = new UntypedFormGroup({
    tvalor: new UntypedFormControl('', Validators.required),
    tbusqueda: new UntypedFormControl('', Validators.required)
  })


  FormSolicitudSalida = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    edireccion: new UntypedFormControl('', Validators.required),
    emetodopago: new UntypedFormControl('', Validators.required),
    ebanco: new UntypedFormControl('', Validators.required),
    ecfdi: new UntypedFormControl('', Validators.required),
    ecuenta: new UntypedFormControl('', Validators.required),
    tmoneda: new UntypedFormControl('', Validators.required),
    fhfechaservicio: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new UntypedFormControl('', Validators.required),
    treferencia: new UntypedFormControl('', null),
    tobservaciones: new UntypedFormControl('', null)
  })

  //Folio web 
  auxEsolitud: number = 0 // Variable que se llenara al realizar la peticion y NO VA SER MODIFICADA

  //Label's
  lbletransaccion: string = ''
  lblfhfecharegistro: string = ''

  constructor(private serviceCatalogos: serviceCatalogos,
    private route: ActivatedRoute,
    private router: Router,
    private apiSalidas: ApiServiceSolicituSalida,
    private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,

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
    this.nowFechaServicio = datePipe.transform(new Date(), 'yyyy-MM-dd');


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
      //console.log(dato_rfc)
      //$('#ecliente').val(dato_rfc).trigger("change");
      let parametros = {
        ecliente: dato_rfc
      }
      $('#ecliente').trigger('eValorCliente', parametros);
    });

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

    this.auxEsolitud = datos.etransaccion  // Valor que no va cambiar nunca

    //Label's informativos para el usuario nada mas
    this.lbletransaccion = datos.etransaccion
    this.lblfhfecharegistro = datos.fhfecharegistro

    this.FormSolicitudSalida = new UntypedFormGroup({
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

  get fguardar() { return this.FormSolicitudSalida.controls; }


  e_guardar(datos: any) {

    //console.log('guardar');
    //console.log(this.arrDatosBienesLiberar);

    //Alerta
    let alerta: any = {};


    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (this.FormSolicitudSalida.invalid) {
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

    Isolicitud = {
      etransaccion: this.auxEsolitud,
      ecliente: datos.ecliente,
      edireccion: datos.edireccion,
      ttiposolicitud: 'SALIDA',
      tcorreo: datos.tcorreo,
      ttelefono: datos.ttelefono,
      fhfechaservicio: datos.fhfechaservicio,
      treferencia: datos.treferencia,
      emetodopago: datos.emetodopago,
      ebanco: datos.ebanco,
      ecfdi: datos.ecfdi,
      ecuenta: datos.ecuenta,
      tmoneda: datos.tmoneda,
      ecodusuario: datosUsuario.ecodusuario,
      tobservaciones: datos.tobservaciones,
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
    this.FormSolicitudSalida.controls.ecliente.setValue(datos.ecliente);

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
