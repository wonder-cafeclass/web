import { Injectable }             from '@angular/core';
import { Router, 
         Resolve,
         ActivatedRouteSnapshot } from '@angular/router';

import { KlassService }           from './klass.service';
import { Klass }                  from './model/klass';

import { MyResponse }             from '../util/model/my-response';

@Injectable()
export class KlassDetailResolve implements Resolve<Klass> {
  constructor(private ks: KlassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Klass>|boolean {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-detail-resolve / resolve / 시작");
    
    let id = +route.params['id'];

    return this.ks.getKlass(id).then((myReponse:MyResponse) => {

      if(isDebug) console.log("klass-detail-resolve / resolve / myReponse : ",myReponse);

      /*
      if (klass) {
        return klass;
      } else { // id not found. return to "class center"
        this.router.navigate(['/class-center']);
        return false;
      }
      */

      return Promise.resolve(null);

    });



  }
}
