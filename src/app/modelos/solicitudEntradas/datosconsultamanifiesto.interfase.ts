import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IRootConsultaUnManifiesto {
    consultarSolicitud: IconsultaUnManifiesto;
}


export interface IconsultaUnManifiesto {
    credencial: Icredencial;
    parametros: Iparametros;
}



export interface Iparametros{
    etransaccion: number;
}



