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

    // 이 주소에 접근할 수 있는 사람들을 제한해야 함.
    // 운영자 권한이 있는 사람들로 제한. 

    // Auth-Guard로 할 것을 제안.

    // 서버에 쿠키를 만듬. 브라우저에서는 조회 안되는 방식.
    // 디버깅 여부를 쿠키에 저장. 
    // app-root에서는 이 쿠키의 유무를 확인해서 디버깅 모드를 켜고 끈다.

    // 1. 서비스의 기본적인 제반사항중, 문제가 발생한다면 브라우저에서도 로그를 볼수 있어야 할까?

  }

} // end class