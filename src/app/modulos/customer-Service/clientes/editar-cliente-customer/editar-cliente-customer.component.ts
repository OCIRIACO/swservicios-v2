import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { apiCodigosPostales } from 'src/app/serviciosRest/api/api.codigospostales';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { serviceDatosUsuario } from 'src/app/service/service.datosUsuario'
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';

import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-editar-cliente-customer',
  templateUrl: './editar-cliente-customer.component.html',
  styleUrls: ['./editar-cliente-customer.component.css']
})
export class EditarClienteCustomerComponent implements OnInit {


  @ViewChild('formDireccionesRazonSocial') ngformDireccionRazonSocial: NgForm;
  @ViewChild('solicitudRazonSocial') ngformRazonSocial: NgForm;
  @ViewChild('clocl') divClick: ElementRef;
  //RegEx
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Datos de usuario
  datosUsuario = JSON.parse(this.serviceDatosUsuario.datosUsuario);

  //Get text colonia
  tcolonia: string = ''

  //Catalogos arreglo
  arrdatosColonia: any
  direcciones: Array<any> = [];

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Form's
  FormRazonSocial = new FormGroup({
    ecliente: new FormControl('', Validators.required),
    trazonsocial: new FormControl('', Validators.required),
    trfc: new FormControl('', Validators.required),
  })

  //contador rows tables
  contadorRow: number = 1;

  FormDireccion = new FormGroup({
    econtadorrow: new FormControl(0, Validators.required),
    edireccion: new FormControl(0, null),
    ecodigopostal: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tentidadfederativa: new FormControl('', Validators.required),
    eentidadfederativa: new FormControl('', Validators.required),
    tmunicipio: new FormControl('', Validators.required),
    emunicipio: new FormControl('', Validators.required),
    tcolonia: new FormControl('', Validators.required),
    ecolonia: new FormControl('', Validators.required),
    tcalle: new FormControl('', Validators.required),
    tnumexterior: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tnuminterior: new FormControl('', null),
  });

  //Submit's
  //submitDireccion = false;
  //submitCliente = false;

  //Label's
  lblecliente: number = 0
  lblfhfecharegistro: string = ""

  //Boolean para evitar que los usuarios abandonen accidentalmente una ruta / página
  unSaved: boolean = true;

  etransaccion: number = 0;

  constructor(
    private apiCodigoPostal: apiCodigosPostales,
    private router: Router,
    private apiCliente: apiCliente,
    private serviceDatosUsuario: serviceDatosUsuario,
    private route: ActivatedRoute,
  ) {



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

    //POST CONSULAR DETALLE
    this.etransaccion = this.route.snapshot.params['id'];

    this.apiCliente.postConsultarDetalleCliente(this.etransaccion).subscribe(
      (response) => {
        this.e_procesar_datos_cliente_detalle(response)
      }
    )

  }

  //Procesar los datos de la información del cliente
  e_procesar_datos_cliente_detalle(datos: any) {

    this.lblecliente = datos.data[0].ecliente

    let razonsocial = {
      ecliente: datos.data[0].ecliente,
      trazonsocial: datos.data[0].trazonsocial,
      trfc: datos.data[0].trfc,
    }

    this.ngformRazonSocial.form.setValue(razonsocial);

    //Direcciones


    let direccionesList: any = [];

    datos.data[0].direcciones.forEach((value: any, index: any) => {
      

      let direccion = {
        econtadorrow: this.contadorRow,
        edireccion: value.edireccion,
        ecodigopostal: value.ecodigopostal,
        tentidadfederativa: value.tentidadfederativa,
        eentidadfederativa: value.eentidadfederativa,
        tmunicipio: value.tmunicipio,
        emunicipio: value.emunicipio,
        tcolonia: value.tcolonia,
        ecolonia: value.ecolonia,
        tcalle: value.tcalle,
        tnumexterior: value.tnumexterior,
        tnuminterior: value.tnuminterior,
      };

      direccionesList.push(direccion);

      this.contadorRow++;

    })

    this.direcciones = direccionesList;

    //Label's
    this.lblfhfecharegistro = datos.data[0].fhfecharegistro

  }


