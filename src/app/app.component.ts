import { Component, HostListener } from '@angular/core';

import {classApiLogin} from './serviciosRest/api/api.service.login'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'
]
})
export class AppComponent {
  title = 'swservicios';

  /*@HostListener('window:beforeunload', ['$event']) 
  onBeforeUnload() {
    return window.confirm('There is the unsaved message....');
  }*/

    
  constructor(private dataService: classApiLogin){
    this.dataService.e_validaLocalStorage();  
  }

}


