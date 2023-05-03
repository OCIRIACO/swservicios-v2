import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Globales constante
import { GlobalConstants } from 'src/app/modelos/global';


//Datos globales que seran usados en otros componenet's
import { serviceUbicaciones2d } from 'src/app/service/service.ubicaciones2d'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {

  //Path base
  directorio: string = GlobalConstants.pathIntranet;

  // Varibles Response de API's
  datosConsultaDetUbicaciones: any;

  datoFinalUbicaciones: any = []


  constructor(private serviceUbicaciones2d: serviceUbicaciones2d, private router: Router,) { }

  ngOnInit(): void {
    //Crear el reporte (vista)
    this.datosConsultaDetUbicaciones = this.serviceUbicaciones2d.datosUbicaciones2d;
  }

  ///Alertas
  alerta(datos: any) {
    Swal.fire({
      icon: datos['tipo'],
      title: 'ATENCIÓN',
      text: datos['text'],
      footer: datos['footer'],
      showConfirmButton: true,
      confirmButtonColor: "#22bab7"
    }).then((result) => {
    })
  }


  //Regresar al component zonas
  e_zonas() {
    // Router
    //this.router.navigate(['/dashboard/intranet/ubicaciones2d/zonas'])
    window.location.href = "#/dashboard/intranet/ubicaciones2d/zonas";


  }

  //Redirecciona vista 2d
  e_vista2d() {

    // Clear
    this.datoFinalUbicaciones = []

    // Numero de checkbox
    let elementos = document.getElementsByClassName("ubicaciones")

    //console.log(elementos.length)


    for (var i = 0; i < elementos.length; i++) {

      let checkbox: any = document.getElementById('check' + i)

      let isChecked = checkbox.checked

      if (isChecked == true) {

        let value = checkbox.value



        this.datosConsultaDetUbicaciones.forEach((dato: any, index: any) => {
          // console.log(dato.ecoddetubicacion)
          if (value == dato.ecoddetubicacion) {
            this.datoFinalUbicaciones.push(dato)
          }
        })


      }


    }

    // Final
    //console.log(this.datoFinalUbicaciones)
    this.serviceUbicaciones2d.datosFinalUbicaciones2d = this.datoFinalUbicaciones

    //// Validar

    let alerta: any = {}

    if (this.datoFinalUbicaciones.length == 0) {


      alerta['text'] = 'SELECCIONAR LOS CARRILES PARA INICIAR LA VISTA 2D';
      alerta['tipo'] = 'error';
      alerta['footer'] = '';

      this.alerta(alerta);

    } else {
      // Router
      //this.router.navigate(['/dashboard/intranet/ubicaciones2d/vista'])
      window.location.href = "#/dashboard/intranet/ubicaciones2d/vista";

    }

  }

  e_checkTodo() {

    // Numero de checkbox
    let elementos = document.getElementsByClassName("ubicaciones")

    for (var i = 0; i < elementos.length; i++) {
      //true checked
      let checkbox =  document.getElementById('check' + i) as HTMLInputElement
      checkbox.checked =  true

    }
  }

}
