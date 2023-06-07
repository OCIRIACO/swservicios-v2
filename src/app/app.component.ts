import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { classApiLogin } from './serviciosRest/api/api.service.login'


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

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;


  constructor(
    private dataService: classApiLogin,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,

  ) {
    this.dataService.e_validaLocalStorage();

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

}


