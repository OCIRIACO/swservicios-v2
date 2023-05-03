import { Injectable, Output } from '@angular/core';


@Injectable({
    providedIn: 'root'
})


export class serviceDatosUsuario {
    @Output() datosUsuario: any = {};

    constructor() { }

}
