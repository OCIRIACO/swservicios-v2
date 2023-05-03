import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/modelos/global';
import { ApiServiceSolicituSalida } from 'src/app/serviciosRest/Customer/solicitudSalidas/api.service.salidas';
import { Isolicitud, Ibienes, IdetalleBienes } from 'src/app/modelos/solicitudSalidas/solicitudSalida.inteface'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import * as $ from 'jquery';
import 'select2';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-crearsalida',
  templateUrl: './crearsalida.component.html',
  styleUrls: ['./crearsalida.component.css']
})
export class CrearsalidaComponent implements OnInit {

  constructor(private apiSalidas: ApiServiceSolicituSalida,
    private router: Router,
    private apiCatalogos: classApiCatalogo,
    private serviceDatosUsuario: serviceDatosUsuario,
    private apiCliente: apiCliente,
  ) { }

  //Textarea *comentarion
  maxCaracteres: number = 150
  reglaLenght: string = ''

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  //Now DATE
  nowFechaServicio: any;

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Form's
  FormBusqueda = new UntypedFormGroup({
    tvalor: new UntypedFormControl('', Validators.required),
    tbusqueda: new UntypedFormControl('', Validators.required)
  })

  //RegExr's
  regNumericLogitud: string = '^\\d+(?:\\.\\d{0,2})?$'
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'


  FormSolicitudSalida = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    edireccion: new UntypedFormControl('', Validators.required),
    emetodopago: new UntypedFormControl('', Validators.required),
    ebanco: new UntypedFormControl('', Validators.required),
    ecfdi: new UntypedFormControl('', Validators.required),
    ecuenta: new UntypedFormControl('',
      [
        Validators.required,
        this.regexValidador(new RegExp(this.regNumerico), { 'number': true }),
      ]

    ),
    tmoneda: new UntypedFormControl('', Validators.required),
    // ttipocarga: new FormControl('', Validators.required),
    fhfechaservicio: new UntypedFormControl('', Validators.required),
    tcorreo: new UntypedFormControl('',
      [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ]
    ),
    ttelefono: new UntypedFormControl('',
      [
        Validators.required,
        Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
      ]
    ),
    treferencia: new UntypedFormControl('', null),
    tobservaciones: new UntypedFormControl('', null)
  })

  //Radio Button
  selectedBusqueda = "MARCA"

  // Submit's 
  submitBusqueda = false
  submitGuardar = false

  //Datos bien (Array)
  datosBien: Array<any> = [];
  bienesLiberar: Array<any> = [];

  //Catalogos
  datosMetodoPago: any
  datosBancos: any
  datosCfdi: any

  //Mostrar u Ocultar Div's
  divBienes: boolean = false

  //Informativos
  informativo: string = ''

  //Label's
  lbletransaccion: string = ''  //FOLIO WEB

  // Arreglo datos del cliente que van ser llenado del API's
  datosClientes: any
  datosDirecciones: any

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

    //Configurar select2
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

  ///Procesar direcciones
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

  ///////// Busqueda /////////
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
        /*if (response.success == false) {
          this.informativo = response.errors[0].detail;
        } else {
          this.divBienes = true;
          //this.datosBien = response.data;
          this.e_procesarBusqueda(response)
        }*/

        if (response.data) {
          this.divBienes = true;
          this.e_procesarBusqueda(response)
        }


        if (response.errors) {
          //success = false
          response.errors.forEach((dato: any, index: any) => {
            //console.log(dato.attributes.text)
            this.informativo += dato.attributes.text + '\n'
          })
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
    this.bienesLiberar.forEach((bien: any, valor: any) => {
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


  ///////// Generar Solicitud de Salida /////////

  get fguardar() { return this.FormSolicitudSalida.controls; }

  e_guardar(datos: any) {

    //console.log(datos);

    //Alerta
    let alerta: any = {};
    let estado: string = 'OK!'
    let mensaje: string = ''


    //Validamos el Forms
    this.submitGuardar = true;
    // Stop en caso de detectar error
    if (this.FormSolicitudSalida.invalid) {
      //console.log('error.');
      return;
    }


    let Isolicitud: Isolicitud
    let arrBienes: Array<Ibienes> = [];
    let arrDetalleBienes: Array<IdetalleBienes> = [];

    let bienes: Ibienes
    let detBien: IdetalleBienes

    //Validaciones
    if (this.bienesLiberar.length == 0) {
      estado = 'ERROR!'
      mensaje = 'NO SE DETECTA AGREGADA NINGUN BIEN(MERCANCIA) PARA LIBERAR';
    }


    if (estado == 'ERROR!') {

      alerta['text'] = mensaje;
      alerta['tipo'] = 'error';
      alerta['footer'] = '';
      this.alerta(alerta);

    } else {

      this.bienesLiberar.forEach((datoBien: any, valor: any) => {
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
        ttiposolicitud: 'SALIDA',
        tcorreo: datos.tcorreo,
        ttelefono: datos.ttelefono,
        fhfechaservicio: datos.fhfechaservicio,
        tobservaciones: datos.tobservaciones,
        treferencia: datos.treferencia,
        ecodusuario: datosUsuario.ecodusuario,
        bienes: arrBienes
      }


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
          this.apiSalidas.postCrearSolicitudSalida(Isolicitud).subscribe(
            (response) => {

              console.log(response)

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

                console.log(text)
              }


              alerta['text'] = text;
              alerta['tipo'] = (success == true ? "success" : "error");
              alerta['footer'] = "SALIDA";
              this.alerta(alerta);
            }
          )
        }
      });







    }

  }

  ///////// Agregar /////////
  e_agregar(datos: any) {

    //console.log(datos);

    let agregados: any = false;
    //let datosbien: any = {};

    //console.log(this.bienesLiberar);
    this.bienesLiberar.forEach((bien: any, valor: any) => {
      if (bien.eguia == datos.eguia) {
        agregados = true
      }
    })

    if (agregados == true) {
      this.informativo = 'LA MERCANCIA YA SE ENCUENTRA AGREGADO PARA LIBERAR';
    } else {



      //Preparara el reporte para visualizar las cargas a liberar
      this.bienesLiberar.push(datos);

      //Clear al reporte que busca los bienes 
      this.datosBien = [];

      //Oculto el reporte de los bienes que se realizo con el boton [buscar]
      this.divBienes = false;

      //console.log(datos);

      //Reset
      this.FormBusqueda.reset();

    }


  }

  ///////// Eliminar /////////
  e_eliminar(datosBien: any) {

    this.bienesLiberar.forEach((dato: any, valor: any) => {
      if (dato.eguia == datosBien.eguia) {
        // console.log('eliminar!');
        this.bienesLiberar.splice(valor, 1);
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
    this.router.navigate(['dashboard/customer/salidas/consultar']);
  }

}

