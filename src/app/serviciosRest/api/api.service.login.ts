import { Injectable } from '@angular/core'
import { IdatosResponse} from '../../modelos/reponse.login.interfase'
import { HttpClient,HttpHeaders } from '@angular/common/http'
import {Observable} from 'rxjs'
import { Router} from '@angular/router'
import { GlobalConstants } from 'src/app/modelos/global';
import { finalize } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner'
import {serviceDatosUsuario } from 'src/app/service/service.datosUsuario'


@Injectable({
  providedIn:'root'
})

export class classApiLogin{

   url: string = GlobalConstants.apiURL;

   
    constructor(private http:HttpClient, private router:Router,private spinner: NgxSpinnerService, private serviceDatosUsuario: serviceDatosUsuario){}
    
    e_iniciarSesion(form:any): Observable<any>{
      let direccion = this.url+"seguridad/login/session/iniciar";
      this.spinner.show();
      return this.http.post<IdatosResponse>(direccion,form).pipe(finalize(() => {
        this.spinner.hide();
    }))
    }

    cerrarSesion(){
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this.router.navigate(['login']);
    }

    e_validaLocalStorage(){
      //console.log('existe token:'+localStorage.getItem('token'));
      if(localStorage.getItem('token') == null){
       this.router.navigate(['login']);

      }else if(localStorage.getItem('token') != null){
        this.router.navigate(['dashboard']);
        //Extraer del local storage los datos del usuaro Json
        this.serviceDatosUsuario.datosUsuario =  localStorage.getItem('usuario');

      }
   }
 

}