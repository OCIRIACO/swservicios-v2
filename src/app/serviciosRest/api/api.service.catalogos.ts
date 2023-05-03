import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IdatosEmbalaje } from 'src/app/modelos/datosembalajes.interfase';
import { IdatosNaviera } from 'src/app/modelos/datosnaviera.interfase';
import { IdatosTipoContenedor } from 'src/app/modelos/datostipodecontenedor';
import { GlobalConstants } from 'src/app/modelos/global';


@Injectable({
    providedIn: 'root'
})

export class classApiCatalogo {

    url: string = GlobalConstants.apiURL


    constructor(private http: HttpClient) { }


    GetNavieras(): Observable<IdatosNaviera[]> {
        let direccion = this.url + "catalogos/consultar/tipos/navieras";
        return this.http.get<IdatosNaviera[]>(direccion);
    }

    GetEmbalajes(): Observable<IdatosEmbalaje[]> {
        let direccion = this.url + "catalogos/consultar/tipos/embalajes";
        return this.http.get<IdatosEmbalaje[]>(direccion);
    }

    GetTipoContenedores(): Observable<IdatosTipoContenedor[]> {
        let direccion = this.url + "catalogos/consultar/tipos/contenedores";
        return this.http.get<IdatosTipoContenedor[]>(direccion);
    }

    GetMetodoPago(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/metodopago";
        return this.http.get<any>(direccion);
    }

    GetBancos(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/bancos";
        return this.http.get<any>(direccion);
    }

    GetCfdi(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/cfdi";
        return this.http.get<any>(direccion);
    }


    GetEstaciones(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/estaciones";
        return this.http.get<any>(direccion);
    }


    GetAgentesAduanales(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/agentesaduanales";
        return this.http.get<any>(direccion);
    }


    GetAduanas(): Observable<any> {
        let direccion = this.url + "catalogos/consultar/tipos/aduanas";
        return this.http.get<any>(direccion);
    }


    


}
