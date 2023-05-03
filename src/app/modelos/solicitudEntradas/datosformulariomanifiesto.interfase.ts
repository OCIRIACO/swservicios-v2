

export interface Icarga {
    eguia           : number,
    tembalaje       : string,
    ecodembalaje    : number,
    tnaviera        : string,
    ecodnaviera     : number,
    tmarcas         : string,
    ttipocontenedor : string,
    epesoneto       : number,
    epesobruto      : number,
    ebultos         : number,
    ttramite        : string,
    ttipocarga      : string,
    tsellos         : string,
    bienes       : Array<Imercancia>
}



export interface Imercancia {
    edetalleguia     : number,
    tfactura         : string,
    tmarcas          : string,
    tdescripcion     : string,
    ecantidad        : number,
    epesobruto       : number,
    epesoneto        : number,
    ecodembalaje     : number,
    tembalaje        : string,
    evolumen         : number,
}


