import { Icredencial } from "../seguridad/seguridad.interfase";

export interface IRootConsultaMenuSistema{
    consultaMenuSistema: IconsultaMenuSistema
}


export interface IconsultaMenuSistema{
  credencial: Icredencial
  parametros: IparametrosMenu
}

export interface IparametrosMenu{
  tipo: string;
  eperfil: number
}