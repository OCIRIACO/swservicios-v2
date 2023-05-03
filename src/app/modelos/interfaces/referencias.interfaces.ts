
import { Icredencial } from "../seguridad/seguridad.interfase";


export interface rootReferencia{
   solicitud: Ireferencia
}

export interface Ireferencia{
    credencial:Icredencial
    parametros:IsolicitudReferencia
}

export interface IsolicitudReferencia {
    ereferencia: number
    treferencia: string
    epuerto: number
    eagente: number
    eanio: number
    eaduana: number
    archivos: Array<any>
}


