import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { apiCodigosPostales } from 'src/app/serviciosRest/api/api.codigospostales';
import { apiClienteDirecto } from 'src/app/serviciosRest/Intranet/cliente/api.service.clienteDirecto';
import Swal from 'sweetalert2';
import { GlobalConstants } from 'src/app/modelos/global';

@Component({
  selector: 'app-editar-cliente-directo',
  templateUrl: './editar-cliente-directo.component.html',
  styleUrls: ['./editar-cliente-directo.component.css']
})
export class EditarClienteDirectoComponent implements OnInit {

  //RegEx
  regNumerico: string = '^[+-]?([0-9]*[.])?[0-9]+$'

  //Catalogos arreglo
  arrdatosColonia: any
  arrdatosDireccion: Array<any> = [];

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  //Form's
  FormCliente = new FormGroup({
    ecodcliente:new FormControl('', Validators.required),
    trazonsocial: new FormControl('', Validators.required),
    trfc: new FormControl('', Validators.required),
  })

  FormDireccion = new FormGroup({
    ecoddireccion: new FormControl('', Validators.required),
    ecodigopostal: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tentidadfederativa: new FormControl('', Validators.required),
    eestado: new FormControl('', Validators.required),
    tmunicipio: new FormControl('', Validators.required),
    emunicipio: new FormControl('', Validators.required),
    tcolonia: new FormControl('', Validators.required),
    tcalle: new FormControl('', Validators.required),
    tnumexterior: new FormControl('', [Validators.required,
    this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
    ]),
    tnuminterior: new FormControl('', null),
  });

  //Submit's
  submitDireccion = false;
  submitCliente = false;

  //Label's
  lblecliente: number = 0

  //Variable Get
  id: string = "";


  constructor(
    private apiCliente: apiClienteDirecto,
    private route: ActivatedRoute,
    private apiCodigoPostal: apiCodigosPostales,
    private router: Router,
    private apiClienteDirecto: apiClienteDirecto
  ) { }

  ngOnInit(): void {

    //POST CONSULAR DETALLE
    this.id = this.route.snapshot.params['id'];

    this.apiCliente.postConsultarDetalleCliente(this.id).subscribe(
      (response) => {
        this.e_procesar_datos_cliente_detalle(response)
      }
    )

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
          this.router.navigate(['dashboard/intranet/cliente/directo/detalle', this.lblecliente]);
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

    this.FormCliente = new FormGroup({
      ecodcliente:new FormControl(datos.data[0].ecodcliente, Validators.required),
      trazonsocial: new FormControl( datos.data[0].trazonsocial, Validators.required),
      trfc: new FormControl(datos.data[0].trfc, Validators.required),
    })

    
    //arreglo
    this.arrdatosDireccion = datos.data[0].direcciones
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

    

    
    this.submitDireccion = true;

    //Validar form
    if (this.FormDireccion.invalid) {
      
      return;
    }

    if (this.arrdatosDireccion.length == 0) {
      //Nuevo registro 
      datos.ecoddireccion = (this.arrdatosDireccion.length)
      this.arrdatosDireccion.push(datos)
    } else {

      
      
      


      if (datos.ecoddireccion === '') {
        //Nuevo registro
        
        
        datos.ecoddireccion = (this.arrdatosDireccion.length)
        this.arrdatosDireccion.push(datos)
      } else {
        
        //Actualizar registro
        this.arrdatosDireccion[datos.ecoddireccion].ecoddireccion = datos.ecoddireccion;
        this.arrdatosDireccion[datos.ecoddireccion].ecodigopostal = datos.ecodigopostal;
        this.arrdatosDireccion[datos.ecoddireccion].tentidadfederativa = datos.tentidadfederativa;
        this.arrdatosDireccion[datos.ecoddireccion].eestado = datos.eestado;
        this.arrdatosDireccion[datos.ecoddireccion].tmunicipio = datos.tmunicipio;
        this.arrdatosDireccion[datos.ecoddireccion].emunicipio = datos.emunicipio;
        this.arrdatosDireccion[datos.ecoddireccion].tcolonia = datos.tcolonia;
        this.arrdatosDireccion[datos.ecoddireccion].tcalle = datos.tcalle;
        this.arrdatosDireccion[datos.ecoddireccion].tnumexterior = datos.tnumexterior;
        this.arrdatosDireccion[datos.ecoddireccion].tnuminterior = datos.tnuminterior;
      }

    }


    

    ////Submit's
    this.submitDireccion = false;

    //Reset form
    this.FormDireccion = new FormGroup({
      ecoddireccion: new FormControl('', null),
      ecodigopostal: new FormControl('', Validators.required),
      tentidadfederativa: new FormControl('', Validators.required),
      eestado: new FormControl('', Validators.required),
      tmunicipio: new FormControl('', Validators.required),
      emunicipio: new FormControl('', Validators.required),
      tcolonia: new FormControl('', Validators.required),
      tcalle: new FormControl('', Validators.required),
      tnumexterior: new FormControl('', Validators.required),
      tnuminterior: new FormControl('', null),
    });

  }

