import { Component }                   from '@angular/core';
import { Router }                      from '@angular/router';

import { MyEventService }              from '../util/service/my-event.service';
import { MyCheckerService }            from '../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../util/model/my-event';
import { MyResponse }                  from '../util/model/my-response';

import { User }                        from '../users/model/user';


@Component({
  moduleId: module.id,
  selector: 'admin-home',
  templateUrl: 'admin.component.html',
  styleUrls: [ 'admin.component.css' ]
})

export class AdminComponent {

  private loginUser:User;

  constructor(  private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private router:Router) {

    this.subscribeLoginUser();
    this.subscribeEventPack();

    this.watchTower.announceToggleFooter(false);

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("admin-home / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("admin-home / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("admin-home / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("admin-home / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("admin-home / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("admin-home / init / 시작");

  } 

}
