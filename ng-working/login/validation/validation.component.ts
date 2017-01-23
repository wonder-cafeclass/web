import 'rxjs/add/operator/switchMap';
import {  Subscription }        from 'rxjs';
import {  Observable }          from 'rxjs/Observable';
import {  Component, 
          Input, 
          Output,
          ViewChild,
          AfterViewInit }       from '@angular/core';
import {  Router,
          Resolve,
          ActivatedRoute,
          Params }              from '@angular/router';

import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';

import { MyLoggerService }      from '../../util/service/my-logger.service';
import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

import { User }                         from '../../users/model/user';
import { MyResponse }                   from '../../util/model/my-response';
import { MyCookie }                     from '../../util/http/my-cookie';
import { MyEventWatchTowerService }     from '../../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'validation',
  templateUrl: 'validation.component.html',
  styleUrls: [ 'validation.component.css' ]
})
export class ValidationComponent implements AfterViewInit {

  private key:string;

  msgTop:string="";
  msgBottom:string="";
  msgGuide:string="등록하신 메일 주소로 보내드린 회원인증링크를 클릭해주세요.";
  msgWarning:string="경고! 정상적이지 않은 접근입니다.";
  msgConfirmed:string="축하합니다! 정상적으로 회원 등록이 완료되었습니다.";
  msgRedirect:string="잠시 뒤에 홈화면으로 이동합니다.";

  isAdmin:boolean=false;

  private myCookie:MyCookie;

  constructor(  private loginService: LoginService, 
                private userService:UserService,
                private myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private route: ActivatedRoute,
                public router: Router) {

    this.myCookie = new MyCookie();

    this.userService.setWatchTower(watchTower);

  }

  private isDebug():boolean {
    // return true;
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    if(this.isDebug()) console.log("my-info / ngAfterViewInit");
    this.asyncViewPack();

  }
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("my-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("my-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdminServer();
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
  }    

  private init() :void {

    if(this.isDebug()) console.log("validation / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    this.getUserValidation();

    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);
    this.watchTower.announceToggleFooter(false);
  }  

   

  getUserValidation(): void {

    if(this.isDebug()) console.log("validation / getUserValidation / init");

    // 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.route.queryParams.switchMap((params: Params) => {

      if(this.isDebug()) console.log("validation / getUserValidation / switchMap / params : ",params);

      let key:string = "";
      if(null != params['key']) {
        // 받은 파라미터로 async 데이터를 가져온다.
        key = params['key'];
      }

      if(this.isDebug()) console.log("validation / getUserValidation / switchMap / key : ",key);

      if(null != key && "" != key) {

        // 1. 메일로 전달된 링크로 진입, 인증키로 회원 정보 확인.
        return this.userService.confirmUserValidation(this.myCheckerService.getAPIKey(),key);
        
      } else {
        
        // 2. 회원 등록 직후, 메일 확인을 요청하는 메시지를 회원에게 표시
        let myResponse:MyResponse = 
        new MyResponse(
          // public success:boolean
          false,
          // public message:string
          "",
          // public query:string
          "",
          // public error:string
          "",
          // public data:any
          null,
          // public extra:any         
          null
        );

        // @ Referer : http://stackoverflow.com/questions/35758209/typeerror-cannot-read-property-then-of-undefined
        return Promise.resolve(myResponse);
      }

    }).subscribe((myResponse:MyResponse) => {

      // async 데이터 결과를 여기서 처리.
      if(this.isDebug()) console.log("validation / getUserValidation / subscribe / myResponse : ",myResponse);

      // 등록이 완료되었는지 확인.

      if(myResponse.isFailed()) {

        // 1. 회원 등록 직후, 메일 확인을 요청.
        if(this.isDebug()) console.log("validation / getUserValidation / subscribe / 1. 회원 정보를 등록하고 바로 이동한 경우");
        this.msgTop = this.msgGuide;

      } else if(myResponse.isSuccess() && myResponse.hasDataProp("is_confirmed")) {

        // 2. 메일로 전달된 확인 링크로 들어온 경우.

        let is_confirmed:boolean = myResponse.hasDataProp("is_confirmed");
        let is_attack:boolean = myResponse.hasDataProp("is_attack");

        if(is_confirmed) {
          
          if(this.isDebug()) console.log("validation / getUserValidation / subscribe / 2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
          this.msgTop = this.msgConfirmed;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {

            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            let redirectUrl:string = _self.myCookie.popCookie("redirectUrl");
            if(null == redirectUrl || "" == redirectUrl) {
              redirectUrl = '/class-center';
            } // end if

            if(_self.isDebug()) console.log("validation / getUserValidation / subscribe / 3. 리다이렉트 : ",redirectUrl);
            console.log("validation / getUserValidation / subscribe / 3. 리다이렉트 : ",redirectUrl); // wonder.jung

            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.router.navigate([redirectUrl]);

          }, 3000);

          // event-watchtower에게 로그인 정보를 전달. 로그인 관련 내용을 화면에 표시합니다.
          let userJSON = myResponse.getDataProp("user");
          let user:User = new User().setJSON(userJSON);

          if(null != user) {
            this.watchTower.announceLogin(user);
          }

        } else if(is_attack) {

          if(this.isDebug()) console.log("validation / getUserValidation / subscribe / 3. 정상적이지 않은 접근.");
          this.msgTop = this.msgWarning;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

        } else {

          if(this.isDebug()) console.log("validation / getUserValidation / subscribe / 4. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
          this.msgTop = this.msgGuide;
          
        } // end if

      } // end if

    }); // end subscribe

  } // end method

  onClickLogo(event):void {

    event.stopPropagation();
    event.preventDefault();

    // 홈으로 이동
    this.router.navigate(["/"]);
  } // end method  

} // end class
