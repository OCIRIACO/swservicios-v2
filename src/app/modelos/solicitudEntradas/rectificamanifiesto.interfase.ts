
import { Icredencial } from "../seguridad/seguridad.interfase";


export interface IRootrectificaUnManifiesto {
    solicitudentrada:  IrectificaUnManifiesto,
}


export interface IrectificaUnManifiesto {
    credencial: Icredencial,
    parametros: Iparametros,
}


export interface Iparametros {
    orden: Imanifiesto,
}


export interface IparametrosEditar {
    orden: Imanifiesto,
}

export interface Imanifiesto {
    etransaccion: number,
    //etransaccion: number,
    ecliente:number,
    edireccion:number,
    ttiposolicitud: string,
    tcorreo: string,
    treferencia:string,
    emetodopago:number,
    ebanco:number,
    ecfdi:number,
    ecuenta:number,
    tmoneda:string,
    fhfechaservicio:string,
    tobservaciones:string,
    ttelefono: string
    ecodusuario: number,
    
    bienes: Array<Imercancias>
}

export interface Isellos {
    tsello: string,
    ttiposello: string,
}

export interface Imercancias {
    eguia: number,
    ttipocarga: string,
    ttramite: string,
    ecodnaviera: number,
    ttipocontenedor: string,
    ecodembalaje: number,
    tmarcas: string,
    epesobruto: number,
    epesoneto: number,
    ecantidad: number
    sellos: Array<Isellos>
    detallesbien: Array<Idetallemercancias>


}


export interface Idetallemercancias {
    edetalleguia:number,
    tfacturas: string,
    ecodpropietario: number,
    tmarcas: string,
    tdescripcion: string,
    ecantidad: number,
    epesobruto: number,
    epesoneto:number,
    ecodembalaje: number,
    evolumen: number,
}




