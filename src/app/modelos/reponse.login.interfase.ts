export interface IdatosResponse{
    success : boolean;
    mensaje : string;
       data : any;   
       error: any
}

export interface Idatosdata {
    detalle: idatosDetalle 
}

export interface idatosDetalle {
    token: number
    nombre: string 

}