  //Eliminar direccion
  e_eliminarDireccion(datoDireccion: any) {
    this.arrdatosDireccion.forEach((dato: any, valor: any) => {
      if (dato.ecoddireccion == datoDireccion.ecoddireccion) {
        this.arrdatosDireccion.splice(valor, 1);
      }
    })
  }

  //Editar direccion
  e_editarDireccion(datos: any) {
    
    

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


    this.FormDireccion = new FormGroup({
      ecoddireccion: new FormControl(datos.ecoddireccion, null),
      ecodigopostal: new FormControl(datos.ecodigopostal, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tentidadfederativa: new FormControl(datos.tentidadfederativa, Validators.required),
      eestado: new FormControl(datos.eestado, Validators.required),
      tmunicipio: new FormControl(datos.tmunicipio, Validators.required),
      emunicipio: new FormControl(datos.emunicipio, Validators.required),
      tcolonia: new FormControl(datos.tcolonia, Validators.required),
      tcalle: new FormControl(datos.tcalle, Validators.required),
      tnumexterior: new FormControl(datos.tnumexterior, [Validators.required,
      this.regexValidador(new RegExp(this.regNumerico), { 'number': true })
      ]),
      tnuminterior: new FormControl(datos.tnuminterior, null)
    });


  }

  //Guardar Cliente

  get frmCliente() { return this.FormCliente.controls; }


  e_guardar(datos: any) {

    let alerta: any = {};


    
    this.submitCliente = true;

    //Validar form
    if (this.FormCliente.invalid) {
      
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

      valorDireccion.ecodigopostal = dato.ecodigopostal;
      valorDireccion.tentidadfederativa = dato.tentidadfederativa;
      valorDireccion.tmunicipio = dato.tmunicipio;
      valorDireccion.tcolonia = dato.tcolonia;
      valorDireccion.tcalle = dato.tcalle;
      valorDireccion.tnumexterior = dato.tnumexterior;
      valorDireccion.tnuminterior = dato.tnuminterior;


      arrdireccion.push(valorDireccion)
    })

    parametros = {
      trazonsocial: datos.trazonsocial,
      trfc: datos.trfc,
      direcciones: arrdireccion
    }

    //Clear
    alerta = []
    alerta['text'] = 'DESEA CONTINUAR ? ';
    alerta['tipo'] = 'question';
    alerta['footer'] = '';

    

    this.alertaConfirm(alerta, (confirmed: boolean) => {
      if (confirmed == true) {
        this.e_postClienteDirecto(parametros);
      }
    });
  }


  e_postClienteDirecto(datos: any) {

    let alerta: any = {};
    let text = '';
    let success: boolean

    this.apiClienteDirecto.postCrearClienteDirecto(datos).subscribe(
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

}
