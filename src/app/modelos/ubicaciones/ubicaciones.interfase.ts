import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IrootRegistrarUbicacion{
    registrarUbicacion: IregistrarUbicacion
}

export interface IregistrarUbicacion {
    credencial: Icredencial
   parametros: IparametrosUbicaciones
}


export interface IparametrosUbicaciones{
    detalleubicacion: IdetalleUbicacion
}


export interface IdetalleUbicacion{
    ecodzona: number
    tbloque : string
    efilas  : number
    ebahias : number
    ealturas : number
    ecodusuario: number
    testado: string
}

// Consoltu detalles de ubicaciones


export interface IrootConsultaZonaDetalleUbicaciones{
    ubicacionesZona: IconsultaZonaDetalleUbicaciones
}

export interface IconsultaZonaDetalleUbicaciones{
    credencial: Icredencial
    parametros: IparametrosDetUbicacionConsulta
}

export interface IparametrosDetUbicacionConsulta{
    detalleUbicacion: IdetalleUbicacionConsulta
}


export interface IdetalleUbicacionConsulta {
    ecodzona: number
}