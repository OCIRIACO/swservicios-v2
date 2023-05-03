import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { apiCodigosPostales } from 'src/app/serviciosRest/api/api.codigospostales';
import { apiCliente } from 'src/app/serviciosRest/Customer/cliente/api.service.cliente';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-editar-cliente-customer',
  templateUrl: './editar-cliente-customer.component.html',
  styleUrls: ['./editar-cliente-customer.component.css']
})
export class EditarClienteCustomerComponent implements OnInit {

  //RegEx
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'


  //Get text colonia
  tcolonia: string = ''

  //Catalogos arreglo
  arrdatosColonia: any
  arrdatosDireccion: Array<any> = [];

  //Path base
  directorio: string = GlobalConstants.pathCustomer;

  //Form's
  FormCliente = new UntypedFormGroup({
    ecliente: new UntypedFormControl('', Validators.required),
    trazonsocial: new UntypedFormControl('', Validators.required),
    trfc: new UntypedFormControl('', Validators.required),
  })

  FormDireccion = new UntypedFormGroup({
    eindex: new UntypedFormControl('', null),
    edireccion: new UntypedFormControl('', null),
    ecodigopostal: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tentidadfederativa: new UntypedFormControl('', Validators.required),
    eestado: new UntypedFormControl('', Validators.required),
    tmunicipio: new UntypedFormControl('', Validators.required),
    emunicipio: new UntypedFormControl('', Validators.required),
    ecolonia: new UntypedFormControl('', Validators.required),
    tcalle: new UntypedFormControl('', Validators.required),
    tnumexterior: new UntypedFormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tnuminterior: new UntypedFormControl('', null),
  });

  //Submit's
  submitDireccion = false;
  submitCliente = false;

  //Label's
  lblecliente: number = 0
  lblfhfecharegistro: string = ""

  //Variable Get
  id: string = "";

  //Boolean para el alert cuando se quiere salir de la pagina
  unSaved: boolean = true;

  constructor(
    private apiCliente: apiCliente,
    private route: ActivatedRoute,
    private apiCodigoPostal: apiCodigosPostales,
    private router: Router,
  ) { }

  //funcion para detectar que se quiere salir del modulo
  canDeactivate(): Observable<boolean> | boolean {
    if (this.unSaved) {
      const result = window.confirm('Hay cambios sin guardar, ¿desea descartarlos?');
      return of(result);
    }
    return true;
  }

  ngOnInit(): void {

    //POST CONSULAR DETALLE
    this.id = this.route.snapshot.params['id'];

    this.apiCliente.postConsultarDetalleCliente(this.id).subscribe(
      (response) => {
        this.e_procesar_datos_cliente_detalle(response)
      }
    )

  }


  //Get text colonia
  /*onChangeTcolonia($event: any) {
    this.tcolonia = $event.target.options[$event.target.options.selectedIndex].text;
  }*/

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

  //Procesar los datos de la información del cliente
  e_procesar_datos_cliente_detalle(datos: any) {

    //ecliente
    this.lblecliente = datos.data[0].ecliente

    this.FormCliente = new UntypedFormGroup({
      ecliente: new UntypedFormControl(datos.data[0].ecliente, Validators.required),
      trazonsocial: new UntypedFormControl(datos.data[0].trazonsocial, Validators.required),
      trfc: new UntypedFormControl(datos.data[0].trfc, Validators.required),
    })


    //arreglo
    this.arrdatosDireccion = datos.data[0].direcciones


    //Label's
    this.lblfhfecharegistro = datos.data[0].fhfecharegistro
  }

  //Cosultar Cp
  e_consultaCp(datos: any) {

    //Limpiar arreglo
    this.arrdatosColonia = []

    console.log(datos.target.value)

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
    console.log(datos)

    this.FormDireccion.controls['tentidadfederativa'].setValue(datos.tentidadfederativa);
    this.FormDireccion.controls['eestado'].setValue(datos.eestado);
    this.FormDireccion.controls['tmunicipio'].setValue(datos.tmunicipio);
    this.FormDireccion.controls['emunicipio'].setValue(datos.emunicipio);

    this.arrdatosColonia = datos.colonias;

  }

