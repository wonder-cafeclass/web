import { Component, 
         Input, 
         Output,
         ViewChild,
         AfterViewInit }            from '@angular/core';
import { Subscription }             from 'rxjs';
import { Router,
         ActivatedRoute,
         NavigationExtras }         from '@angular/router';

import { LoginService }             from './service/login.service';

import { UserService }              from '../users/service/user.service';
import { User }                     from '../users/model/user';

import { EmailComponent }           from '../widget/input/email/email.component';
import { PasswordComponent }        from '../widget/input/password/password.component';

import { DefaultComponent }         from '../widget/input/default/default.component';
import { DefaultMeta }              from '../widget/input/default/model/default-meta';
import { DefaultOption }            from '../widget/input/default/model/default-option';
import { DefaultType }              from '../widget/input/default/model/default-type';

import { MyLoggerService }          from '../util/service/my-logger.service';
import { MyCheckerService }         from '../util/service/my-checker.service';
import { MyEventService }           from '../util/service/my-event.service';
import { MyEvent }                  from '../util/model/my-event';
import { MyCookie }                 from '../util/http/my-cookie';
import { HelperMyArray }            from '../util/helper/my-array';

import { MyEventWatchTowerService } from '../util/service/my-event-watchtower.service';

import { MyResponse }               from '../util/model/my-response';



