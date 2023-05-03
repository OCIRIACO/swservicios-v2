import { Icredencial } from "../seguridad/seguridad.interfase";

////////////////////////////// (interface) solicitud  de salidas ///////////////////////////

export interface IrootSolicitudSalidaUpdadate {
    solicitudsalida: IsolicitudSalidaUpdate
}


export interface IsolicitudSalidaUpdate {
    credencial: Icredencial
    parametros: IparametrosSolicitudSalidaUpdate
}

export interface IparametrosSolicitudSalidaUpdate {
    solicitud: Isolicitud
}

export interface Isolicitud {
    etransaccion: number
    ecliente: number
    edireccion: number
    ttiposolicitud: string
    tcorreo: string
    ttelefono: string
    ecodusuario: number
    fhfechaservicio: Date
    treferencia: string
    emetodopago: number,
    ebanco: number,
    ecfdi: number,
    ecuenta: number,
    tmoneda: string,
    tobservaciones: string,
    bienes: Array<Ibienes>
}


export interface Ibienes {
    eguia: number
    ttipocarga: string
    ttramite: string
    ttipocontenedor: string
    tmarcas: string
    epesoneto: number
    epesobruto: number
    ecantidad: number
    ecodnaviera: number
    ecodembalaje: number
    detallesbien: Array<IdetalleBienes>
}


export interface IdetalleBienes {
    edetallebien: number
    tfactura: string
    tmarcas: string
    tdescripcion: string
    ecantidad: number
    epesobruto: number
    epesoneto: number
    ecodembalaje: number
    evolumen: number
}