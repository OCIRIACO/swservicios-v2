import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { apiSolicitudSalidas } from 'src/app/serviciosRest/Intranet/solicitudSalidas/api.service.solicitudSalidas';

//Detalle del servicio
import { apiSolicitudServicios } from 'src/app/serviciosRest/Intranet/servicios/api.service.servicios';


import Swal from 'sweetalert2';

//pdf's
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-verificar-salidas',
  templateUrl: './verificar-salidas.component.html',
  styleUrls: ['./verificar-salidas.component.css']
})
export class VerificarSalidasComponent implements OnInit {


  
  // Div's show / hide
  divNotificacion: boolean = false


  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //Variable Get
  id?: string;

  
  //Label's
  lbletransaccion?: string;
  lblfhfecharegistro?: string;
  lbltnombreprogramo?: string;
  lbltcorreo?: string;
  lblttelefono?: string;
  lbltreferencia: string = '';
  lblfhfechaservicio: string = '';
  lblestatus: string = ''
  lblNotificacionRechazo: string = ''
  lblbanco: string = ''
  lblcuenta: string = ''
  lblmoneda: string = ''
  lblcfdi: string = ''
  lblmetodopago: string = ''
  lblalert: string = ''
  lbltipoAlerta: string = ''
  lbltrfc: string = ''
  lbltrazonsocial: string = ''
  lblttiposolicitud: string = ''
  lblecodigopostal: string = ''
  lbltentidadfederativa: string = ''
  lbltmunicipio: string = ''
  lbltcolonia: string = ''
  lbltcalle: string = ''
  lbltnumexterior: string = ''
  lbltnuminterior: string = ''
  lblobservaciones: string = ''
  lblusuarioprogramo: string = ''
  lblusuarioperfil: string = ''
  lblusuarioautoriza: string = ''
  lblfhfechaautoriza: string = ''
  lblusuarioInterno: string = 'Autorizada'
  lblFechaInterno: string = 'Fecha autorizada'

  //Select's
  datosNaviera: Array<any> = [];
  datosEmbalaje: Array<any> = [];
  datosTipoContenedor: Array<any> = [];
  datosservicios: Array<any> = []

  listDatosBienes: any;

  //Auxiliares
  testatus: string = ''

