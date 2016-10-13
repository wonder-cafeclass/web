import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';

import { Class, ClassService } from './class.service';

@Injectable()
export class ClassDetailResolve implements Resolve<Class> {
  constructor(private cs: ClassService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot): Promise<Class>|boolean {
    let id = +route.params['id'];
    return this.cs.getClass(id).then(_class => {
      if (_class) {
        return _class;
      } else { // id not found
        this.router.navigate(['/class-center']);
        return false;
      }
    });
  }
}
