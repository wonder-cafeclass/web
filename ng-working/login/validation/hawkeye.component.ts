import {  Component, 
          AfterViewInit }             from '@angular/core';
import {  Router }                    from '@angular/router';

import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

import { MyResponse }                 from '../../util/model/my-response';
import { MyCookie }                   from '../../util/http/my-cookie';

@Component({
  moduleId: module.id,
  selector: 'hawkeye',
  templateUrl: 'hawkeye.component.html',
  styleUrls: [ 'hawkeye.component.css' ]

})
export class HawkeyeComponent implements AfterViewInit {

  constructor(  private watchTower:MyEventWatchTowerService,
                public router:Router) {} // end function

  ngAfterViewInit(): void {

    // 디버깅 모드로 변경.
    this.watchTower.announceIsDebugging(true);

    // 홈으로 이동.
    this.router.navigate(['/']);

  }

} // end class