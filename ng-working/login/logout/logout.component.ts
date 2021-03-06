import {  Component, 
          Input, 
          Output,
          OnInit }                    from '@angular/core';
import { Router,
         NavigationExtras }           from '@angular/router';

import { UserService }                from '../../users/service/user.service';

import { MyLoggerService }            from '../../util/service/my-logger.service';
import { MyCheckerService }           from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }   from '../../util/service/my-event-watchtower.service';

import { MyResponse }                 from '../../util/model/my-response';

@Component({
  moduleId: module.id,
  selector: 'logout',
  templateUrl: 'logout.component.html',
  styleUrls: [ 'logout.component.css' ]
})
export class LogoutComponent implements OnInit {

  constructor(  private userService:UserService,
                private myCheckerService:MyCheckerService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService,
                public router: Router) {}

  ngOnInit(): void {
    this.setMyCheckerReady();
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private setMyCheckerReady() :void {

    if(this.isDebug()) console.log("logout / setMyCheckerReady / 시작");

    // 페이지 이동으로 진입한 경우, watch tower에 저장된 변수 값을 가져온다.
    if(this.watchTower.getIsMyCheckerReady()) {
      this.setMyChecker();
      this.init();
    }

    // 직접 주소를 입력하여 이동한 경우.
    this.watchTower.myCheckerServicePackReady$.subscribe(
      (isReady:boolean) => {

      if(this.isDebug()) console.log("logout / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
        return;
      }
      
      this.init();
    });    
  }



  private init() :void {
   this.setMyChecker();
   this.logActionPage();
   this.deleteLoginCookie();
  } 

  private setMyChecker() :void {

    if(this.isDebug()) console.log("logout / setMyChecker / 시작");

    if(this.watchTower.getIsMyCheckerReady()) {

      this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(),
        // constMap:any
        this.watchTower.getConstMap(),
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(),
        // apiKey:string
        this.watchTower.getApiKey()
      ); // end setReady

      if(this.isDebug()) console.log("logout / setMyChecker / done!");
    } // end if

  } 

  private logActionPage() :void {

    if(this.isDebug()) console.log("logout / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLogout
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("logout / logActionPage / myResponse : ",myResponse);
    })
  } 

  private deleteLoginCookie() :void {

    if(this.isDebug()) console.log("logout / deleteLoginCookie / 시작");

    // 로그아웃시 해야할 일
    // 1. 로그인 쿠키를 지웁니다.
    this.userService
    .deleteUserCookie()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("logout / deleteLoginCookie / myResponse : ",myResponse);
      // 1-1. 플랫폼 로그아웃 처리도 해줍니다.(나중에...)

      // 2. event-watch-tower를 통해서 로그아웃을 전파합니다. 
      // 해당 이벤트 스트림을 받는 엘리먼트들은 로그아웃 처리를 해줍니다.
      this.emitNoUser();
      this.goHome();
    });     
  }  

  private emitNoUser() :void {
    this.watchTower.announceLoginTeacher(null);
    this.watchTower.announceLogin(null);
  } // end

  private goHome() :void {
      // 1. 홈화면으로 돌아갑니다. 
      // TODO 3-1. 로그아웃시 액세스가 가능하다면 해당 화면에 머무릅니다.
      // TODO 3-2. 로그아웃시 머물수 없는 화면이라면 홈화면으로 돌아갑니다.
      this.router.navigate(['/class-center']);
  }
}