 export interface Login {
      usuario: string;
      password: string;
  }

  export interface IniciarSesion {
      login: Login;
  }

  export interface RootObject {
      iniciarSesion: IniciarSesion;
  }


