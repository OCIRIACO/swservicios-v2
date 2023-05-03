import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './modulos/intranet-Service/menu/menu.component';
//import { RootconfiguracionesComponent } from './modulos/operaciones/rootperaciones2/rootconfiguraciones.component';
import { ConfigUbicacionesComponent } from './modulos/intranet-Service/ubicaciones/config-ubicaciones/config-ubicaciones.component';
import { ZonasComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/zonas/zonas.component';
import { ConfiguracionComponent } from './modulos/intranet-Service/zonas/configuracion/configuracion.component';
import { DashboardComponent } from './modulos/dashboard/dashboard.component';
import { PaginanoencontradaComponent } from './modulos/errores/paginanoencontrada/paginanoencontrada.component';
import { LoginComponent } from './modulos/login/login.component';
import { ConsultamanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/consultamanifiesto/consultamanifiesto.component';
import { DetallemanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/detallemanifiesto/detallemanifiesto.component';
import { EditarmanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/editarmanifiesto/editarmanifiesto.component';
import { NotificamanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/notificamanifiesto/notificamanifiesto.component';
import { RootmanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/rootmanifiesto/rootmanifiesto.component';
import { RootOperacionesComponent } from './modulos/intranet-Service/root-operaciones/root-operaciones.component';
import { InventariosComponent } from './modulos/intranet-Service/mercancias/consultas/inventarios/inventarios.component';
import { HistorialComponent } from './modulos/intranet-Service/mercancias/consultas/historial/historial.component';
import { RootCustomerComponent } from './modulos/customer-Service/root-customer/root-customer.component';
import { MenuCustomerComponent } from './modulos/customer-Service/menu-customer/menu-customer.component';
import { CrearsalidaComponent } from './modulos/customer-Service/salidas/crear/solicitudSalida/crearsalida.component';
import { SolicitudesSalidasComponent } from './modulos/customer-Service/salidas/consultar/solicitudes-salidas/solicitudes-salidas.component';
import { DetallesSalidaComponent } from './modulos/customer-Service/salidas/consultar/detalles-salida/detalles-salida.component';
import { ActualizarSolicitudSalidaComponent } from './modulos/customer-Service/salidas/actualizar/actualizar-solicitud-salida/actualizar-solicitud-salida.component';
import { RootUbicacionesComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/root-ubicaciones/root-ubicaciones.component';
import { UbicacionesComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/ubicaciones/ubicaciones.component';
import { VistaUbicaciones2dComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/vista-ubicaciones2d/vista-ubicaciones2d.component';
import { InicioComponent } from './modulos/inicio/inicio.component';
import { ConsultarSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/consultar-salidas/consultar-salidas.component';
import { RootSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/root-salidas/root-salidas.component';
import { VerificarSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/verificar-salidas/verificar-salidas.component';
import { RootGestionComponent } from './modulos/intranet-Service/gestion-usuarios/root-gestion/root-gestion.component';
import { UsuariosComponent } from './modulos/intranet-Service/gestion-usuarios/usuarios/usuarios.component';
import { PerfilesComponent } from './modulos/intranet-Service/gestion-usuarios/perfiles/perfiles.component';
import { RootPerfilUsuariosStepsComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-usuarios-steps/root-perfil-usuarios-steps/root-perfil-usuarios-steps.component';
import { PerfilesStep1Component } from './modulos/intranet-Service/gestion-usuarios/perfil-usuarios-steps/perfiles-step1/perfiles-step1.component';
import { UsuariosStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-usuarios-steps/usuarios-step2/usuarios-step2.component';
import { RootPerfilResponsabilidadesComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/root-perfil-responsabilidades/root-perfil-responsabilidades.component';
import { PerfilesReponsabilidadesStep1Component } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/perfiles-reponsabilidades-step1/perfiles-reponsabilidades-step1.component';
import { PerfilesReponsabilidadesStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/perfiles-reponsabilidades-step2/perfiles-reponsabilidades-step2.component';
import { PassRecoveryComponent } from './modulos/pass-recovery/pass-recovery.component';
import { RootPerfilClienteComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-cliente/root-perfil-cliente/root-perfil-cliente.component';
import { PerfilClienteStep1Component } from './modulos/intranet-Service/gestion-usuarios/perfil-cliente/perfil-cliente-step1/perfil-cliente-step1.component';
import { NuevoClienteComponent } from './modulos/intranet-Service/clientes/nuevo-cliente/nuevo-cliente.component';
import { ConsultarClienteComponent } from './modulos/intranet-Service/clientes/consultar-cliente/consultar-cliente.component';
import { DetalleClienteDirectoComponent } from './modulos/intranet-Service/clientes/detalle-cliente-directo/detalle-cliente-directo.component';
import { EditarClienteDirectoComponent } from './modulos/intranet-Service/clientes/editar-cliente-directo/editar-cliente-directo.component';
import { PerfilClienteStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-cliente/perfil-cliente-step2/perfil-cliente-step2.component';
import { NuevoClienteCustomerComponent } from './modulos/customer-Service/clientes/nuevo-cliente-customer/nuevo-cliente-customer.component';
import { ConsultarClienteCustomerComponent } from './modulos/customer-Service/clientes/consultar-cliente-customer/consultar-cliente-customer.component';
import { DetalleClienteCustomerComponent } from './modulos/customer-Service/clientes/detalle-cliente-customer/detalle-cliente-customer.component';
import { EditarClienteCustomerComponent } from './modulos/customer-Service/clientes/editar-cliente-customer/editar-cliente-customer.component';
import { CrearServiciosComponent } from './modulos/customer-Service/servicios/crear-servicios/crear-servicios.component';
import { ConsultarServiciosComponent } from './modulos/customer-Service/servicios/consultar-servicios/consultar-servicios.component';
import { DetalleServiciosComponent } from './modulos/customer-Service/servicios/detalle-servicios/detalle-servicios.component';
import { EditarServiciosComponent } from './modulos/customer-Service/servicios/editar-servicios/editar-servicios.component';
import { EntradaDamageComponent } from './modulos/customer-Service/entradas/manifiesto/entrada-damage/entrada-damage.component';
import { CrearServicioCargaComponent } from './modulos/customer-Service/serviciocarga/crear-servicio-carga/crear-servicio-carga.component';
import { ConsultarServicioCargaComponent } from './modulos/customer-Service/serviciocarga/consultar-servicio-carga/consultar-servicio-carga.component';
import { ActualizarServicioCargaComponent } from './modulos/customer-Service/serviciocarga/actualizar-servicio-carga/actualizar-servicio-carga.component';
import { DetalleServicioCargaComponent } from './modulos/customer-Service/serviciocarga/detalle-servicio-carga/detalle-servicio-carga.component';
import { RootSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/root-solicitud-servicios/root-solicitud-servicios.component';
import { ConsultarSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/consultar-solicitud-servicios/consultar-solicitud-servicios.component';
import { DetalleSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/detalle-solicitud-servicios/detalle-solicitud-servicios.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { CrearAutotransporteComponent } from './modulos/customer-Service/autotransporte/crear-autotransporte/crear-autotransporte.component';
import { ConsultarAutotransporteComponent } from './modulos/customer-Service/autotransporte/consultar-autotransporte/consultar-autotransporte.component';
import { DetalleAutotransporteComponent } from './modulos/customer-Service/autotransporte/detalle-autotransporte/detalle-autotransporte.component';
import { EditarAutotransporteComponent } from './modulos/customer-Service/autotransporte/editar-autotransporte/editar-autotransporte.component';
import { RegistrarComponent } from './modulos/registrar/registrar.component';
import { CrearReferenciaComponent } from './modulos/customer-Service/referencias/crear-referencia/crear-referencia.component';
import { ConsultarReferenciasComponent } from './modulos/customer-Service/referencias/consultar-referencias/consultar-referencias.component';

const routes: Routes = [
  { path: '', redirectTo: 'logi', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pass-recovery', component: PassRecoveryComponent },
  { path: 'registrar', component: RegistrarComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {
        path: '', redirectTo: '/dashboard/inicio', pathMatch: 'full',
      },
      {
        path: 'inicio', component: InicioComponent
      },
      {
        path: 'customer', component: RootCustomerComponent, children: [
          {
            path: '', redirectTo: '/dashboard/customer/menu', pathMatch: 'full',
          },
          {
            path: 'menu', component: MenuCustomerComponent
          },
          {
            path: 'entradas/nuevo', component: NotificamanifiestoComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'entradas/consulta', component: ConsultamanifiestoComponent
          },
          {
            path: 'entradas/editar/:id', component: EditarmanifiestoComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'entradas/detalle/:id', component: DetallemanifiestoComponent
          },
          {
            path: 'entradas/damage/:id', component: EntradaDamageComponent
          },
          {
            path: 'salidas/nuevo', component: CrearsalidaComponent,  canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'salidas/consultar', component: SolicitudesSalidasComponent
          },
          {
            path: 'salidas/detalles/:id', component: DetallesSalidaComponent
          },
          {
            path: 'salidas/editar/:id', component: ActualizarSolicitudSalidaComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'clientes/nuevo', component: NuevoClienteCustomerComponent,  canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'clientes/consultar', component: ConsultarClienteCustomerComponent
          },
          {
            path: 'clientes/detalle/:id', component: DetalleClienteCustomerComponent
          },
          {
            path: 'clientes/editar/:id', component: EditarClienteCustomerComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'servicios/nuevo', component: CrearServiciosComponent,  canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'servicios/consultar', component: ConsultarServiciosComponent
          },
          {
            path: 'servicios/detalle/:id', component: DetalleServiciosComponent
          },
          {
            path: 'servicios/editar/:id', component: EditarServiciosComponent,canDeactivate: [CanDeactivateGuard]
          },
          //Servicios a las cargas (NO EXISTIRA IDGUIA)
          {
            path: 'serviciocarga/nuevo', component: CrearServicioCargaComponent,  canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'serviciocarga/consultar', component: ConsultarServicioCargaComponent
          },
          {
            path: 'serviciocarga/detalle/:id', component: DetalleServicioCargaComponent
          },
          {
            path: 'serviciocarga/editar/:id', component: ActualizarServicioCargaComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'transporte/nuevo', component: CrearAutotransporteComponent ,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'transporte/consultar', component: ConsultarAutotransporteComponent 
          },
          {
            path: 'transporte/detalle/:id', component: DetalleAutotransporteComponent 
          },
          {
            path: 'transporte/editar/:id', component: EditarAutotransporteComponent
          },
          {
            path: 'referencia/nuevo', component: CrearReferenciaComponent
          },
          {
            path: 'referencia/consultar', component: ConsultarReferenciasComponent
          },
        ]
      },
      {
        path: 'intranet', component: RootOperacionesComponent, children: [
          {
            path: '', redirectTo: '/dashboard/intranet/menu', pathMatch: 'full',
          },
          {
            path: 'menu', component: MenuComponent
          },
          {
            path: 'zonas', component: ConfiguracionComponent
          },
          {
            path: 'config/ubicaciones', component: ConfigUbicacionesComponent
          },
          {
            path: 'cliente/directo/nuevo', component: NuevoClienteComponent
          },
          {
            path: 'cliente/directo/consultar', component: ConsultarClienteComponent
          },
          { ////dashboard/intranet/cliente/directo/consultar
            path: 'cliente/directo/detalle/:id', component: DetalleClienteDirectoComponent
          },
          {
            path: 'cliente/directo/editar/:id', component: EditarClienteDirectoComponent
          },
          {
            path: 'ubicaciones2d', component: RootUbicacionesComponent, children: [
              {
                path: '', redirectTo: '/dashboard/intranet/ubicaciones2d/zonas', pathMatch: 'full',
              },
              {
                path: 'zonas', component: ZonasComponent
              },
              {
                path: 'ubicaciones', component: UbicacionesComponent
              },
              {
                path: 'vista', component: VistaUbicaciones2dComponent
              }
            ]
          },
          {
            path: 'inventarios', component: InventariosComponent
          },
          {
            path: 'historial', component: HistorialComponent
          },
          {
            path: 'salidas', component: RootSalidasComponent, children: [
              {
                path: '', redirectTo: '/dashboard/salidas/solicitudes', pathMatch: 'full',
              },
              {
                path: 'solicitudes', component: ConsultarSalidasComponent
              },
              {
                path: 'solicitud/:id', component: VerificarSalidasComponent
              }

            ]
          },
          {
            path: 'servicios', component: RootSolicitudServiciosComponent, children: [
              {
                path: '', redirectTo: '/dashboard/servicios/solicitudes', pathMatch: 'full',
              },
              {
                path: 'solicitudes', component:ConsultarSolicitudServiciosComponent
              },
              {
                path: 'detalles/:id', component:DetalleSolicitudServiciosComponent
              }
            ]
          },
          {
            path: 'administracion', component: RootGestionComponent, children: [
              {
                path: 'usuarios', component: UsuariosComponent
              },
              {
                path: 'perfiles', component: PerfilesComponent
              },
              {
                path: 'config', component: RootPerfilUsuariosStepsComponent, children: [
                  {
                    path: '', redirectTo: 'perfiles', pathMatch: 'full',
                  },
                  {
                    path: 'perfiles/step1', component: PerfilesStep1Component
                  },
                  {
                    path: 'usuarios/step2', component: UsuariosStep2Component
                  }
                ]
              },
              {
                path: 'config', component: RootPerfilResponsabilidadesComponent, children: [
                  {
                    path: '', redirectTo: 'perfiles/respons', pathMatch: 'full',
                  },
                  {
                    path: 'perfiles/respons/step1', component: PerfilesReponsabilidadesStep1Component
                  },
                  {
                    path: 'perfiles/respons/step2', component: PerfilesReponsabilidadesStep2Component
                  }
                ]
              },
              {
                path: 'config', component: RootPerfilClienteComponent, children: [
                  {
                    path: '', redirectTo: 'perfiles/cliente', pathMatch: 'full'
                  },
                  {
                    path: 'perfiles/cliente/step1', component: PerfilClienteStep1Component
                  },
                  {
                    path: 'perfiles/cliente/step2', component: PerfilClienteStep2Component
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  { path: '**', component: PaginanoencontradaComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
