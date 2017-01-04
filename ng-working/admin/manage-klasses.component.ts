import { Component, 
         OnInit, 
         Input, 
         Output, 
         ViewChild,
         EventEmitter }                from '@angular/core';

import { Router }                      from '@angular/router';

import { AdminService }                from './service/admin.service';

import { Teacher }                     from '../teachers/model/teacher';
import { User }                        from '../users/model/user';

import { DefaultComponent }            from '../widget/input/default/default.component';
import { DefaultMeta }                 from '../widget/input/default/model/default-meta';
import { DefaultType }                 from '../widget/input/default/model/default-type';

import { MyEventService }              from '../util/service/my-event.service';
import { MyCheckerService }            from '../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../util/model/my-event';
import { MyResponse }                  from '../util/model/my-response';

import { HelperMyIs }                  from '../util/helper/my-is';
import { HelperMyTime }                from '../util/helper/my-time';
import { HelperMyArray }               from '../util/helper/my-array';
import { HelperMyFormat }              from '../util/helper/my-format';

@Component({
  moduleId: module.id,
  selector: 'manage-klasses',
  templateUrl: 'manage-klasses.component.html',
  styleUrls: [ 'manage-klasses.component.css' ]
})
export class ManageKlassesComponent {

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;

  private loginUser:User;

  private pagination:any;

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private adminService:AdminService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private router:Router ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();
    this.myFormat = new HelperMyFormat();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("manage-klasses / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("manage-klasses / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("manage-klasses / init / 시작");

    // Do something

  }

} // end class