import { Injectable, Output } from '@angular/core';


@Injectable({
    providedIn: 'root'
})


export class serviceCatalogos
 {
    @Output() catalogoMetodoPago: any = []
    @Output() catalogoBancos: any = []
    @Output() catalogoCfdi: any = []
    @Output() catalogoEmbalajes: any = []
    @Output() catalogoNavieras: any = []
    @Output() catalogoEstacionesList: any = []


    @Output() catalogoAduanas: any = []
    @Output() catalogoAgentesAduanales: any = []


    @Output() arrCustomer: any = []
    @Output() arrIntranet: any = []



    constructor() { }

}