@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  kakaoAuthUrl: string;
  naverAuthUrl: string;
  facebookAuthUrl: string;
  cafeclassAuthUrl: string="http://google.co.kr";

  @ViewChild(EmailComponent)
  private emailComponent: EmailComponent;

  @ViewChild(PasswordComponent)
  private passwordComponent: PasswordComponent;

  private email:string;
  private password:string;

  warningMsgHead:string;
  warningMsgTail:string;

  private subscription: Subscription;
  private redirectUrl:string="/class-center";
  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  private myCookie:MyCookie;
  private myArray:HelperMyArray;

  private defaultType:DefaultType;
  private defaultMetaUserSelect:DefaultMeta;
  private userSelectorComponent: DefaultComponent; // 유저 선택 리스트 (운영전용)

  constructor(  public loginService: LoginService, 
                private userService:UserService,
                public myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private activatedRoute:ActivatedRoute,
                public router: Router) {

    this.myCookie = new MyCookie();
    this.myArray = new HelperMyArray();

    this.defaultType = new DefaultType();
    this.defaultMetaUserSelect = this.getMetaUserSelect();

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("login / ngAfterViewInit");

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("login / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("login / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("login / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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

  private checkLoginUser(): void {

    if(this.isDebug()) console.log("login / checkLoginUser / 시작");

    this.userService.getUserCookie(
      this.myCheckerService.getAPIKey()
    ).then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("login / checkLoginUser / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("user")) {
        if(this.isDebug()) console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 있습니다. 홈으로 이동합니다.");
        this.router.navigate([this.redirectUrl]);
      } else {
        if(this.isDebug()) console.log("login / checkLoginUser / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");
        this.init();
      }
    });
  }

  private getQueryString() :void {

    if(this.isDebug()) console.log("kakao-callback / getQueryString / 시작");

    // 리다이렉트로 전달된 외부 쿼리 스트링 파라미터를 가져옵니다.
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {

        if(this.isDebug()) console.log("kakao-callback / getQueryString / param : ",param);

        let redirectUrl:string = param['redirect'];
        if(null != this.redirectUrl && "" != this.redirectUrl) {
          if(this.isDebug()) console.log("kakao-callback / getQueryString / this.redirectUrl : ",this.redirectUrl);
          // 쿠키에 저장합니다.
          this.myCookie.setCookie(
            // cname
            "redirectUrl",
            // cvalue
            redirectUrl,
            // exdays
            1
          );
        } // end if
      }
    ); // end subscribe
  }  

  private init() :void {

    if(this.isDebug()) console.log("login / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // redirect url을 파라미터로 넘겼는지 확인합니다.
    this.getQueryString();

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeLogin
    );    

    // 각 플랫폼 별로 로그인 할 수 있는 주소들을 가져옵니다.
    // 1. kakao
    this.loginService
    .getKakaoAuthUrl()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("login / getKakaoAuthUrl / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
        this.kakaoAuthUrl = myResponse.getDataProp("auth_url");
      }
    });

    // 2. naver
    this.loginService
    .getNaverAuthUrl()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("login / getNaverAuthUrl / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
        this.naverAuthUrl = myResponse.getDataProp("auth_url");
      }
    });

    // 3. facebook
    this.loginService
    .getFacebookAuthUrl()
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("login / getFacebookAuthUrl / myResponse : ",myResponse);
      
      if(myResponse.isSuccess() && myResponse.hasDataProp("auth_url")) {
        this.facebookAuthUrl = myResponse.getDataProp("auth_url");
      }
    });

    //

    // 로그인, 회원 등록의 경우, 최상단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);    
  }

  onChangedFromChild(myEvent:MyEvent) :void {
    // 자식 엘리먼트들의 이벤트 처리

    if(this.isDebug()) console.log("login / onChangedFromChild / 시작");
    if(this.isDebug()) console.log("login / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("login / onChangedFromChild / 중단 / null == myEvent");
      return;
    }
    if(null == myEvent.myChecker) {
      if(this.isDebug()) console.log("login / onChangedFromChild / 중단 / null == myEvent.myChecker");
      return;
    }
    if(null == myEvent.value) {
      if(this.isDebug()) console.log("login / onChangedFromChild / 중단 / null == myEvent.value");
      return;
    }

    // 모든 myEvent는 myChecker를 가지고 들어와야 합니다.
    // myChecker로 다시 한번 더 검사, 통과해야만 사용할 수 있습니다.
    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(this.isDebug()) console.log("login / onChangedFromChild / 중단 / !isOK");
      return;
    }

    // KEY_USER_SELECT

    // 정상적인 값을 가진 이벤트입니다.
    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_SELECT)) {
        this.userSelectorComponent = myEvent.metaObj;
        this.updateUserSelector();
      }

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {

        this.email = myEvent.value;
        if(this.isDebug()) console.log("login / onChangedFromChild / this.email : ",this.email);

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_PASSWORD)) {

        this.password = myEvent.value;
        if(this.isDebug()) console.log("login / onChangedFromChild / this.password : ",this.password);

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_SELECT)) {

        let userId:number = parseInt(myEvent.value);
        this.loginWithSelectedUser(userId);


      } // end if


    } else if(  myEvent.hasEventName(this.myEventService.ON_KEYUP_ENTER) || 
                myEvent.hasEventName(this.myEventService.ON_SUBMIT)) {

      if(this.myEventService.KEY_USER_EMAIL === myEvent.key) {

        this.email = myEvent.value;
        if(this.isDebug()) console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_EMAIL ",this.email);
        // 이메일 입력 칸에서 엔터키를 눌렀습니다. 

        // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
        // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
        this.verifyEmailNPassword();

      } else if(this.myEventService.KEY_USER_PASSWORD === myEvent.key) {

        this.password = myEvent.value;
        if(this.isDebug()) console.log("login / onChangedFromChild / ON_KEYUP_ENTER / KEY_USER_PASSWORD ",this.password);
        // 패스워드 입력 칸에서 엔터키를 눌렀습니다. 

        // 1. 이메일과 패스워드가 유효하다면 유저 확인 프로세스를 진행합니다.
        // 2. 그렇지 않다면 안내 메시지를 유저에게 보여줍니다.
        this.verifyEmailNPassword();

      }  // end if

    } // end if

    if(this.isDebug()) console.log("login / onChangedFromChild / done");
  }

  private loginWithSelectedUser(userId:number):void {

    if(this.isDebug()) console.log("login / loginWithSelectedUser / 시작");

    if(!(0 < userId)) {
      if(this.isDebug()) console.log("login / loginWithSelectedUser / 중단 / userId is not valid!");
      return;
    } // end if

    if(null == this.userMap) {
      if(this.isDebug()) console.log("login / loginWithSelectedUser / 중단 / this.userMap is not valid!");
      return;
    } // end if

    let user:User = this.userMap[""+userId];

    if(null == user) {
      if(this.isDebug()) console.log("login / loginWithSelectedUser / 중단 / user is not valid!");
      return;
    }

    if(this.isDebug()) console.log("login / loginWithSelectedUser / userId : ",userId);

    // 유저 데이터를 선택했다면, 선택된 유저의 이메일 주소로 해당 유저 데이터를 한번 더 받아옵니다. 
    // 유저의 선생님 데이터도 포함됩니다.

    this.getUserByEmail(user.email);

  }

  private getUserByEmail(email:string):void {

    if(this.isDebug()) console.log("login / getUserByEmail / 시작");

    if(null == email || "" === email) {
      if(this.isDebug()) console.log("login / getUserByEmail / 중단 / email is not valid!");
      return;
    } // end if

    this.userService
    .getUserByEmail(email)
    .then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("login / getUserByEmail / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("user")) {

        // 저장 완료! 초기화!
        if(myResponse.hasDataProp("user")) {

          let userJSON = myResponse.getDataProp("user");
          let user:User = new User().setJSON(userJSON);

          if(this.isDebug()) console.log("login / getUserByEmail / user : ",user);

          this.announceLoginUser(user);
          this.goRedirect();

        } // end if

      } else if(myResponse.isFailed()) {  

        if(this.isDebug()) console.log("login / getUserByEmail / 중단 / 회원 인증에 실패했습니다. 메시지를 화면에 노출합니다.");
        this.warningMsgHead = warningMsgHead;
        this.warningMsgTail = warningMsgTail;

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

        // 에러 로그 등록
        this.watchTower.logAPIError(`login / getUserByEmail / email : ${this.email}`);

      } // end if

    }); // end service

  } // end method

  private updateUserSelector():void {

    if(this.isDebug()) console.log("login / updateUserSelector / 시작");

    if(null == this.userSelectorComponent) {
      if(this.isDebug()) console.log("login / updateUserSelector / 중단 / null != this.userSelectorComponent");
      return;
    } // end if

    if(this.myArray.isNotOK(this.userList)) {
      if(this.isDebug()) console.log("login / updateUserSelector / 중단 / this.myArray.isNotOK(this.userList)");
      return;
    } // end if

    let defaultOptonList:DefaultOption[] = this.getDefaultOptionUserList(this.userList);
    this.userSelectorComponent.setSelectOption(defaultOptonList);

  }

  verifyEmailNPassword():void {

    if(this.isDebug()) console.log("login / verifyEmailNPassword / 시작");

    let warningMsgHead:string = "아이디 또는 비밀번호를 다시 확인하세요."; 
    let warningMsgTail:string = "카페클래스에 등록되지 않은 아이디거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다."; 
    this.warningMsgHead = null;
    this.warningMsgTail = null;
    if(null == this.email || "" == this.email) {
      if(this.isDebug()) console.log("login / verifyEmailNPassword / 중단 / 이메일 주소에 문제가 있습니다.", this.email);
      this.warningMsgHead = warningMsgHead;
      this.warningMsgTail = warningMsgTail;
      return;
    }

    if(null == this.password || "" == this.password) {
      if(this.isDebug()) console.log("login / verifyEmailNPassword / 중단 / 암호에 문제가 있습니다.", this.password);
      this.warningMsgHead = warningMsgHead;
      this.warningMsgTail = warningMsgTail;
      return;
    }

    // DB에 이메일 주소와 암호를 조회합니다.
    let apiKey:string = this.myCheckerService.getAPIKey();
    if(null != apiKey && "" != apiKey) {
      this.userService
      .confirmUserEmailPassword(apiKey, this.email, this.password)
      .then((myResponse:MyResponse) => {

        // 로그 등록 결과를 확인해볼 수 있습니다.
        if(this.isDebug()) console.log("login / verifyEmailNPassword / myResponse : ",myResponse);

        if(myResponse.isSuccess() && myResponse.hasDataProp("user")) {

          // 저장 완료! 초기화!
          if(myResponse.hasDataProp("user")) {

            let userJSON = myResponse.getDataProp("user");
            let user:User = new User().setJSON(userJSON);

            if(this.isDebug()) console.log("login / verifyEmailNPassword / user : ",user);

            this.announceLoginUser(user);

            this.goRedirect();

          } // end if

        } else if(myResponse.isFailed()) {  

          if(this.isDebug()) console.log("login / confirmUserEmailPassword / 중단 / 회원 인증에 실패했습니다. 메시지를 화면에 노출합니다.");
          this.warningMsgHead = warningMsgHead;
          this.warningMsgTail = warningMsgTail;

          if(null != myResponse.error) {
            this.watchTower.announceErrorMsgArr([myResponse.error]);
          } // end if

          // 에러 로그 등록
          this.watchTower.logAPIError(`login / verifyEmailNPassword / email : ${this.email}`);

        } // end if

      });
    } // end service    

  }

  announceLoginUser(user:User) :void {

    if(this.isDebug()) console.log("login / announceLoginUser / 시작");

    if(null == user) {
      if(this.isDebug()) console.log("login / announceLoginUser / 중단 / null == user");
      return;
    }

    this.watchTower.announceLogin(user);
    if(user.isTeacher()) {
      this.watchTower.announceLoginTeacher(user.getTeacher());
    } // end if

  } // end method

  goRedirect() :void {

    if(this.isDebug()) console.log("login / goRedirect / 시작");

    let redirectUrl:string = this.myCookie.getCookie("redirectUrl");
    if(null == redirectUrl || "" == redirectUrl) {
      redirectUrl = '/class-center';
    }
    if(this.isDebug()) console.log("login / goRedirect / redirectUrl : ",redirectUrl);
    this.router.navigate([redirectUrl]);

  } // end method

  onClickLogin(event):void {

    event.stopPropagation();
    event.preventDefault();

    this.verifyEmailNPassword();

  }

  onClickLogo(event):void {

    event.stopPropagation();
    event.preventDefault();

    // 홈으로 이동
    this.router.navigate(["/"]);
  }

  private hitCnt:number=0;
  onClickTitle(event):void {

    event.stopPropagation();
    event.preventDefault();

    if(this.isDebug()) console.log("login / goRedirect / 시작");

    if(!this.isAdmin) {
      return;
    }

    this.hitCnt++;
    if(this.isDebug()) console.log("login / goRedirect / this.hitCnt : ",this.hitCnt);

    // 3번 이상 클릭시, 유저 리스트를 노출합니다.
    if(this.hitCnt == 3) {
      this.getUserList();
    } // end if

  } // end method

  private userList:User[];
  private userMap:any;
  getUserList() :void {

    if(this.isDebug()) console.log("login / getUserList / 시작");

    if(!this.isAdmin) {
      if(this.isDebug()) console.log("login / getUserList / 중단 / 운영 서버가 아닙니다.");
      return;
    }

    let apiKey:string = this.myCheckerService.getAPIKey();
    if(null == apiKey || "" === apiKey) {
      if(this.isDebug()) console.log("login / getUserList / 중단 / apiKey is not valid!");
      return;
    }

    // 최대 100개의 유저 정보를 가져옵니다.
    this.userService
    .getUserList(apiKey)
    .then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("login / getUserList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("user_list")) {

        let userJSONList:any[] = myResponse.getDataProp("user_list");
        let userList:User[] = [];
        this.userMap = {};
        for (var i = 0; i < userJSONList.length; ++i) {
          let userJSON:any = userJSONList[i];
          let user:User = new User().setJSON(userJSON); 
          userList.push(user);
          this.userMap[""+user.id] = user;
        }

        this.userList = userList;
        if(this.isDebug()) console.log("login / getUserList / userList : ",userList);

        this.updateUserSelector();

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

        // 에러 로그 등록
        this.watchTower.logAPIError(`login / verifyEmailNPassword / email : ${this.email}`);

      } // end if

    }); // end service

  } // end method

  private getMetaUserSelect():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "사용자리스트",
      // public placeholder:string
      "사용자를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_USER_SELECT,
      // public checkerKey:string
      "user_id",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }  

  private getDefaultOptionUserList(userList:User[]):DefaultOption[] {
    let keyList:string[] = [];  
    let valueList:string[] = [];

    keyList.push("사용자를 선택해주세요.");
    valueList.push("");

    for (var i = 0; i < userList.length; ++i) {
      let user:User = userList[i];

      keyList.push(`${user.name} (${user.nickname})`);
      valueList.push("" + user.id);

    }

    return this.getDefaultOptionList(keyList, valueList, "");
  } // end method

  private getDefaultOptionList(keyList:string[],valueList:string[],valueFocus:string) :DefaultOption[] {

    if(null == this.watchTower) {
      return [];
    }

    return this.watchTower
    .getMyConst()
    .getDefaultOptionList(
      // keyList:string[], 
      keyList,
      // valueList:string[],
      valueList,
      // valueFocus:string
      valueFocus
    );
  } // end method   


}
