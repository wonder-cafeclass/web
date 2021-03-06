import {  Component, 
          ViewChild,
          ViewChildren,
          QueryList,
          OnInit, 
          AfterViewInit,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import {  Router }                    from '@angular/router';

import { ProfileImgUploadComponent }  from '../../../widget/input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }          from '../../../widget/input/password/password.component';
import { PasswordsTripletComponent }  from '../../../widget/input/password/passwords-triplet.component';
import { MobileComponent }            from '../../../widget/input/mobile/mobile.component';
import { GenderComponent }            from '../../../widget/input/gender/gender.component';
import { BirthdayComponent }          from '../../../widget/input/birthday/birthday.component';

import { DefaultComponent }           from '../../../widget/input/default/default.component';
import { DefaultMeta }                from '../../../widget/input/default/model/default-meta';

import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';          

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';

import { MyResponse }                 from '../../../util/model/my-response';

import { UserService }                from '../../../users/service/user.service';

import { User }                       from '../../../users/model/user';

@Component({
  moduleId: module.id,
  selector: 'my-info',
  templateUrl: 'my-info.component.html',
  styleUrls: [ 'my-info.component.css' ]
})
export class MyInfoComponent implements OnInit, AfterViewInit {

  @Input() eventKey:string = "";
  @Output() emitter = new EventEmitter<any>();

  loginUser:User;
  loginUserCopy:User;

  private passwordCur:string;
  private passwordNew:string;
  private passwordRe:string;
  eventKeyPWHead:string;
  eventKeyPWBody:string;
  eventKeyPWTail:string;

  @ViewChildren(DefaultComponent) inputComponentList: QueryList<DefaultComponent>;
  defaultMetaList:DefaultMeta[];

  private emailComponent: DefaultComponent;
  private nameComponent: DefaultComponent;
  private nicknameComponent: DefaultComponent;

  @ViewChild(PasswordsTripletComponent)
  private passwordsComponent: PasswordsTripletComponent;

  @ViewChild(MobileComponent)
  private mobileComponent: MobileComponent;  

  @ViewChild(GenderComponent)
  private genderComponent: GenderComponent;  

  @ViewChild(BirthdayComponent)
  private birthdayComponent: BirthdayComponent;  

  @ViewChild(ProfileImgUploadComponent)
  private profileImgUploadComponent: ProfileImgUploadComponent;  

  isAdmin:boolean=false;

  // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
  isReadyToSave:boolean=false;

  constructor(public myEventService:MyEventService,
              private myLoggerService:MyLoggerService,
              public myCheckerService:MyCheckerService,
              private userService:UserService,
              private watchTower:MyEventWatchTowerService,
              public router:Router) {

    this.eventKeyPWHead = this.myEventService.KEY_USER_CUR_PASSWORD;
    this.eventKeyPWBody = this.myEventService.KEY_USER_NEW_PASSWORD;
    this.eventKeyPWTail = this.myEventService.KEY_USER_RE_PASSWORD;

    this.defaultMetaList = this.myEventService.getDefaultMetaListMyInfo();

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
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
  private setLoginUser() :void {

    if(this.isDebug()) console.log("my-info / setLoginUser / 시작");

    // 로그인 데이터를 가져옵니다.
    let userJSON = this.watchTower.getLoginUser();
    let loginUser:User = null;
    if(null != userJSON) {
      loginUser = new User().setJSON(userJSON);
    }
    if(null != loginUser) {
      this.loginUser = loginUser;
      this.loginUserCopy = this.loginUser.copy();
      this.fillViewUserInfo();      
    } else {
      // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
      // TODO - 페이지 리다이렉트 데이터를 전달해야 합니다.
      this.router.navigate(['/login']);
    } // end if

  }

  private logActionPage() :void {

    if(this.isDebug()) console.log("my-info / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeMyInfo
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("my-info / logActionPage / myResponse : ",myResponse);
    }) // end service

  }  

  private init() :void {

    if(this.isDebug()) console.log("my-info / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();
    // 컴포넌트가 준비된 것을 부모 객체에게 전달합니다.
    this.emitEventOnReady();

  }

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("default / emitEventOnReady / 시작");

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );

    this.emitter.emit(myEvent);

  }     

  fillViewUserInfo() :void {

    if(this.isDebug()) console.log("my-info / fillViewUserInfo");
    if(this.isDebug()) console.log("my-info / fillViewUserInfo / this.loginUser : ",this.loginUser);

    if(null == this.loginUser) {
      if(this.isDebug()) console.log("my-info / fillViewUserInfo / 중단 / this.loginUser is not valid!");
      return;
    }
    this.setEmail();
    this.setName();
    this.setNickname();
    this.profileImgUploadComponent.setProfileImg(this.loginUserCopy.thumbnail);
    this.mobileComponent.setMobileHead(this.loginUserCopy.getMobileHead());
    this.mobileComponent.setMobileBody(this.loginUserCopy.getMobileBody());
    this.mobileComponent.setMobileTail(this.loginUserCopy.getMobileTail());
    this.genderComponent.setGender(this.loginUserCopy.gender);
    this.birthdayComponent.setBirthYear(this.loginUserCopy.getBirthYear());
    this.birthdayComponent.setBirthMonth(this.loginUserCopy.getBirthMonth());
    this.birthdayComponent.setBirthDay(this.loginUserCopy.getBirthMonth(),this.loginUserCopy.getBirthDay());
  }

  // @ Desc : 외부에서 이 컴포넌트를 보여주기 전에 호출.
  setReadyBeforeShow():void {
    if(this.isDebug()) console.log("my-info / setReadyBeforeShow / 시작");
    this.unlockFooter();
  }

  private unlockFooter():void {
    if(null != this.watchTower) {
      // 푸터를 하단 고정에서 해제
      this.watchTower.announceFooterUpdate();
    }
  }

  private setEmail():void {

    if(this.isDebug()) console.log("my-info / setEmail");

    if(null == this.loginUserCopy) {
      if(this.isDebug()) console.log("my-info / setEmail / 중단 / null == this.loginUserCopy");
      return;
    }
    if(null == this.emailComponent) {
      if(this.isDebug()) console.log("my-info / setEmail / 중단 / null == this.emailComponent");
      return;
    }

    this.emailComponent.setInput(this.loginUserCopy.email);

  }

  private setName():void {

    if(this.isDebug()) console.log("my-info / setName");

    if(null == this.loginUserCopy) {
      if(this.isDebug()) console.log("my-info / setName / 중단 / null == this.loginUserCopy");
      return;
    }
    if(null == this.nameComponent) {
      if(this.isDebug()) console.log("my-info / setName / 중단 / null == this.nameComponent");
      return;
    }

    this.nameComponent.setInput(this.loginUserCopy.name);

  }

  private setNickname():void {

    if(this.isDebug()) console.log("my-info / setNickname");

    if(null == this.loginUserCopy) {
      if(this.isDebug()) console.log("my-info / setNickname / 중단 / null == this.loginUserCopy");
      return;
    }
    if(null == this.nicknameComponent) {
      if(this.isDebug()) console.log("my-info / setNickname / 중단 / null == this.nicknameComponent");
      return;
    }

    this.nicknameComponent.setInput(this.loginUserCopy.nickname);    

  }

  private confirmUserEmailPassword(password:string) :void {

    if(this.isDebug()) console.log("my-info / confirmUserEmailPassword / init");

    // 현재 유저의 비밀번호와 동일한지 비교합니다.
    this.userService.confirmUserEmailPassword(
      // apiKey:string
      this.watchTower.getApiKey(),
      // email:string
      this.loginUserCopy.email,
      // password:string
      password
    ).then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("my-info / confirmUserEmailPassword / myResponse : ",myResponse);

      let user:User = null;
      if(myResponse.isSuccess()) {
        user = myResponse.digDataProp(["user","mobile"]);
      } // end if
      if(null != user) {
        if(this.isDebug()) console.log("my-info / confirmUserEmailPassword / 패스워드가 확인되었습니다.");
        if(this.isDebug()) console.log("my-info / confirmUserEmailPassword / user : ",user);

        // wonder.jung
        // 사용자가 입력한 패스워드를 변수 - cur_pw에 등록.
        this.passwordCur=password;
        // 사용자에게 성공 메시지 노출
        this.passwordsComponent.showTooltipSuccess(
          // eventKey:string
          this.passwordsComponent.eventKeyHead,
          // msg:string
          "성공! 현재 비밀번호가 확인되었습니다."
        );

      } else {

        // 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출
        if(this.isDebug()) console.log("my-info / confirmUserEmailPassword / 사용자가 입력한 암호와 다를 경우는 경고 메시지를 노출.");
        this.passwordsComponent.showTooltipWarning(
          // eventKey:string
          this.passwordsComponent.eventKeyHead,
          // msg:string
          "비밀번호를 다시 확인해주세요."
        );

      }// end if
    });     
  }

  private confirmNewPassword(password:string) :void {

    if(this.isDebug()) console.log("my-info / confirmNewPassword / init");

    // 1. 새로운 패스워드는 이전의 패스워드와 달라야 합니다.
    if(this.passwordCur === password) {
      if(this.isDebug()) console.log("my-info / confirmNewPassword / 중단 / 이전 비밀번화와 새로운 비밀번호가 같음.");
      this.passwordsComponent.showTooltipWarning(
        // eventKey:string
        this.passwordsComponent.eventKeyBody,
        // msg:string
        "새로운 비밀번호가 이전과 같습니다!"
      );
    } else {
      if(this.isDebug()) console.log("my-info / confirmNewPassword / 유효한 새로운 패스워드를 받았습니다.");
      // 변수에 저장합니다.
      this.passwordNew = password;
      // 사용자에게 성공 메시지 노출
      this.passwordsComponent.showTooltipSuccess(
        // eventKey:string
        this.passwordsComponent.eventKeyBody,
        // msg:string
        "성공! 새로운 비밀번호가 완벽합니다."
      );
    } // end if
  }

  private confirmRepassword(password:string) :void {

    if(this.isDebug()) console.log("my-info / confirmRepassword / init");

    if(this.passwordNew !== password) {
      // 새로운 비밀번호 재확인이 새로운 비밀번호와 다릅니다. 
      // 경고 메시지 노출 
      this.passwordsComponent.showTooltipWarning(
        // eventKey:string
        this.passwordsComponent.eventKeyTail,
        // msg:string
        "새로운 비밀번호와 다릅니다!"
      );
    } else {
      // 변수에 저장합니다.
      this.passwordRe = password;
      // 사용자에게 성공 메시지 노출
      this.passwordsComponent.showTooltipSuccess(
        // eventKey:string
        this.passwordsComponent.eventKeyTail,
        // msg:string
        "성공! 새로운 비밀번호가 완벽합니다."
      );
      // 저장 버튼 활성화.
      this.isReadyToSave=true;
    } // end if    

  }  

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    if(this.isDebug()) console.log("my-info / onChangedFromChild / init");
    if(this.isDebug()) console.log("my-info / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("my-info / onChangedFromChild / myEvent.key : ",myEvent.key);
    if(this.isDebug()) console.log("my-info / onChangedFromChild / myEvent.value : ",myEvent.value);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("my-info / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // 에러 로그 등록
      this.myLoggerService.logError(
        // apiKey:string
        this.watchTower.getApiKey(),
        // errorType:string
        this.myLoggerService.errorTypeNotValidValue,
        // errorMsg:string
        `my-info / onChangedFromChild / updateUserByUser / myEvent.isNotValid()`
      ); // end logger      
      return;
    }

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(this.isDebug()) console.log("my-info / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      return;
    }
    
    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {

        this.emailComponent = myEvent.metaObj;
        this.setEmail();

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

        this.nameComponent = myEvent.metaObj;
        this.setName();

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {

        this.nicknameComponent = myEvent.metaObj;
        this.setNickname();
        
      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_CUR_PASSWORD)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_CUR_PASSWORD");
        this.confirmUserEmailPassword(myEvent.value);
        // end KEY_USER_CUR_PASSWORD
      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NEW_PASSWORD)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_NEW_PASSWORD");
        this.confirmNewPassword(myEvent.value);
        // end KEY_USER_NEW_PASSWORD
      } else if(myEvent.hasKey(this.myEventService.KEY_USER_RE_PASSWORD)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_RE_PASSWORD");
        this.confirmRepassword(myEvent.value);
        // end KEY_USER_RE_PASSWORD

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_NAME");
        this.updateNewProp("name", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NAME

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_NICKNAME");
        this.updateNewProp("nickname", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NICKNAME

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_THUMBNAIL");
        this.updateNewProp("thumbnail", myEvent.value);
        // end if - ON CHANGE - KEY_USER_THUMBNAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
        this.updateNewMobileHead(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_HEAD

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
        this.updateNewMobileBody(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_BODY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
        this.updateNewMobileTail(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_TAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_YEAR");
        this.updateNewBirthYear(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_YEAR

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_MONTH");
        this.updateNewBirthMonth(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_MONTH

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewBirthDay(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_DAY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {

        if(this.isDebug()) console.log("my-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewProp("gender", myEvent.value);
        // end if - ON CHANGE - KEY_USER_GENDER

      } // end if - ON CHANGE
    
    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {

      this.myEventService.onChangeNotValid(myEvent);

    } // end if


  } // end method

  private updateNewMobileHead(newMobileHead:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewMobileHead / init");

    if(!this.mobileComponent.isOKHead(newMobileHead)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileHead / 중단 / newMobileHead is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameMobileHead(newMobileHead)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileHead / 중단 / newMobileHead is not changed!");
      return;
    }
    this.loginUserCopy.setMobileHead(newMobileHead);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }
  private updateNewMobileBody(newMobileBody:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewMobileBody / init");

    if(!this.mobileComponent.isOKBody(newMobileBody)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileBody / 중단 / newMobileBody is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameMobileBody(newMobileBody)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileBody / 중단 / newMobileBody is not changed!");
      return;
    }
    this.loginUserCopy.setMobileBody(newMobileBody);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }
  private updateNewMobileTail(newMobileTail:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewMobileTail / init");

    if(!this.mobileComponent.isOKTail(newMobileTail)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileTail / 중단 / newMobileTail is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameMobileTail(newMobileTail)) {
      if(this.isDebug()) console.log("my-info / updateNewMobileTail / 중단 / newMobileTail is not changed!");
      return;
    }
    this.loginUserCopy.setMobileTail(newMobileTail);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }

  private updateNewBirthYear(newBirthYear:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewBirthYear / init");

    if(!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthYear / 중단 / newBirthYear is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameBirthYear(newBirthYear)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthYear / 중단 / newBirthYear is not changed!");
      return;
    }
    this.loginUserCopy.setBirthYear(newBirthYear);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }
  private updateNewBirthMonth(newBirthMonth:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewBirthMonth / init");

    if(!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameBirthMonth(newBirthMonth)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
      return;
    }
    this.loginUserCopy.setBirthMonth(newBirthMonth);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }
  private updateNewBirthDay(newBirthDay:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewBirthDay / init");

    if(!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthDay / 중단 / newBirthDay is not valid!");
      return;
    }
    if(this.loginUserCopy.isSameBirthDay(newBirthDay)) {
      if(this.isDebug()) console.log("my-info / updateNewBirthDay / 중단 / newBirthDay is not changed!");
      return;
    }
    this.loginUserCopy.setBirthDay(newBirthDay);

    // 저장 버튼 노출
    this.isReadyToSave=true;
  }    


  private updateNewProp(key:string, newValue:string) :void {

    if(this.isDebug()) console.log("my-info / updateNewProp / init");

    if(null == key || "" == key) {
      if(this.isDebug()) console.log("my-info / updateNewProp / 중단 / key is not valid!");
      return;
    }
    if(null == this.loginUserCopy) {
      if(this.isDebug()) console.log("my-info / updateNewProp / 중단 / this.loginUserCopy is not valid!");
      return;
    }

    let valueFromDB:string = this.loginUser[key];
    if(valueFromDB !== newValue) {
      // 1-1. 변경된 값이라면 업데이트.
      if(null != this[key]) {
        this[key] = newValue;
      }
      // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
      if(null != this.loginUserCopy && null != this.loginUserCopy[key]) {
        this.loginUserCopy[key] = newValue;
        if(this.isDebug()) console.log("my-info / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
        if(this.isDebug()) console.log("my-info / updateNewProp / this.loginUserCopy : ",this.loginUserCopy);
      }
      // 저장 버튼을 노출합니다.
      this.isReadyToSave=true;
    } else {
      // 변경되지 않았습니다.
      if(this.checkUserInfoChanged()) {
        // 모든 다른 항목중에 변경된 것이 없다면, 
        // 저장 버튼을 비활성화 합니다.
        this.isReadyToSave=false;
      } // end if

    } // end if

  } // end method

  onClickSave(event) :void{

    if(this.isDebug()) console.log("my-info / onClickSave / init");

    let isReadyToSave:boolean = this.checkUserInfoChanged();
    if(this.isDebug()) console.log("my-info / onClickSave / isReadyToSave : ",isReadyToSave);
    if(this.isDebug()) console.log("my-info / onClickSave / this.loginUserCopy : ",this.loginUserCopy);
    if(isReadyToSave) {
      // 변경되었다면 저장합니다.
      this.userService.updateUserByUser(
        this.watchTower.getApiKey(),
        this.loginUserCopy
      ).then((myResponse:MyResponse) => {

        if(this.isDebug()) console.log("my-info / onClickSave / 유저정보 업데이트 / myResponse : ",myResponse);

        let userUpdated = myResponse.digDataProp(["user"]);
        if(myResponse.isSuccess && null != userUpdated) {

          // 저장된 유저 정보를 다시 받아옵니다.
          // 받아온 유저 정보로 업데이트 합니다.
          this.loginUser.updateWithJSON(userUpdated);
          this.loginUserCopy = this.loginUser.copy();

          // 변경된 유저 정보를 전파.
          this.watchTower.announceLogin(this.loginUser);

          if(this.isDebug()) console.log("my-info / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
          if(this.isDebug()) console.log("my-info / onClickSave / this.loginUser : ",this.loginUser);
          if(this.isDebug()) console.log("my-info / onClickSave / this.loginUserCopy : ",this.loginUserCopy);

        } else {
          // 에러 로그 등록
          this.myLoggerService.logError(
            // apiKey:string
            this.watchTower.getApiKey(),
            // errorType:string
            this.myLoggerService.errorAPIFailed,
            // errorMsg:string
            `my-info / onClickSave / updateUserByUser / Failed! / ${this.loginUserCopy.id}`
          ); // end logger
        } // end if
      }); // end service
    }

    // 비밀번호 변경 여부 확인
    let isReadyToSavePassword:boolean = this.checkUserPasswordChanged();
    if(this.isDebug()) console.log("my-info / onClickSave / isReadyToSavePassword : ",isReadyToSavePassword);

    if(isReadyToSavePassword) {
      // 변경되었다면 업데이트!
      
      // 3. DB Update!
      this.userService.updatePassword(
        // apiKey:string
        this.watchTower.getApiKey(),
        // email:string 
        this.loginUserCopy.email,
        // password:string
        this.passwordNew
      ).then((myResponse:MyResponse) => {

        if(this.isDebug()) console.log("my-info / onClickSave / 비밀번호 업데이트 / myResponse : ",myResponse);
        let is_valid_password:boolean = myResponse.getDataProp("is_valid_password");
        if(myResponse.isSuccess && is_valid_password) {
          // 비밀번호 업데이트 성공!
          if(this.isDebug()) console.log("my-info / onClickSave / 비밀번호 업데이트 성공!");
        }

        // 입력한 모든 비밀번호를 초기화합니다.
        this.passwordsComponent.cleanPasswords();

      });
    }

    // 저장 버튼 비활성화.
    this.isReadyToSave=false;

  }

  // @ Desc : 필수 입력 항목이 문제 없는지 검사
  private isNotOKEssential() :boolean {
    return !this.isOKEssential();
  }
  private isOKEssential() :boolean {

    if(this.isDebug()) console.log("my-info / isOKEssential / init");

    if(this.nameComponent.isNotOK(this.loginUserCopy.name)) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.name is not valid!");
      return false;
    }
    if(this.nicknameComponent.isNotOK(this.loginUserCopy.nickname)) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.nickname is not valid!");
      return false;
    }
    if(this.mobileComponent.isNotOKHead(this.loginUserCopy.getMobileHead())) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.getMobileHead is not valid!");
      return false;
    }
    if(this.mobileComponent.isNotOKBody(this.loginUserCopy.getMobileBody())) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.getMobileBody is not valid!");
      return false;
    }
    if(this.mobileComponent.isNotOKTail(this.loginUserCopy.getMobileTail())) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.getMobileTail is not valid!");
      return false;
    }
    if(this.genderComponent.isNotOK(this.loginUserCopy.gender)) {
      if(this.isDebug()) console.log("my-info / isOKEssential / 중단 / this.loginUserCopy.gender is not valid!");
      return false;
    }

    return true;

  }

  private checkUserInfoChanged() :boolean {

    if(this.isDebug()) console.log("my-info / checkUserInfoChanged / init");
    if(this.isDebug()) console.log("my-info / checkUserInfoChanged / this.loginUser : ",this.loginUser);

    // 필수 항목들은 반드시 유효해야합니다.
    if(this.isNotOKEssential()) {
      if(this.isDebug()) console.log("my-info / checkUserInfoChanged / 중단 / this.isNotOKEssential()");
      return false;
    }

    // 검사 시작!
    if(this.loginUser.isNotSame(this.loginUserCopy)) {
      // 2. 유저정보
      if(this.isDebug()) console.log("my-info / checkUserInfoChanged / 유저정보 변경됨");
      return true;
    }
    return false;
  }

  private checkUserPasswordChanged() :boolean {

    if(this.isDebug()) console.log("my-info / checkUserPasswordChanged / init");

    let isReadyToSave:boolean = false;

    if( this.passwordsComponent.isOK(this.passwordNew) && 
        this.passwordCur !== this.passwordNew && 
        this.passwordNew === this.passwordRe) {

      // 7. password
      if(this.isDebug()) console.log("my-info / checkUserPasswordChanged / 비밀번호 변경됨.");
      isReadyToSave = true;

    } // end if

    return isReadyToSave;    
  }

}