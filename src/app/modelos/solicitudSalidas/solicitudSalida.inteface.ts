import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IrootValidarSalidaBienes{
    validarSalidaBienes: IvalidarSalidaBienes
}

export interface IvalidarSalidaBienes{
    credencial: Icredencial
    parametros: IparametrosValidarSalidaBienes
}

export interface IparametrosValidarSalidaBienes{
    tbusqueda: string
    tvalor:string
}

////////////////////////////// (interface) solicitud  de salidas ///////////////////////////

export interface IrootSolicitudSalida{
    solicitudSalida: IsolicitudSalida
}


export interface IsolicitudSalida{
    credencial: Icredencial
    parametros: IparametrosSolicitudSalida
}

export interface IparametrosSolicitudSalida{
    solicitud:Isolicitud
}

export interface Isolicitud{
    ecliente:number,
    edireccion:number,
    emetodopago:number,
    ebanco: number,
    ecfdi:number,
    ecuenta:number,
    tmoneda:string,
    ttiposolicitud : string
    tcorreo        : string
    ttelefono      : string
    ecodusuario    : number
    fhfechaservicio: Date
    tobservaciones:string
    treferencia    :string
    bienes         : Array<Ibienes>
}


export interface Ibienes{
    eguia            : number    
    ttipocarga       : string       
    ttramite         : string         
    ttipocontenedor  : string                 
    tmarcas          : string  
    epesoneto        : number      
    epesobruto       : number           
    ecantidad        : number           
    ecodnaviera      : number             
    ecodembalaje     : number           
    detallesbien :  Array<IdetalleBienes> 
}


export interface IdetalleBienes{
    edetalleguia  : number                          
    tfactura      : string                     
    tmarcas       : string                    
    tdescripcion  : string                         
    ecantidad     : number                      
    epesobruto    : number                       
    epesoneto     : number                      
    ecodembalaje  : number                         
    evolumen      : number                     
}