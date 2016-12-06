import 'rxjs/add/operator/switchMap';
import {  Subscription }        from 'rxjs';
import {  Observable }          from 'rxjs/Observable';
import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import {  Router,
          ActivatedRoute,
          Params }              from '@angular/router';

import { LoginService }         from '../service/login.service';
import { UserService }          from '../../users/service/user.service';

import { MyLoggerService }      from '../../util/service/my-logger.service';
import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

import { MyEventWatchTowerService }     from '../../util/service/my-event-watchtower.service';
import { User }                         from '../../users/model/user';
import { MyResponse }                   from '../../util/model/my-response';

@Component({
  moduleId: module.id,
  selector: 'validation',
  templateUrl: 'validation.component.html',
  styleUrls: [ 'validation.component.css' ]
})
export class ValidationComponent implements OnInit {

  private key:string;

  msgTop:string="";
  msgBottom:string="";
  msgGuide:string="등록하신 메일 주소로 보내드린 회원인증링크를 클릭해주세요.";
  msgWarning:string="경고! 정상적이지 않은 접근입니다.";
  msgConfirmed:string="축하합니다! 정상적으로 회원 등록이 완료되었습니다.";
  msgRedirect:string="잠시 뒤에 홈화면으로 이동합니다.";

  isAdmin:boolean=false;

  constructor(  private loginService: LoginService, 
                private userService:UserService,
                private myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private myEventWatchTowerService:MyEventWatchTowerService,
                private route: ActivatedRoute,
                public router: Router) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / ngOnInit / init");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerReady();

  }  

  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setIsAdmin / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("naver-callback / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setMyCheckerReady / 시작");

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("naver-callback / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
        return;
      }

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady

      this.getUserValidation();
    });    
  }  

  getUserValidation(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
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
        return this.userService.confirmUserValidation(this.myCheckerService.getAPIKey(),key);
      }

      // @ Referer : http://stackoverflow.com/questions/35758209/typeerror-cannot-read-property-then-of-undefined
      return Promise.resolve(new MyResponse(false, "", "", "key is not valid!", null, null));

    }).subscribe((myResponse:MyResponse) => {

      // async 데이터 결과를 여기서 처리.
      if(isDebug) console.log("validation / getUserValidation / subscribe / myResponse : ",myResponse);

      // 등록이 완료되었는지 확인.

      if(myResponse.isFailed()) {
        console.log("1. 회원 정보를 등록하고 바로 이동한 경우.");
        this.msgTop = this.msgGuide;
      } else if(myResponse.isSuccess() && myResponse.hasDataProp("is_confirmed")) {

        let is_confirmed:boolean = myResponse.hasDataProp("is_confirmed");
        let is_attack:boolean = myResponse.hasDataProp("is_attack");

        if(is_confirmed) {
          console.log("2. 인증 변경 완료후에는 사용자에게 완료 팝업을 노출.");
          this.msgTop = this.msgConfirmed;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

          // event-watchtower에게 로그인 정보를 전달. 로그인 관련 내용을 화면에 표시합니다.
          let user:User = myResponse.getDataProp("user")
          if(null != user) {
            this.myEventWatchTowerService.announceLogin(user);
          }

        } else if(is_attack) {
          console.log("3. 정상적이지 않은 접근.");
          this.msgTop = this.msgWarning;
          this.msgBottom = this.msgRedirect;

          // 3초 뒤에 홈으로 이동.
          var _self = this;
          setTimeout(function () {
              // 메시지를 3초 뒤에 화면에서 지웁니다.
              _self.router.navigate(['/class-center']);
          }, 3000);

        } else {
          // TODO - 3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.
          console.log("3. 인증 변경 실패에는 사용자에게 실패 팝업 및 문의 할수 있는 이메일/전화번호등을 노출함.");
          this.msgTop = this.msgGuide;
          
        } // end if
      } // end if

      return Promise.resolve(new MyResponse(false, "", "", "myResponse is not valid!", null, myResponse));

    }); // end subscribe

  } // end method


}