  //Agregar Direccion

  // Captador de Field's
  get frmdireccion() { return this.FormDireccion.controls; }


  e_agregarDireccion(datos: any) {

    //Datos de la direccion
    console.log('Direcciones')
    console.log(datos)

    ////console.log(form);
    this.submitDireccion = true;

    //Validar form
    if (this.FormDireccion.invalid) {
      //console.log('error.');
      return;
    }

    //Get text select
    var sel = document.getElementById('ecolonia') as HTMLSelectElement | null;
    this.tcolonia = sel!.options[sel!.selectedIndex].text;


    if (this.arrdatosDireccion.length == 0) {
      //Nuevo registro 
      datos.edireccion = 0;
      datos.tcolonia = this.tcolonia
      this.arrdatosDireccion.push(datos)
    } else {

      //console.log('Nivel 2')
      //console.log(datos)
      //console.log(datos.edireccion)




      if (datos.edireccion === '') {
        //Nuevo registro
        //console.log('*Nuevo')
        //console.log(datos.edireccion)
        datos.edireccion = 0
        datos.eindex = (this.arrdatosDireccion.length)
        datos.tcolonia = this.tcolonia
        this.arrdatosDireccion.push(datos)
      } else {
        //console.log('*Actualizar')
        //Actualizar registro
        /*
        this.arrdatosDireccion[datos.edireccion].edireccion = datos.edireccion;
        this.arrdatosDireccion[datos.edireccion].ecodigopostal = datos.ecodigopostal;
        this.arrdatosDireccion[datos.edireccion].tentidadfederativa = datos.tentidadfederativa;
        this.arrdatosDireccion[datos.edireccion].eestado = datos.eestado;
        this.arrdatosDireccion[datos.edireccion].tmunicipio = datos.tmunicipio;
        this.arrdatosDireccion[datos.edireccion].emunicipio = datos.emunicipio;
        this.arrdatosDireccion[datos.edireccion].tcolonia = datos.tcolonia;
        this.arrdatosDireccion[datos.edireccion].tcalle = datos.tcalle;
        this.arrdatosDireccion[datos.edireccion].tnumexterior = datos.tnumexterior;
        this.arrdatosDireccion[datos.edireccion].tnuminterior = datos.tnuminterior;
        */

        //if(this.tcolonia ==''){

        // }

        this.arrdatosDireccion.forEach((dato: any, valor: any) => {

          if (dato.edireccion == datos.edireccion) {
            //console.log('Encontrado index:'+valor)

            this.arrdatosDireccion[valor].eindex = datos.eindex;
            this.arrdatosDireccion[valor].edireccion = datos.edireccion;
            this.arrdatosDireccion[valor].ecodigopostal = datos.ecodigopostal;
            this.arrdatosDireccion[valor].tentidadfederativa = datos.tentidadfederativa;
            this.arrdatosDireccion[valor].eestado = datos.eestado;
            this.arrdatosDireccion[valor].tmunicipio = datos.tmunicipio;
            this.arrdatosDireccion[valor].emunicipio = datos.emunicipio;
            this.arrdatosDireccion[valor].ecolonia = datos.ecolonia;
            this.arrdatosDireccion[valor].tcolonia = this.tcolonia;
            this.arrdatosDireccion[valor].tcalle = datos.tcalle;
            this.arrdatosDireccion[valor].tnumexterior = datos.tnumexterior;
            this.arrdatosDireccion[valor].tnuminterior = datos.tnuminterior;

          }

        })


      }

    }


    //console.log(this.arrdatosDireccion)

    ////Submit's
    this.submitDireccion = false;

    //Reset form
    this.FormDireccion = new UntypedFormGroup({
      eindex: new UntypedFormControl('', null),
      edireccion: new UntypedFormControl('', null),
      ecodigopostal: new UntypedFormControl('', Validators.required),
      tentidadfederativa: new UntypedFormControl('', Validators.required),
      eestado: new UntypedFormControl('', Validators.required),
      tmunicipio: new UntypedFormControl('', Validators.required),
      emunicipio: new UntypedFormControl('', Validators.required),
      ecolonia: new UntypedFormControl('', Validators.required),
      tcalle: new UntypedFormControl('', Validators.required),
      tnumexterior: new UntypedFormControl('', Validators.required),
      tnuminterior: new UntypedFormControl('', null),
    });

  }

