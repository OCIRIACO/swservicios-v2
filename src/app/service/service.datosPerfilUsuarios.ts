import { Injectable, Output } from '@angular/core';


@Injectable({
    providedIn: 'root'
})


export class serviceDatosPerfilUsuarios
 {
    @Output() datosPerfilUsuarios: any = {};

    constructor() { }

}
