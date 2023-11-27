import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { serviceUbicaciones2d } from 'src/app/service/service.ubicaciones2d'

@Component({
  selector: 'app-dialog-vista-carril',
  templateUrl: './dialog-vista-carril.component.html',
  styleUrls: ['./dialog-vista-carril.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogVistaCarrilComponent {

  htmlVistaCarril!: string;

  constructor(
    private serviceUbicaciones2d: serviceUbicaciones2d,
  ) {

    

    //this.htmlVistCarril =  this.serviceUbicaciones2d.datosVistaAreaCarril;
   }

 

  /*ngOnInit(): void {
    this.htmlVistCarril =  this.serviceUbicaciones2d.datosVistaAreaCarril;
  }*/

}
