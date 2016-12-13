import 'rxjs/add/operator/switchMap';
import {  Subscription }        from 'rxjs';
import {  Observable }          from 'rxjs/Observable';
import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit,
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
export class ValidationComponent implements OnInit, AfterViewInit {

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

  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("validation / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngAfterViewInit");

    this.asyncViewPack();

  }
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("my-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("my-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("validation / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    this.getUserValidation();
  }  

   

  getUserValidation(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("validation / getUserValidation / init");

    // 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.route.queryParams.switchMap((params: Params) => {

      if(isDebug) console.log("validation / getUserValidation / switchMap / params : ",params);

      let key:string = "";
      if(null != params['key']) {
        // 받은 파라미터로 async 데이터를 가져온다.
        key = params['key'];
      }

      if(isDebug) console.log("validation / getUserValidation / switchMap / key : ",key);

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
      if(isDebug) console.log("validation / getUserValidation / subscribe / myResponse : ",myResponse);

      // 등록이 완료되었는지 확인.

      if(myResponse.isFailed()) {

        // 1. 회원 등록 직후, 메일 확인을 요청.
        if(isDebug) console.log("validation / getUserValidation / subscribe / 1. 회원 정보를 등록하고 바로 이동한 경우");
        this.msgTop = this.msgGuide;

      } else if(myResponse.isSuccess() && myResponse.hasDataProp("is_confirmed")) {

        // 2. 메일로 전달된 확인 링크로 들어온 경우.

        let is_confirmed:boolean = myResponse.hasDataProp("is_confirmed");
        let is_attack:boolean = myResponse.hasDataProp("is_attack");

        if(is_confirmed) {
          
          if(isDebug) console.log("validation / getUserValidation / subscribe / 2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
          this.msgTop = this.msgConfirmed;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {

            // 로그인 직전 페이지로 리다이렉트. 
            // 돌아갈 주소가 없다면, 홈으로 이동.
            let redirectUrl:string = _self.myCookie.getCookie("redirectUrl");
            if(null == redirectUrl || "" == redirectUrl) {
              redirectUrl = '/class-center';
            }

            if(isDebug) console.log("validation / getUserValidation / subscribe / 3. 리다이렉트 : ",redirectUrl);

            // 메시지를 3초 뒤에 화면에서 지웁니다.
            _self.router.navigate([redirectUrl]);

          }, 3000);

          // event-watchtower에게 로그인 정보를 전달. 로그인 관련 내용을 화면에 표시합니다.
          let user:User = myResponse.getDataProp("user")
          if(null != user) {
            this.watchTower.announceLogin(user);
          }

        } else if(is_attack) {

          if(isDebug) console.log("validation / getUserValidation / subscribe / 3. 정상적이지 않은 접근.");
          this.msgTop = this.msgWarning;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

        } else {

          if(isDebug) console.log("validation / getUserValidation / subscribe / 4. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
          this.msgTop = this.msgGuide;
          
        } // end if
      } // end if

      // return Promise.resolve(new MyResponse(false, "", "", "myResponse is not valid!", null, myResponse));

    }); // end subscribe

  } // end method


}
