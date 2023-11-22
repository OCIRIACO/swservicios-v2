import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable()
export class CanDeactivateGuard  {

  canDeactivate(component: CanComponentDeactivate, 
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}