  ngAfterViewInit() {

    //Iniciar los contadores
    let direccion = {
      econtadorrow: '0',
      edireccion: '0',
      ecodigopostal: '',
      tentidadfederativa: '',
      eentidadfederativa: '',
      tmunicipio: '',
      emunicipio: '',
      tcolonia: '',
      ecolonia: '',
      tcalle: '',
      tnumexterior: '',
      tnuminterior: '',
    }
    setTimeout(() => {
      this.ngformDireccionRazonSocial.form.setValue(direccion)
    },);

  }



  //Alertas
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
      if (result.isConfirmed) {

        if (result.isConfirmed && datos['tipo'] == 'success') {
          this.unSaved = false
          this.router.navigate(['dashboard/customer/clientes/detalle', this.lblecliente]);
        }
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
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        valor = result.value;
        callback(valor);
      }
    })
    return valor;
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

  //Cosultar Cp
  e_consultaCp(datos: any) {

    //Limpiar arreglo
    this.arrdatosColonia = []

    

    let parametros = {
      ecodigopostal: datos.target.value
    }

    this.apiCodigoPostal.postConsultarCodigoPostal(parametros).subscribe(
      (response) => {
        this.e_procesarDatosCodigoPostal(response)
      }
    )

  }

  //Procesar respuesta del Api de codigo postal
  e_procesarDatosCodigoPostal(datos: any) {

    this.ngformDireccionRazonSocial.form.get('tentidadfederativa')?.setValue(datos.tentidadfederativa);
    this.ngformDireccionRazonSocial.form.get('eentidadfederativa')?.setValue(datos.eestado);

    this.ngformDireccionRazonSocial.form.get('tmunicipio')?.setValue(datos.tmunicipio);
    this.ngformDireccionRazonSocial.form.get('emunicipio')?.setValue(datos.emunicipio);

    this.arrdatosColonia = datos.colonias;

  }

  //Agregar Direccion

  // Captador de Field's
  // get frmdireccion() { return this.FormDireccion.controls; }


  e_agregarDireccion(datoDireccion: NgForm) {


    //Datos de la direccion
    
    


    
    //this.submitDireccion = true;

    //Validar form
    if (datoDireccion.invalid) {
      
      return;
    }


    let direccion: any = {};
    direccion.econtadorrow = datoDireccion.value.econtadorrow;
    direccion.edireccion = datoDireccion.value.edireccion;
    direccion.ecodigopostal = datoDireccion.value.ecodigopostal;
    direccion.tentidadfederativa = datoDireccion.value.tentidadfederativa;
    direccion.eentidadfederativa = datoDireccion.value.eentidadfederativa;
    direccion.tmunicipio = datoDireccion.value.tmunicipio;
    direccion.emunicipio = datoDireccion.value.emunicipio;
    direccion.tcolonia = datoDireccion.value.tcolonia;
    direccion.ecolonia = datoDireccion.value.ecolonia;
    direccion.tcalle = datoDireccion.value.tcalle;
    direccion.tnumexterior = datoDireccion.value.tnumexterior;
    direccion.tnuminterior = datoDireccion.value.tnuminterior;


    //Eliminar registro del arreglo bienes
    if (direccion.econtadorrow != 0) {
      this.direcciones.forEach((value: any, index: any) => {
        if (value.econtadorrow == direccion.econtadorrow) {
          //Eliminar
          this.direcciones.splice(index, 1);
        }
      })
    }

    //Crear un nuevo identificador row
    direccion.econtadorrow = this.contadorRow;

    this.direcciones.push(direccion);

    //Contador++
    this.contadorRow++;

    

    //Get text select
    /*var sel = document.getElementById('ecolonia') as HTMLSelectElement | null;
    this.tcolonia = sel!.options[sel!.selectedIndex].text;

    if (this.direcciones.length == 0) {
      //Nuevo registro 
      datos.edireccion = (this.direcciones.length)
      datos.tcolonia = this.tcolonia
      this.direcciones.push(datos)
    } else {

      
      
      


      if (datos.edireccion === '') {
        //Nuevo registro
        
        
        datos.edireccion = (this.direcciones.length)
        datos.tcolonia = this.tcolonia
        this.direcciones.push(datos)
      } else {
        
        //Actualizar registro
        this.direcciones[datos.edireccion].edireccion = datos.edireccion;
        this.direcciones[datos.edireccion].ecodigopostal = datos.ecodigopostal;
        this.direcciones[datos.edireccion].tentidadfederativa = datos.tentidadfederativa;
        this.direcciones[datos.edireccion].eestado = datos.eestado;
        this.direcciones[datos.edireccion].tmunicipio = datos.tmunicipio;
        this.direcciones[datos.edireccion].emunicipio = datos.emunicipio;
        this.direcciones[datos.edireccion].ecolonia = datos.ecolonia;
        this.direcciones[datos.edireccion].tcolonia = this.tcolonia;
        this.direcciones[datos.edireccion].tcalle = datos.tcalle;
        this.direcciones[datos.edireccion].tnumexterior = datos.tnumexterior;
        this.direcciones[datos.edireccion].tnuminterior = datos.tnuminterior;
      }

    }


    

    ////Submit's
    this.submitDireccion = false;

    //Reset form
    this.FormDireccion = new FormGroup({
      edireccion: new FormControl('', null),
      ecodigopostal: new FormControl('', Validators.required),
      tentidadfederativa: new FormControl('', Validators.required),
      eestado: new FormControl('', Validators.required),
      tmunicipio: new FormControl('', Validators.required),
      emunicipio: new FormControl('', Validators.required),
      ecolonia: new FormControl('', Validators.required),
      tcalle: new FormControl('', Validators.required),
      tnumexterior: new FormControl('', Validators.required),
      tnuminterior: new FormControl('', null),
    });
*/

    //Reset

    direccion = {
      econtadorrow: 0,
      edireccion: 0,
      ecodigopostal: '',
      tentidadfederativa: '',
      eentidadfederativa: '',
      tmunicipio: '',
      emunicipio: '',
      tcolonia: '',
      ecolonia: '',
      tcalle: '',
      tnumexterior: '',
      tnuminterior: '',
    }

    this.ngformDireccionRazonSocial.form.setValue(direccion);

  }

  //Eliminar direccion
  e_eliminarDireccion(datoDireccion: any) {
    this.direcciones.forEach((dato: any, valor: any) => {
      if (dato.edireccion == datoDireccion.edireccion) {
        this.direcciones.splice(valor, 1);
      }
    })
  }

  //Editar direccion
  e_editarDireccion(datos: any) {

    
    ;

    /////////////////

    let parametros = {
      ecodigopostal: datos.ecodigopostal
    }

    this.apiCodigoPostal.postConsultarCodigoPostal(parametros).subscribe(
      (response) => {
        this.e_procesarDatosCodigoPostal(response)
      }
    )

    ////////////////

    let direccion = {
      econtadorrow: datos.econtadorrow,
      edireccion: datos.edireccion,
      ecodigopostal: datos.ecodigopostal,
      tentidadfederativa: datos.tentidadfederativa,
      eentidadfederativa: datos.eentidadfederativa,
      tmunicipio: datos.tmunicipio,
      emunicipio: datos.emunicipio,
      tcolonia: datos.tcolonia,
      ecolonia: datos.ecolonia,
      tcalle: datos.tcalle,
      tnumexterior: datos.tnumexterior,
      tnuminterior: datos.tnuminterior,
    }

    this.ngformDireccionRazonSocial.form.setValue(direccion);


    /* let direccion = {
       econtadorrow: datos.econtadorrow,
       edireccion: datos.edireccion,
       ecodigopostal: datos.ecodigopostal,
       tentidadfederativa: datos.tentidadfederativa,
       eentidadfederativa: datos.eentidadfederativa,
       tmunicipio: datos.tmunicipio,
       emunicipio: datos.emunicipio,
       tcolonia: datos.tcolonia,
       ecolonia: datos.ecolonia,
       tcalle: datos.tcalle,
       tnumexterior: datos.tnumexterior,
       tnuminterior: datos.tnuminterior,
     }
 
     this.ngformDireccionRazonSocial.form.setValue(direccion)*/


    
    

    /*this.FormDireccion = new FormGroup({
      edireccion: new FormControl(datos.edireccion, null),
      ecodigopostal: new FormControl(datos.ecodigopostal, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tentidadfederativa: new FormControl(datos.tentidadfederativa, Validators.required),
      eestado: new FormControl(datos.eestado, Validators.required),
      tmunicipio: new FormControl(datos.tmunicipio, Validators.required),
      emunicipio: new FormControl(datos.emunicipio, Validators.required),
      ecolonia: new FormControl(datos.ecolonia, Validators.required),
      tcalle: new FormControl(datos.tcalle, Validators.required),
      tnumexterior: new FormControl(datos.tnumexterior, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tnuminterior: new FormControl(datos.tnuminterior, null)
    });*/


  }

  //Guardar Cliente

  //get frmCliente() { return this.FormCliente.controls; }


  e_guardar(solicitud: NgForm) {

    let alerta: any = {};


    
    //this.submitCliente = true;

    //Validar form
    if (solicitud.invalid) {
      
      return;
    }

    //Validar que existan direcciones agregadas
    if (this.direcciones.length == 0) {
      alerta['text'] = 'AGREGAR UNA DIRECCIÓN';
      alerta['tipo'] = 'warning';
      alerta['footer'] = 'CLIENTE';
      this.alerta(alerta);
    }


    //SI todo esta correcto pasamos el consumo de crear el usuario
    let parametros: any
    let arrdireccion: Array<any> = [];

    // Recorrer los valor de la direcciones
    this.direcciones.forEach((dato: any, valor: any) => {
      let valorDireccion: any = {}

      valorDireccion.edireccion = dato.edireccion;
      valorDireccion.ecodigopostal = dato.ecodigopostal;
      valorDireccion.tentidadfederativa = dato.tentidadfederativa;
      valorDireccion.tmunicipio = dato.tmunicipio;
      valorDireccion.tcolonia = dato.tcolonia;
      valorDireccion.ecolonia = dato.ecolonia;
      valorDireccion.tcalle = dato.tcalle;
      valorDireccion.tnumexterior = dato.tnumexterior;
      valorDireccion.tnuminterior = dato.tnuminterior;


      arrdireccion.push(valorDireccion)
    })

    parametros = {
      eperfil: this.datosUsuario.eperfil,
      ecliente: solicitud.value.ecliente,
      trazonsocial: solicitud.value.trazonsocial,
      trfc: solicitud.value.trfc,
      direcciones: arrdireccion
    }

    //Clear
    alerta = []
    alerta['text'] = 'DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';
    alerta['footer'] = '';

    

    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {
        this.e_postCliente(parametros);
      }
    });
  }


  e_postCliente(datos: any) {

    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiCliente.postActualizarCliente(datos).subscribe(
      (response) => {

        if (response.data) {
          success = true
          response.data.forEach((dato: any, index: any) => {
            text += dato.attributes.text + '\n'
            if (dato.attributes.ecliente) {
              this.lblecliente = dato.attributes.ecliente
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
        alerta['footer'] = "CLIENTE";
        this.alerta(alerta);
      }
    )
  }

  //Consultar reporte de cliente
  e_consulta() {
    this.router.navigate(['dashboard/customer/clientes/consultar']);
  }


  e_changeColonia(datos: MatSelectModule) {
    
    //this.ngformDireccionRazonSocial.form.get('tcolonia')?.setValue((datos.source.selected as MatOption).viewValue);
    
  }

  //Menu
  e_menu() {
    this.router.navigate(['dashboard/customer/menu']);
  }

}
