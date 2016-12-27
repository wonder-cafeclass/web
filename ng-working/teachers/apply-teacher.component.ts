import {  Component, 
          Input, 
          Output,
          ViewChild,
          ViewChildren,
          QueryList,
          OnInit, 
          AfterViewInit }             from '@angular/core';
import {  Router }                    from '@angular/router';

import { LoginService }               from '../login/service/login.service';

import { UserService }                from '../users/service/user.service';
import { User }                       from '../users/model/user';

import { TeacherService }             from './service/teacher.service';
import { Teacher }                    from './model/teacher';

import { UrlService }                 from "../util/url.service";
import { MyLoggerService }            from '../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';
import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';
import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';
import { MyResponse }                 from '../util/model/my-response';

import { ProfileImgUploadComponent }  from '../widget/input/profile-img-upload/profile-img-upload.component';
import { MobileComponent }            from '../widget/input/mobile/mobile.component';
import { GenderComponent }            from '../widget/input/gender/gender.component';
import { BirthdayComponent }          from '../widget/input/birthday/birthday.component';
import { DefaultComponent }           from '../widget/input/default/default.component';
import { DefaultMeta }                from '../widget/input/default/model/default-meta';
import { DefaultService }             from '../widget/input/default/service/default.service';


@Component({
  moduleId: module.id,
  selector: 'apply-teacher',
  templateUrl: 'apply-teacher.component.html',
  styleUrls: [ 'apply-teacher.component.css' ]
})
export class ApplyTeacherComponent implements OnInit, AfterViewInit {

  private code:string;
  private redirectUrl:string="/class-center";

  private apiKey:string;
  isAdmin:boolean=false;

  private loginUser:User;
  private newTeacher:Teacher;
  private newTeacherCopy:Teacher;

  @ViewChildren(DefaultComponent) inputComponentList: QueryList<DefaultComponent>;
  defaultMetaList:DefaultMeta[];

  private emailComponent: DefaultComponent;
  private nameComponent: DefaultComponent;
  private nicknameComponent: DefaultComponent;
  private resumeComponent: DefaultComponent;
  private greetingComponent: DefaultComponent;

  @ViewChild(MobileComponent)
  private mobileComponent: MobileComponent;

  @ViewChild(GenderComponent)
  private genderComponent: GenderComponent;  

  @ViewChild(BirthdayComponent)
  private birthdayComponent: BirthdayComponent;  

  @ViewChild(ProfileImgUploadComponent)
  private profileImgUploadComponent: ProfileImgUploadComponent;  

  // @ Desc : 사용자가 자신의 선생님 정보를 변경했는지 확인하는 플래그
  isReadyToSave:boolean=false;

  constructor(  private loginService:LoginService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private userService:UserService,
                private teacherService:TeacherService,
                private myLoggerService:MyLoggerService,
                private myCheckerService:MyCheckerService,
                private urlService:UrlService,
                private defaultService:DefaultService,
                public router:Router) {

    // Default Input 셋을 가져옵니다. 이름/닉네임/이메일에 사용됩니다.
    this.defaultMetaList = this.myEventService.getDefaultMetaListApplyTeacher();

  } // end function

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / ngOnInit / 시작");