  //Pdf's para formar el pdf
  arrDatosPdf: any


  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private apiSolicitudSalidas: apiSolicitudSalidas, 
    private apiCatalogo: classApiCatalogo,
    private apiSolicitudServicios: apiSolicitudServicios

    ) { }

  ngOnInit(): void {



    //Api catalogos para los selects
    //Catalogo de naviera
    this.apiCatalogo.GetNavieras().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosNaviera.push(dato);
      });
    })

    //Catalogo de Embalajes
    this.apiCatalogo.GetEmbalajes().subscribe(data => {
      data.forEach((dato: any, index: any) => {
        this.datosEmbalaje.push(dato);
      });
    })

    //Catalogo de Tipos de contenedores
    this.apiCatalogo.GetTipoContenedores().subscribe(data => {
      this.datosTipoContenedor = data;
    })

    //Get ID URL
    this.id = this.route.snapshot.params['id'];
    this.e_consultaSolicitud(this.id);

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
        // Consultar informacion del folio  de salida
        this.e_consultaSolicitud(this.id);
        //this.router.navigate(['../dashboard/customer/entradas/detalle', this.lbletransaccion]);
      }
    })
  }

  // Consultar solicitud de salida 
  e_consultaSolicitud(idtransaccion: any) {

    let Iparametros: any;

    Iparametros = {
      etransaccion: idtransaccion
    }

    this.apiSolicitudServicios.postConsultarDetalleSolicitud(Iparametros).subscribe(
      data => {
        //console.log(data);
        this.arrDatosPdf = data  // arreglo con los datos paragenerar el pdf
        this.e_procesarDatos(data);

      }
    )

  }

 //Procesar los datos del reponse del api
 e_procesarDatos(datos: any) {

    //console.log(datos);

    //Carga(s)
    let Icarga: any;
    let IListadoCargas: Array<any> = [];

    // Nofificaciones
    let arrNotificaciones: any

    //Mercancia(s)
    let Imercancia: any;
    let IListadoMercancias: Array<any> = [];


    //Auxiliares
    let tnombreNaviera = '';
    let tnombreEmbalaje = '';
    let tnombreEmbalajeMercancia = '';

    let sellos: any = [];

    //Mercancia(s)
    IListadoCargas = [];

    //Set label's
    this.lbletransaccion = datos.etransaccion;
    this.lblfhfecharegistro = datos.fhfecharegistro;
    this.lbltnombreprogramo = 'PENDIENTE';
    this.lblttelefono = datos.ttelefono;
    this.lbltcorreo = datos.tcorreo;
    this.lblfhfechaservicio = datos.fhfechaservicio;
    this.lbltreferencia = datos.treferencia;
    this.lblestatus = datos.testatus
    this.lblbanco = datos.tbanco
    this.lblcuenta = datos.ecuenta
    this.lblmoneda = datos.tmoneda
    this.lblcfdi = datos.tclavecfdi + '-' + datos.tdescripcioncfdi
    this.lblmetodopago = datos.eclavepago + '-' + datos.tdescripcionpago
    this.lbltrfc = datos.trfc
    this.lbltrazonsocial = datos.trazonsocial
    this.lblobservaciones = datos.tobservaciones
    this.lblttiposolicitud = datos.ttiposolicitud
    this.lblecodigopostal = datos.ecodigopostal;
    this.lbltentidadfederativa = datos.tentidadfederativa;
    this.lbltmunicipio = datos.tmunicipio;
    this.lbltcolonia = datos.tcolonia;
    this.lbltcalle = datos.tcalle;
    this.lbltnumexterior = datos.tnumexterior;
    this.lbltnuminterior = datos.tnuminterior;
    this.lblusuarioprogramo = datos.tusuarioprogramo;
    this.lblusuarioperfil = datos.tperfilprogramo;
    this.lblusuarioautoriza = datos.tusuarioautoriza
    this.lblfhfechaautoriza = datos.fhfechaautoriza



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
      this.lblusuarioInterno = 'Rechazada'
      this.lblFechaInterno = 'Fecha rechazada'
    }


    //Servicios
    this.datosservicios = datos.servicios


    //arreglo notificaciones
    arrNotificaciones = datos.notificaciones

    //console.log('notificacione')
    //console.log(arrNotificaciones.length)

    if (arrNotificaciones.length != 0) {
      this.divNotificacion = true

      arrNotificaciones.forEach((dato: any, index: any) => {
        this.lblNotificacionRechazo += '* ' + dato.tobservaciones + ' ' + dato.fhfecharegistro + '<br/>'

        //document.getElementById('notificaciones')!.innerHTML = this.lblNotificacionRechazo

      })

    }









    //Set de QR's
    //this.QrManifiesto = datos.etransaccion;


    // Datos del contacto
    /*this.FormDatosGeneral = new FormGroup({
      tcorreo: new FormControl(datos.tcorreo, [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      ttelefono: new FormControl(datos.ttelefono, [Validators.required,
      Validators.pattern("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$")
      ]),
      ecodsolicitud: new FormControl(datos.ecodsolicitud, Validators.required),
      etransaccion: new FormControl(datos.etransaccion, Validators.required)
    });/*
 
    // Folio de transaccion
    /*this.lbletransaccion = datos.etransaccion;*/


    datos['bienes'].forEach((datocarga: any, index: any) => {

      //Clear
      tnombreNaviera = '';
      tnombreEmbalaje = '';
      tnombreEmbalajeMercancia = '';

      sellos = [];
      IListadoMercancias = [];

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
          tfactura: datoMercancia['tfactura'],
          tmarcas: datoMercancia['tmarcas'],
          tdescripcion: datoMercancia['tdescripcion'],
          ecantidad: datoMercancia['ecantidad'],
          epesobruto: datoMercancia['epesobruto'],
          epesoneto: datoMercancia['epesoneto'],
          tembalaje: tnombreEmbalaje,
          ecodembalaje: datoMercancia['ecodembalaje'],
          evolumen: datoMercancia['evolumen']
        }

        IListadoMercancias.push(Imercancia);


      });


      Icarga = {
        eguia: datocarga['eguia'],
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
        ttipocarga: datocarga['ttipocarga'],
        tsellos: sellos.join('/'),
        bienes: IListadoMercancias
      }


      IListadoCargas.push(Icarga);


    });


    this.listDatosBienes = IListadoCargas;

    ////console.log(JSON.stringify(this.listDatosMercancia));


  }


  //Cosnultar detalles
  e_consulta() {
    this.router.navigate(['dashboard/intranet/salidas/solicitudes']);
  }

  //Autorizar

  e_autorizar() {

    let parametros = {}
    let alerta: any = {};

    parametros = {
      eorden: this.route.snapshot.params['id']  // Folio web de GET  url
    }

    // API
    let text = '';
    let success: boolean

    this.apiSolicitudSalidas.postAutorizarSolicitudSalida(parametros).subscribe(
      (response) => {

        if (response.data) {
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
          })
        }

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "LIBERACIÓN";
        this.alerta(alerta);

      }
    )

  }
  // Alert rechazo
  alertaConfirmRechazo(callback: any) {
    let valor: boolean = false;
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Motivo de rechazar solicitud',
      inputPlaceholder: 'Escribe tu mensaje aquí...',
      inputAttributes: {
        'aria-label': 'Escribe tu mensaje aquí'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar",
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(result);
      }
    })
    return valor;
  }


  //Rechazar
  e_rechazar() {

    let alerta: any = {};
    let parametros: any = {}

    this.alertaConfirmRechazo((datos: any) => {

      if (datos.isConfirmed == true) {

        ///////////////////////////////////////////////////////////
        //Procesar el microservicios
        parametros.eorden = this.route.snapshot.params['id']
        parametros.mensaje = datos.value

        //API
        let text = '';
        let success: boolean

        this.apiSolicitudSalidas.postRechazarSolicitudSalida(parametros).subscribe(
          (response) => {


            if (response.data) {

              success = true
              response.data.forEach((dato: any, index: any) => {
                text += dato.attributes.text + '\n'
              })
            }

            alerta['text'] = text;
            alerta['tipo'] = (success == true ? "success" : "error");
            alerta['footer'] = "LIBERACIÓN";


            this.alerta(alerta);

          }
        )
        ///////////////////////////////////////////////////////////
      }
    })

  }


  
  //Imprimir pdf

  createHeaders(keys: any) {
    return keys.map((key: any) => ({
      'name': key,
      'prompt': key,
      'width': 30,
      'align': 'center',
      'cellWidth': 'wrap',
    }));
  }

  addFooters = (doc: any) => {
    ////console.log("Adding footers...");
    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)

      doc.text('©2021. Todos los derechos reservados.Desarrollado por Syntaxyz', doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 10, { align: 'center' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, { align: 'right' })
    }
  }


  e_imprimir() {

    let xHeader = 0
    let xValor = 0
    let xTitle = 0

    // arrGlobal con los datos de los bienes 

    let datoPdf: any = this.arrDatosPdf

    //let datosPdfServcios: any = this.datosservicios

    let data: any = document.getElementById('htmlSolicitudSalida');

    const options = {
      background: 'white',
      scale: 2
    };

    //html2canvas(data, options).then((canvas) => {


      var doc = new jsPDF('p', 'mm', 'a4');


      let tfontname = "helvetica"
      let tfontstylebold = "bold"
      let tfontstylenormal = "normal"

      /*------------------Operacion----------------------*/
      //doc.addFont('ArialMS', 'Arial', 'normal');     
      doc.setFontSize(8)

      xTitle = 30
      xHeader = 35
      xValor = 40

      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Operacion', 10, xTitle)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('Transacción', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.etransaccion, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Fecha de Solicitud', 40, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.fhfecharegistro, 40, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Tipo de Solicitud', 75, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.ttiposolicitud, 75, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Estatus', 100, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.testatus, 100, xValor)

      /*------------------Usuarios----------------------*/
      xTitle = 47
      xHeader = 52
      xValor = 57

      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Usuarios', 10, xTitle)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('Programada', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tusuarioprogramo, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Perfil', 60, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tperfilprogramo, 60, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text(this.lblusuarioInterno, 120, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tusuarioautoriza, 120, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text(this.lblFechaInterno, 165, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.fhfechaautoriza, 165, xValor)


      /*------------------Cliente-----------------------*/
      //doc.line(10, 40, 200, 40);

      xTitle = 64
      xHeader = 69
      xValor = 74

      doc.setFontSize(8)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Cliente', 10, xTitle)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('RFC', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltrfc, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Razon social', 50, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltrazonsocial, 50, xValor)

      xTitle = 77
      xHeader = 82
      xValor = 87

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Cp', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lblecodigopostal, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Entidad', 30, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltentidadfederativa, 30, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Municipio', 60, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltmunicipio, 60, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Colonia', 83, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltcolonia, 83, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Calle', 120, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltcalle, 120, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('No.Interior', 160, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltnuminterior, 160, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('No.Exterior', 180, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(this.lbltnumexterior, 180, xValor)

      /*------------------PAGO-----------------------*/
      //doc.line(10, 40, 200, 40);

      xTitle = 94
      xHeader = 99
      xValor = 104


      doc.setFontSize(8)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Pago', 10, xTitle)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('Método de pago', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.eclavepago + '-' + datoPdf.tdescripcionpago, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Banco', 60, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tbanco, 60, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Cfdi', 90, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tclavecfdi + '-' + datoPdf.tdescripcioncfdi, 90, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Cuenta', 145, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.ecuenta, 145, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Moneda', 160, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tmoneda, 160, xValor)


      /*------------------CONTACTO-----------------------*/

      //doc.setFont('Roboto', 'normal')
      xTitle = 111
      xHeader = 116
      xValor = 121

      doc.setFontSize(8)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Contacto', 10, xTitle)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('Fecha de servicio', 15, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.fhfechaservicio, 15, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Correo', 40, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.tcorreo, 40, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.text('Teléfono', 80, xHeader)
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.ttelefono, 80, xValor)

      doc.setFont(tfontname, tfontstylebold)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('Referencia', 100, xHeader)
      doc.setFont(tfontname, "normal")
      doc.setFont(tfontname, "normal")
      doc.text(datoPdf.treferencia, 100, xValor)

      /*------------------OBSERVACIONES-----------------------*/
      xTitle = 128
      xHeader = 133
      xValor = 138

      doc.setFontSize(8)
      doc.setFont(tfontname, tfontstylebold)
      doc.text('+ Observaciones', 10, xTitle)
      doc.setFont(tfontname, tfontstylenormal)
      doc.text(datoPdf.tobservaciones, 15, xHeader)

      /*------------------SERVICIOS-----------------------*/

      var headers = [
        { header: 'Tipo de servicio', dataKey: 'ttiposervicio' },
        { header: 'Servicio', dataKey: 'tservicio' },
      ]

      var rows: any = []

      /*datosPdfServcios.forEach((dato: any, index: any) => {

        let datoServicio: any = {}

        datoServicio.ttiposervicio = dato.ttiposervicio
        datoServicio.tservicio = dato.tservicio

        rows.push(datoServicio)

      })

      autoTable(doc, {
        styles: {
          cellWidth: 'auto',
          fontSize: 7
        },
        tableWidth: 'auto',
        columnStyles: { europe: { halign: 'center' } },
        margin: { top: 135 },
        theme: 'striped',
        body: rows,
        columns: headers
      })*/



      /*------------------BIENES-----------------------*/

      var headers = [
        { header: 'Guía', dataKey: 'eguia' },
        { header: 'Tipo carga', dataKey: 'ttipocarga' },
        { header: 'Trámite', dataKey: 'ttramite' },
        { header: 'Naviera', dataKey: 'tnaviera' },
        { header: 'Tipo contenedor', dataKey: 'ttipocontenedor' },
        { header: 'Embalaje', dataKey: 'tembalaje' },
        { header: 'Marcas', dataKey: 'tmarcas' },
        { header: 'Peso bruto', dataKey: 'epesobruto' },
        { header: 'Peso neto', dataKey: 'epesoneto' },
        { header: 'Cantidad', dataKey: 'ecantidad' },
      ]


      var rows: any = []

      datoPdf['bienes'].forEach((bien: any, index: any) => {

        let tnombreNaviera = ""
        // Busco los textos de los catalogos de la naviera ya los tengo a la mano
        this.datosNaviera.forEach((naviera: any, navindex: any) => {
          if (naviera['ecodnaviera'] == bien.ecodnaviera) {
            tnombreNaviera = naviera['tnombre']
          }
        });

        let datoBien: any = {}

        datoBien.eguia = bien.eguia
        datoBien.ttipocarga = bien.ttipocarga
        datoBien.ttramite = bien.ttramite
        datoBien.tnaviera = tnombreNaviera
        datoBien.ttipocontenedor = bien.ttipocontenedor
        datoBien.tembalaje = bien.tembalaje
        datoBien.tmarcas = bien.tmarcas
        datoBien.epesobruto = bien.epesobruto
        datoBien.epesoneto = bien.epesoneto
        datoBien.ecantidad = bien.ecantidad

        rows.push(datoBien)

      })





      autoTable(doc, {
        styles: {
          cellWidth: 'auto',
          fontSize: 7
        },
        tableWidth: 'auto',
        columnStyles: { europe: { halign: 'center' } },
        margin: { top: 100 },
        theme: 'striped',
        body: rows,
        columns: headers
      })


      this.addFooters(doc)

      doc.output('dataurlnewwindow', { filename: 'servicio.pdf' })
    //});
  }


}
