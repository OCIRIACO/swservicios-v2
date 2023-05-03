import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IRootConsultarSolicitudSalida {
    solicitudSalida: IconsultarSolicitudSalidas;
}


export interface IconsultarSolicitudSalidas {
    credencial: Icredencial;
    parametros: Iparametros;
}


export interface Iparametros{
    etransaccion: number;
}