    // 선생님 등록화면에서는 상,하단 메뉴를 가립니다.
    this.watchTower.announceToggleTopMenu(false);

  } // end function

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / ngAfterViewInit");

    this.setDefaultComponents();

    this.asyncViewPack();

  }  

  private setDefaultComponents() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / setDefaultComponents / 시작");

    // DefaultComponent들을 세팅
    this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
    this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
    this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
    this.resumeComponent = this.getInput(this.myEventService.KEY_TEACHER_RESUME);
    this.greetingComponent = this.getInput(this.myEventService.KEY_TEACHER_GREETING);

  }  

  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다.
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("apply-teacher / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("apply-teacher / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      
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

  private copyTeacher() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / copyTeacher / 시작");

    if(null == this.loginUser) {
      // 유저가 없는 경우는 복사를 중단합니다.
      if(isDebug) console.log("apply-teacher / copyTeacher / 중단 / 유저가 없는 경우는 복사를 중단합니다.");
      return;
    }

    this.newTeacher = this.teacherService.getTeacherFromUser(this.loginUser);
    this.newTeacherCopy = this.newTeacher.copy();
    if(isDebug) console.log("apply-teacher / copyTeacher / this.newTeacherCopy : ",this.newTeacherCopy);

  }  

  private init(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();

    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();

    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

  } // end init

  private fillViewTeacherInfo() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo");
    if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / this.newTeacher : ",this.newTeacher);

    if(null == this.newTeacher) {
      if(isDebug) console.log("apply-teacher / fillViewTeacherInfo / 중단 / this.newTeacherCopy is not valid!");
      return;
    }

    this.emailComponent.setInput(this.newTeacherCopy.email);
    this.nameComponent.setInput(this.newTeacherCopy.name);
    this.nicknameComponent.setInput(this.newTeacherCopy.nickname);
    this.resumeComponent.setInput(this.newTeacherCopy.resume);
    this.greetingComponent.setInput(this.newTeacherCopy.greeting);
    this.profileImgUploadComponent.setProfileImg(this.newTeacherCopy.thumbnail);
    this.mobileComponent.setMobileHead(this.newTeacherCopy.getMobileHead());
    this.mobileComponent.setMobileBody(this.newTeacherCopy.getMobileBody());
    this.mobileComponent.setMobileTail(this.newTeacherCopy.getMobileTail());
    this.genderComponent.setGender(this.newTeacherCopy.gender);
    this.birthdayComponent.setBirthYear(this.newTeacherCopy.getBirthYear());
    this.birthdayComponent.setBirthMonth(this.newTeacherCopy.getBirthMonth());
    this.birthdayComponent.setBirthDay(this.newTeacherCopy.getBirthMonth(), this.newTeacherCopy.getBirthDay());

  }  

  private logActionPage() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeSignupTeacher
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("apply-teacher / logActionPage / myResponse : ",myResponse);
    })
  }

  private logError(errorType:string, errMsg:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / logError / 시작");

    if(null == errorType) {
      return;
    }
    if(null == errMsg) {
      return;
    }

    // 에러 로그 등록
    this.myLoggerService.logError(
      // apiKey:string
      this.watchTower.getApiKey(),
      // errorType:string
      errorType,
      // errorMsg:string
      errMsg
    ).then((myResponse:MyResponse) => {

      if(isDebug) console.log("apply-teacher / logError / myResponse : ",myResponse);

    }); // end logError

  }  

  private setLoginUser() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / setLoginUser / 시작");

    // 로그인 데이터를 가져옵니다.
    let loginUser:User = this.watchTower.getLoginUser();
    if(null != loginUser) {

      this.loginUser = loginUser;
      if(isDebug) console.log("apply-teacher / setLoginUser / this.loginUser : ",this.loginUser);

      // 가져온 유저 정보로 선생님 객체를 만듭니다.
      this.copyTeacher();

      // 가져온 유저 정보로 선생님 입력란을 채웁니다.
      this.fillViewTeacherInfo();

    } else {

      // 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.
      // 로그인 이후, 선생님 등록 페이지로 리다이렉트 데이터를 전달해야 합니다.

      if(isDebug) console.log("apply-teacher / setLoginUser / 로그인 데이터를 가져오지 못한다면, 로그인 페이지로 이동합니다.");

      let req_url = this.urlService.get('#/login?redirect=/applyteacher');
      if(isDebug) console.log("apply-teacher / setLoginUser / req_url : ",req_url);

      window.location.href = req_url;

    } // end if

  }

  // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
  private getInput(eventKey:string) :any {

    return this.defaultService.getInput(this.inputComponentList, eventKey);

  }  

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / onChangedFromChild / init");
    if(isDebug) console.log("apply-teacher / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("apply-teacher / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(myEvent.isNotValid()) {
      if(isDebug) console.log("apply-teacher / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // TODO - Error Logger
      return;
    }

    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("apply-teacher / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      return;
    }

    if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_EMAIL)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_EMAIL");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("email", myEvent.value);
        this.checkEmailUnique(myEvent.value);
        // end if - ON CHANGE - KEY_USER_EMAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_NAME");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("name", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NAME        

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_NICKNAME");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("nickname", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NICKNAME

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_RESUME)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_TEACHER_RESUME");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("resume", myEvent.value);
        // end if - ON CHANGE - KEY_TEACHER_RESUME 

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_TEACHER_GREETING");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("greeting", myEvent.value);
        // end if - ON CHANGE - KEY_TEACHER_GREETING                

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_THUMBNAIL");
        // 1. newTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("thumbnail", myEvent.value);
        // end if - ON CHANGE - KEY_USER_THUMBNAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
        // 1. newTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileHead(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_HEAD

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
        // 1. newTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileBody(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_BODY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
        // 1. newTeacher객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileTail(myEvent.value);
        this.checkMobileUnique(this.newTeacherCopy.mobile);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_TAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_YEAR");
        this.updateNewBirthYear(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_YEAR

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_MONTH");
        this.updateNewBirthMonth(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_MONTH

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewBirthDay(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_DAY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {

        if(isDebug) console.log("apply-teacher / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewProp("gender", myEvent.value);
        // end if - ON CHANGE - KEY_USER_GENDER

      } // end if - ON CHANGE
    
    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {

      this.myEventService.onChangeNotValid(myEvent);

      // 유효하지 않은 값이 들어왔습니다. 
      // 저장 버튼을 다시 비활성화합니다.
      this.isReadyToSave = false;

    } // end if


  } // end method

  private isOKBirthday(birthYear:string, birthMonth:string, birthDay:string):boolean {

    if(!this.birthdayComponent.isOKBirthYear(birthYear)) {
      return false;
    }
    if(!this.birthdayComponent.isOKBirthMonth(birthMonth)) {
      return false;
    }
    if(!this.birthdayComponent.isOKBirthDay(birthDay)) {
      return false;
    }
    return true;
  }
  private updateNewMobileHead(newMobileHead:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileHead / init");

    if(!this.mobileComponent.isOKHead(newMobileHead)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameMobileHead(newMobileHead)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileHead / 중단 / newMobileHead is not changed!");
      return;
    }
    this.newTeacherCopy.setMobileHead(newMobileHead);

    // 저장 버튼 노출
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }
  }
  private updateNewMobileBody(newMobileBody:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileBody / init");

    if(!this.mobileComponent.isOKBody(newMobileBody)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameMobileBody(newMobileBody)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileBody / 중단 / newMobileBody is not changed!");
      return;
    }
    this.newTeacherCopy.setMobileBody(newMobileBody);

    // 저장 버튼 노출
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }
  }
  private updateNewMobileTail(newMobileTail:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewMobileTail / init");

    if(!this.mobileComponent.isOKTail(newMobileTail)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameMobileTail(newMobileTail)) {
      if(isDebug) console.log("apply-teacher / updateNewMobileTail / 중단 / newMobileTail is not changed!");
      return;
    }
    this.newTeacherCopy.setMobileTail(newMobileTail);

    // 저장 버튼 노출
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }
  }

  private updateNewBirthYear(newBirthYear:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthYear / init");

    if(!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameBirthYear(newBirthYear)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthYear / 중단 / newBirthYear is not changed!");
      return;
    }
    this.newTeacherCopy.setBirthYear(newBirthYear);

    // 저장 버튼 노출
    // if(this.isOKBirthday(birthYear, birthMonth, birthDay) && this.isOKAll()) {
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }

  }
  private updateNewBirthMonth(newBirthMonth:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthMonth / init");

    if(!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameBirthMonth(newBirthMonth)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
      return;
    }
    this.newTeacherCopy.setBirthMonth(newBirthMonth);

    // 저장 버튼 노출
    // if(this.isOKBirthday(birthYear, birthMonth, birthDay) && this.isOKAll()) {
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }

  }
  private updateNewBirthDay(newBirthDay:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewBirthDay / init");

    if(!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not valid!");
      return;
    }
    if(this.newTeacherCopy.isSameBirthDay(newBirthDay)) {
      if(isDebug) console.log("apply-teacher / updateNewBirthDay / 중단 / newBirthDay is not changed!");
      return;
    }
    this.newTeacherCopy.setBirthDay(newBirthDay);

    // 저장 버튼 노출
    // if(this.isOKBirthday(birthYear, birthMonth, birthDay) && this.isOKAll()) {
    if(this.isOKAll(false)) {
      // 아래 플래그는 저장 버튼을 활성화합니다.
      // 모든 값들이 유효해야 변경된 것으로 처리.
      this.isReadyToSave=true;
    }
  }    


  private updateNewProp(key:string, newValue:string) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / updateNewProp / init");

    if(null == key || "" == key) {
      if(isDebug) console.log("apply-teacher / updateNewProp / 중단 / key is not valid!");
      return;
    }
    if(null == this.newTeacherCopy) {
      if(isDebug) console.log("apply-teacher / updateNewProp / 중단 / this.newTeacherCopy is not valid!");
      return;
    }

    let valueFromDB:string = this.newTeacher[key];
    if(valueFromDB !== newValue) {
      // 1-1. 변경된 값이라면 업데이트.
      if(null != this[key]) {
        this[key] = newValue;
      }
      // 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.
      if(null != this.newTeacherCopy && null != this.newTeacherCopy[key]) {
        this.newTeacherCopy[key] = newValue;
        if(isDebug) console.log("apply-teacher / updateNewProp / 변경된 이름을 복사해둔 loginUserCopy에 저장합니다.");
        if(isDebug) console.log("apply-teacher / updateNewProp / this.newTeacherCopy : ",this.newTeacherCopy);
      }

      // 저장 버튼 노출은 모든 값이 정상적인 경우에만 노출됩니다.
      this.isReadyToSave=this.isOKAll(false);

      if(isDebug) console.log("apply-teacher / updateNewProp / this.isReadyToSave : ",this.isReadyToSave);

    } else {
      // 변경되지 않았습니다.
      if(this.checkUserInfoChanged()) {
        // 모든 다른 항목중에 변경된 것이 없다면, 
        // 저장 버튼을 비활성화 합니다.
        this.isReadyToSave=false;
      } // end if

    } // end if

  } // end method

  isOKAll(showTooltip:boolean) :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / isOKAll / init");

    // 모든 값들을 검사. 
    // 문제가 있다면, 사용자에게 알림.

    if(null == this.newTeacherCopy) {
      return false;
    }

    let isOK:boolean = false;

    isOK = this.emailComponent.isOK(this.newTeacherCopy.email);
    if(!isOK) {

      if(showTooltip) {
        this.emailComponent.showTooltipFailWarning(
          // msg:string, 
          this.emailComponent.getErrorMsg(), 
          // isTimeout:Boolean
          false
        );
      }
      return false;
    }
    isOK = this.nameComponent.isOK(this.newTeacherCopy.name);
    if(!isOK) {

      if(showTooltip) {
        this.nameComponent.showTooltipFailWarning(
          // msg:string, 
          this.nameComponent.getErrorMsg(), 
          // isTimeout:Boolean
          false
        );
      }
      return false;
    }
    isOK = this.nicknameComponent.isOK(this.newTeacherCopy.nickname);
    if(!isOK) {

      if(showTooltip) {
        this.nicknameComponent.showTooltipFailWarning(
          // msg:string, 
          this.nicknameComponent.getErrorMsg(), 
          // isTimeout:Boolean
          false
        );
      }
      return false;
    }
    isOK = this.resumeComponent.isOK(this.newTeacherCopy.resume);
    if(!isOK) {

      if(showTooltip) {
        this.resumeComponent.showTooltipFailWarning(
          // msg:string, 
          this.resumeComponent.getErrorMsg(), 
          // isTimeout:Boolean
          false
        );      
      }
      return false;
    }
    isOK = this.greetingComponent.isOK(this.newTeacherCopy.greeting);
    if(!isOK) {

      if(showTooltip) {
        this.greetingComponent.showTooltipFailWarning(
          // msg:string, 
          this.greetingComponent.getErrorMsg(), 
          // isTimeout:Boolean
          false
        );
      }
      return false;
    }
    if(this.mobileComponent.hasNotDoneMobileHead()) {
      if(showTooltip) {
        this.mobileComponent.showWarningMobileHead();
      }
      return false;
    }
    if(this.mobileComponent.hasNotDoneMobileBody()) {
      if(showTooltip) {
        this.mobileComponent.showWarningMobileBody(null);
      }
      return false;
    }
    if(this.mobileComponent.hasNotDoneMobileTail()) {
      if(showTooltip) {
        this.mobileComponent.showWarningMobileTail();
      }
      return false;
    }
    isOK = this.genderComponent.isOK(this.newTeacherCopy.gender);
    if(!isOK) {
      if(showTooltip) {
        this.genderComponent.showWarning();
      }
      return false;
    }
    if(this.birthdayComponent.hasNotDoneBirthYear()) {
      if(showTooltip) {
        this.birthdayComponent.showWarningBirthYear();
      }
      return false;
    }
    if(this.birthdayComponent.hasNotDoneBirthMonth()) {
      if(showTooltip) {
        this.birthdayComponent.showWarningBirthMonth();
      }
      return false;
    }
    if(this.birthdayComponent.hasNotDoneBirthDay()) {
      if(showTooltip) {
        this.birthdayComponent.showWarningBirthDay();
      }
      return false;
    }

    // 기본 이미지나 샘플 이미지 주소여서는 안됩니다.
    if(this.newTeacherCopy.thumbnail === this.profileImgUploadComponent.userProfileDefaultUrl) {
      // 선생님은 기본이미지를 사용할 수 없습니다.
      if(showTooltip) {
        this.profileImgUploadComponent.showWarning("기본이미지를 사용할 수 없습니다");
      }
      return false; 
    }
    if(this.profileImgUploadComponent.hasNotDone()) {
      if(showTooltip) {
        this.profileImgUploadComponent.showWarning("이미지를 확인해주세요");
      }
      return false; 
    }

    return true;
  }

  onClickSave(event) :void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / onClickSave / init");

    // 모든 값들이 필수입니다.
    // 값에 문제가 없는지 확인합니다.
    if(!this.isOKAll(true)) {
      if(isDebug) console.log("apply-teacher / onClickSave / 중단 / 값에 문제가 있습니다.");
      return;
    }

    let isReadyToSave:boolean = this.checkUserInfoChanged();
    if(isDebug) console.log("apply-teacher / onClickSave / isReadyToSave : ",isReadyToSave);
    if(isDebug) console.log("apply-teacher / onClickSave / this.newTeacherCopy : ",this.newTeacherCopy);
    if(isReadyToSave) {

      // 변경되었다면 저장합니다.
      if(isDebug) console.log("apply-teacher / onClickSave / 변경되었다면 저장합니다.");

      this.teacherService.insertTeacherByTeacher(
        this.watchTower.getApiKey(),
        this.newTeacherCopy
      ).then((myResponse:MyResponse) => {

        if(isDebug) console.log("apply-teacher / onClickSave / myResponse : ",myResponse);

        let teacherJSON = myResponse.digDataProp(["teacher"]);
        if(myResponse.isSuccess() && null != teacherJSON) {

          // 저장완료!
          // 저장된 선생님 정보를 전파합니다.
          let teacher:Teacher = this.teacherService.getTeacherFromJSON(teacherJSON);
          this.watchTower.announceLoginTeacher(teacher);

          // 홈으로 리다이렉트 합니다.
          if(isDebug) console.log("apply-teacher / onClickSave / 저장완료! / 홈으로 리다이렉트 합니다.");
          this.router.navigate([this.redirectUrl]);

        } else if(myResponse.isFailed()) { 

          if(null != myResponse.error && "" != myResponse.error) {
            // 에러 내용은 화면에 표시한다.
            this.watchTower.announceErrorMsgArr([myResponse.error]);
          }

        } else {

          // TODO - Error Report
          if(isDebug) console.log("apply-teacher / onClickSave / Error Report");
          
        } // end if
      }); // end service

    }

    // 저장 버튼 비활성화.
    this.isReadyToSave=false;

  }

  private checkUserInfoChanged() :boolean {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / init");
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / this.newTeacher : ",this.newTeacher);
    if(isDebug) console.log("apply-teacher / checkUserInfoChanged / this.newTeacherCopy : ",this.newTeacherCopy);

    if(!this.isOKAll(true)) {
      // 유효하지 않은 값이 있으므로 변경되지 않았다고 처리합니다.
      return false;
    }

    return this.newTeacher.isNotSame(this.newTeacherCopy);
  }  

  private checkEmailUnique(email:string): void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / checkEmailUnique / 시작");

    if(null == email || "" === email) {
      if(isDebug) console.log("apply-teacher / checkEmailUnique / 중단 / email is not valid!");
      return;
    }

    // DB Unique test
    this.teacherService
    .getTeacherByEmail(this.watchTower.getApiKey(), email)
    .then((myResponse:MyResponse) => {

      if( myResponse.isSuccess() ) {

        let teacherJSON = myResponse.getDataProp("teacher");
        if(null != teacherJSON) {

          // 등록된 유저가 있습니다. 유저에게 경고 메시지를 보여줍니다.
          this.emailComponent.showTooltipFailWarning(
            // msg:string, 
            "이미 사용중인 이메일입니다", 
            // isTimeout:Boolean
            false
          );

        } else {

          // 해당 이메일로 등록된 유저는 없습니다. 
          // email 등록이 가능합니다.
          this.newTeacherCopy.email = email;
          if(isDebug) console.log("apply-teacher / checkEmailUnique / email 등록이 가능합니다.");
          if(isDebug) console.log("apply-teacher / checkEmailUnique / this.newTeacherCopy.email : ",this.newTeacherCopy.email);

        } // end if
        
      } else {

        if(isDebug) console.log("apply-teacher / checkMobileUnique / Error Report");
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `apply-teacher / checkEmailUnique / Failed!`
        );

      } // end if 

    }); // end service

  } // end method

  private checkMobileUnique(mobile:string): void{

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("apply-teacher / checkMobileUnique / 시작");

    if(null == mobile || "" === mobile) {
      return;
    }

    // 휴대전화 번호가 모두 확인되었습니다. 
    // DB Unique test
    this.teacherService
    .getTeacherByMobile(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // mobileHead:string, 
      this.newTeacherCopy.getMobileHead(),
      // mobileBody:string, 
      this.newTeacherCopy.getMobileBody(),
      // mobileTail:string
      this.newTeacherCopy.getMobileTail()
    )
    .then((myResponse:MyResponse) => {

      if( myResponse.isSuccess() ) {

        let teacherJSON = myResponse.getDataProp("teacher");
        if(null != teacherJSON) {

          this.mobileComponent.showWarningMobileBody("이미 등록된 번호입니다");

        } else {

          // 해당 전화번호로 등록된 유저는 없습니다. 
          if(isDebug) console.log("apply-teacher / checkMobileUnique / mobile 등록이 가능합니다.");
          if(isDebug) console.log("apply-teacher / checkMobileUnique / this.newTeacherCopy.mobile : ",this.newTeacherCopy.mobile);

          this.newTeacherCopy.mobile = mobile;

        } // end if
        
      } else {

        // TODO - Error Report
        if(isDebug) console.log("apply-teacher / checkMobileUnique / Error Report");
        this.myLoggerService.logError(
          // apiKey:string
          this.watchTower.getApiKey(),
          // errorType:string
          this.myLoggerService.errorAPIFailed,
          // errorMsg:string
          `apply-teacher / checkMobileUnique / Failed!`
        );

      } // end if
    }); // end service    

  } // end method  

} // end class