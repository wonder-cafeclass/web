import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';

import { KlassService }           from './klass.service';
import { Klass }                  from './klass';

@Injectable()
export class KlassDetailResolve implements Resolve<Klass> {
  constructor(private ks: KlassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Klass>|boolean {
    let id = +route.params['id'];

    return this.ks.getKlass(id).then(klass => {
      if (klass) {
        return klass;
      } else { // id not found
        this.router.navigate(['/klass-center']);
        return false;
      }
    });
  }
}
