import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/modelos/global';
import { classApiCatalogo } from 'src/app/serviciosRest/api/api.service.catalogos';
import { ApiServiceManifiesto } from 'src/app/serviciosRest/Customer/solicitudEntradas/api.service.manifiesto';
import { Iparametros } from 'src/app/modelos/solicitudEntradas/datosconsultamanifiesto.interfase';
import { Icarga, Imercancia } from 'src/app/modelos/solicitudEntradas/datosformulariomanifiesto.interfase';
import { jsPDF } from 'jspdf'
//pdf's
//import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'

import { serviceCatalogos } from 'src/app/service/service.catalogos'

@Component({
  selector: 'app-entrada-damage',
  templateUrl: './entrada-damage.component.html',
  styleUrls: ['./entrada-damage.component.css']
})
export class EntradaDamageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiManifiesto: ApiServiceManifiesto,
    private apiCatalogo: classApiCatalogo,
    private serviceCatalogos: serviceCatalogos,

  ) { }

  // htmlCara
  html_cara: string = ""

  //Crear los componener de la cara del tipo de damage
  htmlDamage: string = ''
  damageConfig: any = {}

  //Qr
  QrManifiesto: string = '';

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Variable Get
  id?: string;

  //Label's

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
  datosNaviera: any = [];
  datosEmbalaje: Array<any> = [];
  datosTipoContenedor: Array<any> = [];

  //Arreglos
  listDatosBienes: any;
  listDamage: Array<any> = []

  //Pdf's
  arrDatosPdf: any
  arrDamage: Array<any> = []


  ngOnInit(): void {

    //Catalogos
    this.datosNaviera = this.serviceCatalogos.catalogoNavieras

    this.datosEmbalaje = this.serviceCatalogos.catalogoEmbalajes



    //Consultar
    this.id = this.route.snapshot.params['id'];
    this.e_consultaManifiesto(this.id);
  }

  /// Consulta de manifiesto
  e_consultaManifiesto(idtransaccion: any) {

    // Root
    let Iparametros: Iparametros;

    let productos: any = [];

    Iparametros = {
      etransaccion: idtransaccion
    }


    /*this.apiManifiesto.postConsultaManifiesto(Iparametros).subscribe(
      data => {
        productos = data;
        //Pdf's arrego para transformar los pdf
        this.arrDatosPdf = data
        //Datos pdf
       
        this.e_procesarDatosPost(productos);
      }
    )*/

    this.arrDatosPdf = GlobalConstants.arrEntrada;
    this.e_procesarDatosPost(GlobalConstants.arrEntrada)

  }

  //Procesar Datos
  e_procesarDatosPost(datos?: any) {

    ;

    //Carga(s)
    let Icarga: any = {};
    let IListadoCargas: Array<Icarga> = [];

    //Mercancia(s)
    let Imercancia: Imercancia;
    let IListadoMercancias: Array<Imercancia> = [];


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
    this.lblbanco = datos.tbanco
    this.lblcuenta = datos.ecuenta
    this.lblmoneda = datos.tmoneda
    this.lblcfdi = datos.tclavecfdi + '-' + datos.tdescripcioncfdi
    this.lblmetodopago = datos.eclavepago + '-' + datos.tdescripcionpago
    this.lbltrfc = datos.trfc
    this.lbltrazonsocial = datos.trazonsocial
    this.lblttiposolicitud = datos.ttiposolicitud
    this.lblobservaciones = datos.tobservaciones
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
    this.lblestatus = datos.testatus


    //Set de QR's
    this.QrManifiesto = datos.etransaccion;


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

      if (this.id == datocarga.eguia) {

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
        })




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

          // Filtrar solo el bien espefico



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

        //Cargar datos en el arreglo que lo necesitare para temas de pintar el EIR
        this.arrDamage = datocarga['damage']


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
          damage: datocarga['damage'],
          bienes: IListadoMercancias
        }


        IListadoCargas.push(Icarga);

      }

    });



    this.listDatosBienes = IListadoCargas;

    


  }



  //Regresar al modulo de consulta
  e_consulta() {
    this.router.navigate(['dashboard/customer/entradas/consulta']);
  }

  //Redireccionar para crear una nueva solicitud
  e_nuevo() {
    this.router.navigate(['dashboard/customer/entradas/nuevo']);
  }


  //Imprimir
  generateData = function (amount: any) {
    var result = [];
    var data = {
      No: "1",
      Tramite: "dato2",
      Carga: "dato3",
      Embalaje: "dato4",
      Naviera: "dato5",
      Contenedor: "dato6",
      Tipo: "dato7",
      Sello: "dato8",
      Peso_neto: "dato9",
      Peso_bruto: "dato10",
      Bultos: "dato11"
    };
    for (var i = 0; i < amount; i += 1) {
      data.No = (i + 1).toString();
      result.push(Object.assign({}, data));
    }
    return result;
  };


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
    
    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)

      doc.text('©2021. Todos los derechos reservados.Desarrollado por Syntaxyz', doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 10, { align: 'center' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, { align: 'right' })
    }
  }

  async e_imprimir() {

    // arrGlobal con los datos de los bienes 


    let xHeader = 0
    let xValor = 0
    let xTitle = 0

    let datoPdf: any = this.arrDatosPdf

    let data: any = document.getElementById('htmlSolicitudEntrada');

    const options = {
      background: 'white',
      scale: 2
    }



    var doc = new jsPDF('p', 'mm', 'a4');


    let tfontname = "helvetica"
    let tfontstylebold = "bold"
    let tfontstylenormal = "normal"

    /*------------------Operacion----------------------*/
    //doc.addFont('ArialMS', 'Arial', 'normal');     
    doc.setFontSize(8)

    xTitle = 20
    xHeader = 25
    xValor = 30

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
    xTitle = 35
    xHeader = 40
    xValor = 45

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

    xTitle = 50
    xHeader = 55
    xValor = 60

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

    xTitle = 63
    xHeader = 68
    xValor = 73

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
    /*------------------BIENES-----------------------*/

    var headers = [
      { header: 'Guía', dataKey: 'eguia' },
      { header: 'Tipocarga', dataKey: 'ttipocarga' },
      { header: 'Trámite', dataKey: 'ttramite' },
      { header: 'Codnaviera', dataKey: 'ecodnaviera' },
      { header: 'Tipocontenedor', dataKey: 'ttipocontenedor' },
      { header: 'Codembalaje', dataKey: 'ecodembalaje' },
      { header: 'Marcas', dataKey: 'tmarcas' },
      { header: 'Pesobruto', dataKey: 'epesobruto' },
      { header: 'Pesoneto', dataKey: 'epesoneto' },
      { header: 'Cantidad', dataKey: 'ecantidad' },
    ]


    var rows: any = []

    datoPdf['bienes'].forEach((bien: any, index: any) => {
      if (this.id == bien.eguia) {
        let datoBien: any = {}
        datoBien.eguia = bien.eguia
        datoBien.ttipocarga = bien.ttipocarga
        datoBien.ttramite = bien.ttramite
        datoBien.ecodnaviera = bien.ecodnaviera
        datoBien.ttipocontenedor = bien.ttipocontenedor
        datoBien.ecodembalaje = bien.ecodembalaje
        datoBien.tmarcas = bien.tmarcas
        datoBien.epesobruto = bien.epesobruto
        datoBien.epesoneto = bien.epesoneto
        datoBien.ecantidad = bien.ecantidad
        datoBien.damage = bien.damage
        rows.push(datoBien)
      }
    })



    autoTable(doc, {
      styles: {
        cellWidth: 'auto',
        fontSize: 7
      },
      tableWidth: 'auto',
      columnStyles: { europe: { halign: 'center' } },
      margin: { top: 80 },
      theme: 'striped',
      body: rows,
      columns: headers
    })

    //Damage


    var headers = [
      { header: '#', dataKey: 'eid' },
      { header: 'Tipo', dataKey: 'ttipo' },
      { header: 'Coordenada', dataKey: 'tcoordenada' },
      { header: 'Posición', dataKey: 'tposicion' },
      { header: 'Cara', dataKey: 'ttipocara' },
      { header: 'Daño', dataKey: 'tdano' },
    ]



    autoTable(doc, {
      styles: {
        cellWidth: 'auto',
        fontSize: 7
      },
      tableWidth: 100,
      columnStyles: { europe: { halign: 'center' } },
      margin: { top: 100, left: 95 },
      theme: 'striped',
      body: rows[0].damage,
      columns: headers
    })


    var caras = [
      { cara: 'BOTTON' }
      , { cara: 'UNDER' }
      , { cara: 'TOP' }
      , { cara: 'DOOR' }
      , { cara: 'LEFT' }
      , { cara: 'RIGHT' }
      , { cara: 'FRONT' }
    ]

    let div: string = ""

    caras.forEach(async (dato: any, index: any) => {

      

      this.e_control_damage(dato)
      
      //let div = this.html_cara

      div += this.html_cara + '<br>'



    })

    await doc.html(div, {
      html2canvas: {
        scale: 0.2
      },
      x: 15,
      y: 100
    });

    //doc.addPage(this.html_cara);
    //doc.fromHTML('+ Servicio', 10, 120)
    //   doc = new jsPDF('p', 'pt', 'letter');





    this.addFooters(doc)

    // doc.save('Damage_'+this.id+'.pdf'); // save / download
    doc.output('dataurlnewwindow', { filename: 'servicio.pdf' })


    //doc.output('dataurlnewwindow', { filename: 'damage.pdf' })
    // } );

  }


  // Configuracion del damage
  e_control_damage(dato: any) {
    let columnas: number = 0;
    let cara: string;

    cara = dato.cara
    columnas = 6

    if (cara == 'BOTTON') {
      this.damageConfig.cara = 'BOTTON'
      this.damageConfig.columnas = columnas
      this.damageConfig.filas = 3
      this.damageConfig.letras = 'L|R'

    } else if (cara == 'UNDER') {

      this.damageConfig.cara = 'UNDER'
      this.damageConfig.columnas = columnas
      this.damageConfig.filas = 3
      this.damageConfig.letras = 'L|R'

    } else if (cara == 'TOP') {

      this.damageConfig.cara = 'TOP'
      this.damageConfig.columnas = columnas
      this.damageConfig.filas = 3
      this.damageConfig.letras = 'L|R'

    } else if (cara == 'DOOR') {

      this.damageConfig.cara = 'DOOR'
      this.damageConfig.columnas = 5
      this.damageConfig.filas = 5
      this.damageConfig.letras = 'H|T|B|G'

    } else if (cara == 'LEFT') {

      this.damageConfig.cara = 'LEFT'
      this.damageConfig.columnas = columnas
      this.damageConfig.filas = 5
      this.damageConfig.letras = 'H|T|B|G'

    } else if (cara == 'RIGHT') {

      this.damageConfig.cara = 'RIGHT'
      this.damageConfig.columnas = columnas
      this.damageConfig.filas = 5
      this.damageConfig.letras = 'H|T|B|G'

    } else if (cara == 'FRONT') {

      this.damageConfig.cara = 'FRONT'
      this.damageConfig.columnas = 5
      this.damageConfig.filas = 5
      this.damageConfig.letras = 'H|T|B|G'

    }

    this.e_cara_damage(this.damageConfig)
  }

  // Contruccion del htlm de la cara de damage
  e_cara_damage(datos: any) {

    //Crear 
    let html: string = '';  //default
    let contador1: number;   //default
    let contador2: number;   //default

    let auxCara: string = '';

    let cara: string
    let auxColumnas: number
    let columnas: number
    let filas: number
    let letras: string
    let letra: any = '';

    contador1 = 0;

    cara = datos.cara
    auxColumnas = datos.columnas
    columnas = datos.columnas
    filas = datos.filas
    letras = datos.letras

    //Iniciar

    html += '<div class="col-xl-12" style="text-align: center"> <h6 class="tx-color-01 mg-b-3">' + cara + '</h6></div>'
    html += '<table border="1"  style="width:290px; height:25px; border-spacing: 0.5rem; "   bordercolor="#0000FF" cellspacing="10" cellpadding="10"s  >';
    //html +='<caption>'+cara+'</caption>'
    //html += '<tbody>';

    // html += '<tr>';
    // html += '<td colspan="' + columnas + '">' + cara + '</td>';
    // html += '</tr>';


    for (let x = 1; x <= filas; x++) {
      contador2 = 0;
      html += '<tr>';

      if (x == 1) {

        for (let y = 1; y <= columnas; y++) {

          if (y == 1) {
            html += '<td>' + '' + '</td>'
          } else if (y > 11) {

            if (cara == 'RIGHT' || cara == 'BOTTON' || cara == 'UNDER' || cara == 'TOP') {
              auxCara = 'F<BR>R<BR>O<BR>N<BR>T'
            } else if (cara == 'LEFT') {
              auxCara = 'D<BR>O<BR>O<BR>R'
            }

            html += '<td rowspan="' + filas + '">' + auxCara + '</td>';
          } else {

            if (cara == 'RIGHT' || cara == 'BOTTON' || cara == 'DOOR' || cara == 'UNDER' || cara == 'TOP') {
              contador1 = y - 1
            } else if (cara == 'LEFT') {
              contador1 = auxColumnas - y
            } else if (cara == 'FRONT') {
              contador1 = (auxColumnas - y) + 1
            }
            html += '<td>' + contador1 + '</td>';
          }
        }

      } else {

        contador1 = x - 1
        letra = letras.split("|");

        let splitLetra = letra[(contador1 - 1)]

        

        for (let y = 1; y <= columnas; y++) {
          if (y == 1) {
            html += '<td>' + splitLetra + '</td>'
          } else if (y > 11) {
            html += ''
          } else {

            contador2 = y - 1

            // html += '<td>' + letra + '</td>'

            let contador: number = 0
            let color: string = ""

            this.listDatosBienes[0].damage.forEach(async (dato: any, index: any) => {
              if (cara == dato.ttipocara) {
                if ((splitLetra + contador2) == dato.tcoordenada) {
                  contador++;
                  color = "red"
                }
              }
            })

            html += '<td  style="text-align: center" bgcolor="' + color + '" zona="damage" letra="' + splitLetra + '" id= "' + splitLetra + '' + contador2 + '"  coordenada= "' + splitLetra + '' + contador2 + '">' + '<font color="#fff">' + contador + '</font>' + '</td>';

          }
        }
      }
      html += '</tr>';
    }

    //html += '</tbody>';
    html += '</table>';

    

    this.html_cara = html

    //this.htmlDamage = html;
    //document.getElementById('htmlDamage')!.innerHTML = html;
    ;

  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