  //Eliminar direccion
  e_eliminarDireccion(datoDireccion: any) {
    this.arrdatosDireccion.forEach((dato: any, valor: any) => {
      if (dato.edireccion == datoDireccion.edireccion) {
        this.arrdatosDireccion.splice(valor, 1);
      }
    })
  }

  //Editar direccion
  e_editarDireccion(datos: any, index: any) {
    //console.log('Editar')
    //console.log(datos)

    /// Post Consulat APO de CP
    let parametros = {
      ecodigopostal: datos.ecodigopostal
    }

    this.apiCodigoPostal.postConsultarCodigoPostal(parametros).subscribe(
      (response) => {
        this.e_procesarDatosCodigoPostal(response)
      }
    )
    ///////////////////////////////////////


    this.FormDireccion = new UntypedFormGroup({
      eindex: new UntypedFormControl(index, null),
      edireccion: new UntypedFormControl(datos.edireccion, null),
      ecodigopostal: new UntypedFormControl(datos.ecodigopostal, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tentidadfederativa: new UntypedFormControl(datos.tentidadfederativa, Validators.required),
      eestado: new UntypedFormControl(datos.eestado, Validators.required),
      tmunicipio: new UntypedFormControl(datos.tmunicipio, Validators.required),
      emunicipio: new UntypedFormControl(datos.emunicipio, Validators.required),
      ecolonia: new UntypedFormControl(datos.ecolonia, Validators.required),
      tcalle: new UntypedFormControl(datos.tcalle, Validators.required),
      tnumexterior: new UntypedFormControl(datos.tnumexterior, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tnuminterior: new UntypedFormControl(datos.tnuminterior, null)
    });


  }

  //Guardar Cliente

  get frmCliente() { return this.FormCliente.controls; }


  e_guardar(datos: any) {

    let alerta: any = {};


    ////console.log(form);
    this.submitCliente = true;

    //Validar form
    if (this.FormCliente.invalid) {
      //console.log('error.');
      return;
    }

    //Validar que existan direcciones agregadas
    if (this.arrdatosDireccion.length == 0) {
      alerta['text'] = 'AGREGAR UNA DIRECCIÓN';
      alerta['tipo'] = 'warning';
      alerta['footer'] = 'CLIENTE';
      this.alerta(alerta);
    }


    //SI todo esta correcto pasamos el consumo de crear el usuario
    let parametros: any
    let arrdireccion: Array<any> = [];

    // Recorrer los valor de la direcciones
    this.arrdatosDireccion.forEach((dato: any, valor: any) => {
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
      ecliente: datos.ecliente,
      trazonsocial: datos.trazonsocial,
      trfc: datos.trfc,
      direcciones: arrdireccion
    }

    //Clear
    alerta = []
    alerta['text'] = 'DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';
    alerta['footer'] = '';

    console.log(JSON.stringify(parametros))

    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {
        console.log('Guardar')
        this.postActualizarCliente(parametros);
      }
    });
  }


  postActualizarCliente(datos: any) {

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

        alerta['text'] = text;
        alerta['tipo'] = (success == true ? "success" : "error");
        alerta['footer'] = "CLIENTE";
        this.alerta(alerta);
      }
    )

  }

  //Redireccionar al modulo de consultar
  e_consulta() {
    this.router.navigate(['dashboard/customer/clientes/consultar']);
  }

  myConfirm(message: any) {
    var start = new Date().getTime();
    var result = confirm(message);
    var dt = new Date().getTime() - start;
    // dt < 50ms means probable computer
    // the quickest I could get while expecting the popup was 100ms
    // slowest I got from computer suppression was 20ms
    for (var i = 0; i < 10 && !result && dt < 50; i++) {
      start = new Date().getTime();
      result = confirm(message);
      dt = new Date().getTime() - start;
    }
    if (dt < 50)
      return true;
    return result;
  }

}
