import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { LoginComponent } from './modulos/login/login.component';
import { ReactiveFormsModule, FormsModule}  from '@angular/forms' // Validar Formularios // post
import { HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './modulos/dashboard/dashboard.component';
import { NotificamanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/notificamanifiesto/notificamanifiesto.component';
import { EditarmanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/editarmanifiesto/editarmanifiesto.component';
import { ConsultamanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/consultamanifiesto/consultamanifiesto.component'
import { DataTablesModule } from 'angular-datatables';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { PaginanoencontradaComponent } from './modulos/errores/paginanoencontrada/paginanoencontrada.component';
import { RootmanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/rootmanifiesto/rootmanifiesto.component';
import { NgxSpinnerModule } from "ngx-spinner";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DetallemanifiestoComponent } from './modulos/customer-Service/entradas/manifiesto/detallemanifiesto/detallemanifiesto.component';
import { MenuComponent } from './modulos/intranet-Service/menu/menu.component';
import { ConfiguracionComponent } from './modulos/intranet-Service/zonas/configuracion/configuracion.component';
import { ConfigUbicacionesComponent } from './modulos/intranet-Service/ubicaciones/config-ubicaciones/config-ubicaciones.component';
import { ZonasComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/zonas/zonas.component';
import { RootOperacionesComponent } from './modulos/intranet-Service/root-operaciones/root-operaciones.component';
import { HistorialComponent } from './modulos/intranet-Service/mercancias/consultas/historial/historial.component';
import { InventariosComponent } from './modulos/intranet-Service/mercancias/consultas/inventarios/inventarios.component';
import { RootCustomerComponent } from './modulos/customer-Service/root-customer/root-customer.component';
import { MenuCustomerComponent } from './modulos/customer-Service/menu-customer/menu-customer.component';
import { CrearsalidaComponent } from './modulos/customer-Service/salidas/crear/solicitudSalida/crearsalida.component';
import { SolicitudesSalidasComponent } from './modulos/customer-Service/salidas/consultar/solicitudes-salidas/solicitudes-salidas.component';
import { DetallesSalidaComponent } from './modulos/customer-Service/salidas/consultar/detalles-salida/detalles-salida.component';
import { ActualizarSolicitudSalidaComponent } from './modulos/customer-Service/salidas/actualizar/actualizar-solicitud-salida/actualizar-solicitud-salida.component';
import { RootUbicacionesComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/root-ubicaciones/root-ubicaciones.component';
import { UbicacionesComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/ubicaciones/ubicaciones.component';
import { VistaComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/vista/vista.component';
import { VistaUbicaciones2dComponent } from './modulos/intranet-Service/ubicaciones/ubicaciones-2d/vista-ubicaciones2d/vista-ubicaciones2d.component';
import { UsersComponent } from './modulos/users/users.component';

import { ModalModule  } from 'src/app/modelos/_modal';
import { InicioComponent } from './modulos/inicio/inicio.component';
import { ConsultarSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/consultar-salidas/consultar-salidas.component';
import { VerificarSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/verificar-salidas/verificar-salidas.component';
import { RootSalidasComponent } from './modulos/intranet-Service/solicitudSalidas/root-salidas/root-salidas.component';
import { UsuariosComponent } from './modulos/intranet-Service/gestion-usuarios/usuarios/usuarios.component';
//import { GestionRootComponent } from './modulos/intranet-Service/gestion-root/gestion-root.component';
//mport { RootComponent } from './modulos/intranet-Service/gestion-usuarios/root/root.component';
import { RootGestionComponent } from './modulos/intranet-Service/gestion-usuarios/root-gestion/root-gestion.component';
import { PerfilesComponent } from './modulos/intranet-Service/gestion-usuarios/perfiles/perfiles.component';
import { UsuariosStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-usuarios-steps/usuarios-step2/usuarios-step2.component';
import { RootPerfilUsuariosStepsComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-usuarios-steps/root-perfil-usuarios-steps/root-perfil-usuarios-steps.component';
import { RootPerfilResponsabilidadesComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/root-perfil-responsabilidades/root-perfil-responsabilidades.component';
import { PerfilesReponsabilidadesStep1Component } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/perfiles-reponsabilidades-step1/perfiles-reponsabilidades-step1.component';
import { PerfilesReponsabilidadesStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-responsabilidades-steps/perfiles-reponsabilidades-step2/perfiles-reponsabilidades-step2.component';
import { PassRecoveryComponent } from './modulos/pass-recovery/pass-recovery.component';
import { PerfilClienteStep2Component } from './modulos/intranet-Service/gestion-usuarios/perfil-cliente/perfil-cliente-step2/perfil-cliente-step2.component';
import { RootPerfilClienteComponent } from './modulos/intranet-Service/gestion-usuarios/perfil-cliente/root-perfil-cliente/root-perfil-cliente.component';
import { NuevoClienteComponent } from './modulos/intranet-Service/clientes/nuevo-cliente/nuevo-cliente.component';
import { ConsultarClienteComponent } from './modulos/intranet-Service/clientes/consultar-cliente/consultar-cliente.component';
import { DetalleClienteDirectoComponent } from './modulos/intranet-Service/clientes/detalle-cliente-directo/detalle-cliente-directo.component';
import { EditarClienteDirectoComponent } from './modulos/intranet-Service/clientes/editar-cliente-directo/editar-cliente-directo.component';
import { NuevoClienteCustomerComponent } from './modulos/customer-Service/clientes/nuevo-cliente-customer/nuevo-cliente-customer.component';
import { EditarClienteCustomerComponent } from './modulos/customer-Service/clientes/editar-cliente-customer/editar-cliente-customer.component';
import { DetalleClienteCustomerComponent } from './modulos/customer-Service/clientes/detalle-cliente-customer/detalle-cliente-customer.component';
import { ConsultarClienteCustomerComponent } from './modulos/customer-Service/clientes/consultar-cliente-customer/consultar-cliente-customer.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { CrearServiciosComponent } from './modulos/customer-Service/servicios/crear-servicios/crear-servicios.component';
import { EditarServiciosComponent } from './modulos/customer-Service/servicios/editar-servicios/editar-servicios.component';
import { DetalleServiciosComponent } from './modulos/customer-Service/servicios/detalle-servicios/detalle-servicios.component';
import { ConsultarServiciosComponent } from './modulos/customer-Service/servicios/consultar-servicios/consultar-servicios.component';
import { EntradaDamageComponent } from './modulos/customer-Service/entradas/manifiesto/entrada-damage/entrada-damage.component';
import { CrearServicioCargaComponent } from './modulos/customer-Service/serviciocarga/crear-servicio-carga/crear-servicio-carga.component';
import { ActualizarServicioCargaComponent } from './modulos/customer-Service/serviciocarga/actualizar-servicio-carga/actualizar-servicio-carga.component';
import { DetalleServicioCargaComponent } from './modulos/customer-Service/serviciocarga/detalle-servicio-carga/detalle-servicio-carga.component';
import { ConsultarServicioCargaComponent } from './modulos/customer-Service/serviciocarga/consultar-servicio-carga/consultar-servicio-carga.component';
import { ConsultarSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/consultar-solicitud-servicios/consultar-solicitud-servicios.component';
import { RootSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/root-solicitud-servicios/root-solicitud-servicios.component';
import { DetalleSolicitudServiciosComponent } from './modulos/intranet-Service/solicitud-servicios/detalle-solicitud-servicios/detalle-solicitud-servicios.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { CrearAutotransporteComponent } from './modulos/customer-Service/autotransporte/crear-autotransporte/crear-autotransporte.component';
import { DetalleAutotransporteComponent } from './modulos/customer-Service/autotransporte/detalle-autotransporte/detalle-autotransporte.component';
import { ConsultarAutotransporteComponent } from './modulos/customer-Service/autotransporte/consultar-autotransporte/consultar-autotransporte.component';
import { EditarAutotransporteComponent } from './modulos/customer-Service/autotransporte/editar-autotransporte/editar-autotransporte.component';
import { RegistrarComponent } from './modulos/registrar/registrar.component';
import { CrearReferenciaComponent } from './modulos/customer-Service/referencias/crear-referencia/crear-referencia.component';
import { ConsultarReferenciasComponent } from './modulos/customer-Service/referencias/consultar-referencias/consultar-referencias.component';

import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import {NgFor, AsyncPipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatGridListModule } from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotificamanifiestoComponent,
    EditarmanifiestoComponent,
    ConsultamanifiestoComponent,
    PaginanoencontradaComponent,
    RootmanifiestoComponent,
    DetallemanifiestoComponent,
    RootOperacionesComponent,
    MenuComponent,
    ConfiguracionComponent,
    ConfigUbicacionesComponent,
    ZonasComponent,
    HistorialComponent,
    InventariosComponent,
    RootCustomerComponent,
    MenuCustomerComponent,
    CrearsalidaComponent,
    SolicitudesSalidasComponent,
    DetallesSalidaComponent,
    ActualizarSolicitudSalidaComponent,
    RootUbicacionesComponent,
    UbicacionesComponent,
    VistaComponent,
    VistaUbicaciones2dComponent,
    UsersComponent,
    InicioComponent,
    ConsultarSalidasComponent,
    VerificarSalidasComponent,
    RootSalidasComponent,
    UsuariosComponent,
    RootGestionComponent,
    PerfilesComponent,
    UsuariosStep2Component,
    RootPerfilUsuariosStepsComponent,
    RootPerfilResponsabilidadesComponent,
    PerfilesReponsabilidadesStep1Component,
    PerfilesReponsabilidadesStep2Component,
    PassRecoveryComponent,
    PerfilClienteStep2Component,
    RootPerfilClienteComponent,
    NuevoClienteComponent,
    ConsultarClienteComponent,
    DetalleClienteDirectoComponent,
    EditarClienteDirectoComponent,
    NuevoClienteCustomerComponent,
    EditarClienteCustomerComponent,
    DetalleClienteCustomerComponent,
    ConsultarClienteCustomerComponent,
    CrearServiciosComponent,
    EditarServiciosComponent,
    DetalleServiciosComponent,
    ConsultarServiciosComponent,
    EntradaDamageComponent,
    CrearServicioCargaComponent,
    ActualizarServicioCargaComponent,
    DetalleServicioCargaComponent,
    ConsultarServicioCargaComponent,
    ConsultarSolicitudServiciosComponent,
    RootSolicitudServiciosComponent,
    DetalleSolicitudServiciosComponent,
    CrearAutotransporteComponent,
    DetalleAutotransporteComponent,
    ConsultarAutotransporteComponent,
    EditarAutotransporteComponent,
    RegistrarComponent,
    CrearReferenciaComponent,
    ConsultarReferenciasComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    ModalModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    AutocompleteLibModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatGridListModule,
    MatRadioModule,
    MatPaginatorModule,
    NgFor,
    AsyncPipe
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
