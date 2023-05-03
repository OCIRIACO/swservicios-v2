import { Iparametros } from "../solicitudEntradas/datosconsultamanifiesto.interfase";
import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IRootconsultaHistorial{
  consultarTracking: IconsultaHistorial
}


export interface IconsultaHistorial{
  credencial: Icredencial
  parametros: Imarca
}

export interface Imarca{
  tbusqueda: string
  tvalor:string
}

/////////////////// INTERFACE API CONSULTA ENTRADAS /////////////////////////////////

//{"consultaInventarios":{"credencial":{"token":"SDF54SER4E4S4X338E78SDF4SA54DAGD45E3A"},"parametros":{"tTipo":"ENTRADAS","fhFechaInicio":"2021/11/01","fhFechaFin":"2021/11/01"}}}

export interface  IRootconsultaInventarios{
  consultarInventarios: IconsultaInventarios
}

export interface IconsultaInventarios{
  credencial: Icredencial
  parametros: IparametrosInventario
}

export interface IparametrosInventario{
   tTipo:string
   fhFechaInicio:string
   fhFechaFin:string

}