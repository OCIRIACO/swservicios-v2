
export interface IrootConsultaZonas{
    zonasActivas: IconsultaZonas
}

export interface IconsultaZonas{
    credencial: IcredencialZonas
}

export interface IcredencialZonas{
    token: string
}

export  interface IdatosZonas{
   id: string
   parent: string
   text:string
   metada: Imetadata
}

export interface Imetadata{
    ecodzona:number
    ecodzonapadre:number
    tdescripcion: string
    ttipo:string
    tsubtipo:string
    testado:string
    tpath:string
    tcrearzona:string
}

export interface IrootIdatosZonas{
    data: Array<IdatosZonas>
}

// Interfase para uso de consumo del API's

export interface IdatosregistrarZona{
    ecodzonapadre: number
    tdescripcion: string
    ttipo: string
    tsubtipo: string
    testado: string
}


export interface IrootRegistrarZona{
    registrarZona: IregistrarZona
}

export interface IregistrarZona{
    credencial: IcredencialZonas
    parametros: IparametrosZonas
}

export interface IparametrosZonas{
    zona: IdatosregistrarZona
}

///Actualizar zonz

export interface IrootActualizarZona{
    especificacionZona: IactualizarZona
}

export interface IactualizarZona{
    credencial: IcredencialZonas
    parametros: IparametrosZonas
}


export interface IdatosActualizarZona{
    ecodzona:number
    ecodzonapadre: number
    tdescripcion: string
    ttipo: string
    tsubtipo: string
    testado: string
}
