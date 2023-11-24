import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceHistorial } from 'src/app/serviciosRest/Intranet/historial/api.service.historial'
import { GlobalConstants } from 'src/app/modelos/global';
//import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';


export interface IdataHistorico {
    eguia : number,
    ttipocarga: string,
    ttramite: string,
    tnaviera: string,
    ttipocontendor: string,
    tembalaje: string,
    tmarcas: string,
    epesorecibido: number,
    ecantidadrecibido:number,
    fhfechaentrada: string,
    fhfechasalida: string,
    tmovimiento: string,
    sellos: Array<any>,
    detallebienes: Array<any>,
    bitacora: Array<any>

}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  columnasHistorico: string[] = ['acciones','eguia','ttipocarga','ttramite','tnaviera','ttipocontendor','tembalaje','tmarcas','epesorecibido','ecantidadrecibido','fhfechaentrada','fhfechasalida','tmovimiento'];
  datosHistorico = new MatTableDataSource<IdataHistorico>([]);
  
  constructor(private apiHistorial: ApiServiceHistorial) {
  }

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  opcion: string = '';

  listbienes: Array<any> = [];

  sellos: Array<any> = [];
  movimientos: Array<any> = [];
  detallebienes: Array<any> = [];

  //Form Busqueda
  FormBusqueda = new FormGroup({
    tbusqueda: new FormControl('', Validators.required),
    tvalor: new FormControl('', Validators.required),
  })

  // Submit's 
  submitBusqueda = false

  //Mostrar u Ocultar Div's
  divPanels: boolean = false
  divOpcionesBusqueda: boolean = true

  //Dinamico
  informativo: string = '';
  lblopcionesBusqueda: string = '[ - Opciones de busqueda ]' //Default cambia de valor con la interacción del formulario
  PlaceholderBusqueda: string = 'Ingresar número de guía'     //Default cambia de valor con la interacción del formulario

  //Radio Button
  selectedBusqueda = "MARCA"

  ngOnInit(): void {

    this.opcion = 'Zona de titulo'

    // Codigo para efecto de expandir la plantilla

    $('.chat-item').on('click', function (e) {
      $(this).addClass('selected').removeClass('unread');
      $(this).siblings().removeClass('selected');

      if (window.matchMedia('(max-width: 767px)').matches) {
        $('body').addClass('chat-body-show');
        $('#menuMain').addClass('d-none');
        $('#menuBack').removeClass('d-none');
      }
    })

    $('#menuBack').on('click', function (e) {
      e.preventDefault();
      $('body').removeClass('chat-body-show');
      $('#menuMain').removeClass('d-none');
      $('#menuBack').addClass('d-none');
    })
    ////////////////////////////////////////////////
  }

  ///////// Busqueda /////////
  get fbusqueda() { return this.FormBusqueda.controls; }

  e_buscar(datos: any) {


    //Mostrar u Ocultar Div's
    this.divPanels = false

    //Clear
    this.sellos = []
    this.movimientos = []
    this.detallebienes = []
    this.listbienes = []
    this.informativo = ''

    //Validamos el Forms
    this.submitBusqueda = true;


    // Stop en caso de detectar error
    if (this.FormBusqueda.invalid) {
      //console.log('error.');
      return;
    }

    //console.log(datos);

    this.apiHistorial.postConsultaHistorial(datos).subscribe(
      (response) => {
        //this.e_procesar_datos(response);
        this.datosHistorico.data = response as IdataHistorico[];
        this.datosHistorico.paginator = this.paginator;
      }
    )

    //Reset
    //this.FormBusqueda.reset();
    this.submitBusqueda = false;

  }

  e_procesar_datos(datos: any) {

    this.listbienes = []
    let bienes: any = {};

    //this.divPanels =  true;

    if (datos.length == 0) {
      this.informativo = 'Verificar información capturada!'
    }

    datos.forEach((dato: any, index: any) => {

      bienes = {}

      bienes['eguia'] = dato.eguia;
      bienes['ttipocarga'] = dato.ttipocarga;
      bienes['ttramite'] = dato.ttramite;
      bienes['tnaviera'] = dato.tnaviera;
      bienes['ttipocontendor'] = dato.ttipocontendor;
      bienes['tembalaje'] = dato.tembalaje;
      bienes['tmarcas'] = dato.tmarcas;
      bienes['epesorecibido'] = dato.epesorecibido;
      bienes['ecantidadrecibido'] = dato.ecantidadrecibido;
      bienes['fhfechaentrada'] = dato.fhfechaentrada;
      bienes['fhfechasalida'] = dato.fhfechasalida;
      bienes['tmovimiento'] = dato.tmovimiento;
      bienes['sellos'] = dato.sellos;
      bienes['detallebienes'] = dato.detallebienes;
      bienes['bitacora'] = dato.bitacora;

      this.listbienes.push(bienes);

    });

  }

  e_verdetalle(datos: any) {


    //Mostrar u Ocultar Div's
    this.divPanels = false

    this.divPanels = true

    this.sellos = []
    this.movimientos = []
    this.detallebienes = []

    //Sellos
    let datosello: any = {}
    datos.sellos.forEach((dato: any, valor: any) => {
      datosello = {}
      datosello['tsello'] = dato.tsello;
      datosello['ttiposello'] = dato.ttiposello;
      this.sellos.push(datosello);
    })

    //Detalle bienes
    let datoDetBienes: any = {}
    datos.detallebienes.forEach((dato: any, valor: any) => {
      datoDetBienes = {}
      datoDetBienes['tmarcas'] = dato.tmarcas;
      datoDetBienes['tdescripcion'] = dato.tdescripcion;
      datoDetBienes['epesobruto'] = dato.epesobruto;
      datoDetBienes['epesoneto'] = dato.epesoneto;
      datoDetBienes['ecantidad'] = dato.ecantidad;
      datoDetBienes['evolumen'] = dato.evolumen;
      datoDetBienes['tposicion'] = dato.tposicion;
      this.detallebienes.push(datoDetBienes);

    });

    //Movimientos
    let datobitacora: any = {}

    datos.bitacora.forEach((dato: any, valor: any) => {
      datobitacora = {}
      datobitacora['ttipocarga'] = dato.ttipocarga;
      datobitacora['ttramite'] = dato.ttramite;
      datobitacora['tnombrecorto'] = dato.tnombrecorto;
      datobitacora['ttipocontenedor'] = dato.ttipocontenedor;
      datobitacora['embalaje'] = dato.embalaje;
      datobitacora['tmarcas'] = dato.tmarcas;
      datobitacora['epesomanifestado'] = dato.epesomanifestado;
      datobitacora['epesorecibido'] = dato.epesorecibido;
      datobitacora['epesoliberado'] = dato.epesoliberado;
      datobitacora['epesoentregado'] = dato.epesoentregado;
      datobitacora['ecantidadmanifestado'] = dato.ecantidadmanifestado;
      datobitacora['ecantidadrecibido'] = dato.ecantidadrecibido;
      datobitacora['ecantidadliberado'] = dato.ecantidadliberado;
      datobitacora['ecantidadentregado'] = dato.ecantidadentregado;
      datobitacora['fhfechaentrada'] = dato.fhfechaentrada;
      datobitacora['fhfechasalida'] = dato.fhfechasalida;
      datobitacora['tmovimiento'] = dato.tmovimiento;
      datobitacora['tposicion'] = dato.tposicion;
      datobitacora['tdescripcion'] = dato.tdescripcion;
      datobitacora['usuario'] = dato.usuario;
      datobitacora['fhfecharegistro'] = dato.fhfecharegistro;
      this.movimientos.push(datobitacora);
    })
  }

  e_opcionesBusqueda() {
    if (this.divOpcionesBusqueda == false) {
      this.lblopcionesBusqueda = '[ - Opciones de busqueda ]';
      this.divOpcionesBusqueda = true;

    } else if (this.divOpcionesBusqueda == true) {
      this.lblopcionesBusqueda = '[ + Opciones de busqueda ]';
      this.divOpcionesBusqueda = false;
    }
  }

  e_radioOpciones(dato: any) {

    //console.log(dato.target.id);

    this.PlaceholderBusqueda = ''

    let tipoBusqueda = dato.target.id;

    if (tipoBusqueda == 'tmarca') {
      this.PlaceholderBusqueda = 'Ingresar marca: TCLU1234567'     //Default cambia de valor con la interacción del formulario
    } else if (tipoBusqueda == 'eguia') {
      this.PlaceholderBusqueda = 'Ingresar número de guía'     //Default cambia de valor con la interacción del formulario
    } else if (tipoBusqueda == 'efolioweb') {
      this.PlaceholderBusqueda = 'Ingresar número de Folio Web'     //Default cambia de valor con la interacción del formulario

    }

  }
}
