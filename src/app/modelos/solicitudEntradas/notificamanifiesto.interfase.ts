import { Icredencial } from "../seguridad/seguridad.interfase";


export interface IRootrectificaUnManifiesto {
    rectificaUnManifiesto:  IrectificaUnManifiesto;
}

export interface IRootNotificaUnManifiesto {
    solicitudentrada: InotificaManifiesto;
}


export interface InotificaManifiesto {
    credencial:Icredencial;
    parametros: Iparametros;
}


export interface IrectificaUnManifiesto {
    credencial: Icredencial;
    parametros: Iparametros;
}



export interface Iparametros {
    orden: Imanifiesto;
}


export interface IparametrosEditar {
    manifiesto: Imanifiesto;
}

export interface Imanifiesto {
    ecliente:number,
    edireccion:number,
    emetodopago:number,
    ebanco: number,
    ecfdi:number,
    ecuenta:number,
    tmoneda:string,
    ttiposolicitud: string;
    tcorreo: string;
    ttelefono: string
    treferencia: string
    fhfechaservicio:string
    tobservaciones:string
    ecodusuario: number
    bienes: Array<Imercancias>
}

export interface Isellos {
    tsello: string;
    ttiposello: string;
}

export interface Imercancias {
    ttipocarga: string;
    ttramite: string;
    ecodnaviera: number;
    ttipocontenedor: string;
    ecodembalaje: number;
    tmarcas: string;
    epesobruto: number;
    epesoneto: number;
    ecantidad: number
    sellos: Array<Isellos>
    detallesbien: Array<Idetallemercancias>


}


export interface Idetallemercancias {
    tfactura: string,
    ecodpropietario: number,
    tmarcas: string,
    tdescripcion: string,
    ecantidad: number,
    epesobruto: number,
    epesoneto: number,
    ecodembalaje: number,
    evolumen: number
}




