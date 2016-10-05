import { Injectable }           from '@angular/core';
import { CanDeactivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }  from '@angular/router';

import { ClassDetailComponent } from './class-center/class-detail.component';

import { Observable }    from 'rxjs/Observable';

// 1. guard reusable
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// 2. (component-specific) - CanDeactivate guard for our CrisisDetailComponent.
/*
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ClassDetailComponent> {

  canDeactivate(
    component: ClassDetailComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    // Get the Crisis Center ID
    console.log(route.params['id']);

    // Get the current URL
    console.log(state.url);

    // Allow synchronous navigation (`true`) if no _class or the _class is unchanged
    if (!component._class || component._class.name === component.editName) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return component.dialogService.confirm('Discard changes?');
  }
}
*/
