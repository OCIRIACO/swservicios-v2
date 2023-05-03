import { Injectable, Output } from '@angular/core';


@Injectable({
    providedIn: 'root'
})


export class serviceUbicaciones2d {
    @Output() datosUbicaciones2d: any = {};
    @Output() datosFinalUbicaciones2d: any = [];

    constructor() { }

}
