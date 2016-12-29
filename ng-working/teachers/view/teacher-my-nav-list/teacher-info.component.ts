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

import { TeacherService }             from '../../service/teacher.service';
import { Teacher }                    from '../../model/teacher';

@Component({
  moduleId: module.id,
  selector: 'teacher-info',
  templateUrl: 'teacher-info.component.html',
  styleUrls: [ 'teacher-info.component.css' ]
})
export class TeacherInfoComponent implements AfterViewInit {

  @Output() emitter = new EventEmitter<any>();

  loginTeacher:Teacher;
  loginTeacherCopy:Teacher;

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

  isAdmin:boolean=false;

  // @ Desc : 사용자가 자신의 유저 정보를 변경했는지 확인하는 플래그
  isReadyToSave:boolean=false;

  constructor(public myEventService:MyEventService,
              private myLoggerService:MyLoggerService,
              public myCheckerService:MyCheckerService,
              private teacherService:TeacherService,
              private watchTower:MyEventWatchTowerService,
              public router:Router) {

    this.defaultMetaList = this.myEventService.getDefaultMetaListTeacherInfo();

  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("teacher-info / ngAfterViewInit");

    // REMOVE ME
    // this.setDefaultComponents();

    this.asyncViewPack();
  }

  /*
  private setDefaultComponents() :void {

    if(this.isDebug()) console.log("teacher-info / setDefaultComponents / 시작");

    // DefaultComponent들을 세팅
    this.emailComponent = this.getInput(this.myEventService.KEY_USER_EMAIL);
    this.nameComponent = this.getInput(this.myEventService.KEY_USER_NAME);
    this.nicknameComponent = this.getInput(this.myEventService.KEY_USER_NICKNAME);
    this.resumeComponent = this.getInput(this.myEventService.KEY_TEACHER_RESUME);
    this.greetingComponent = this.getInput(this.myEventService.KEY_TEACHER_GREETING);

  }
  */
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("teacher-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("teacher-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("teacher-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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
  private setLoginTeacher() :void {

    if(this.isDebug()) console.log("teacher-info / setLoginTeacher / 시작");

    // 로그인 데이터를 가져옵니다.
    let loginTeacher:Teacher = this.watchTower.getLoginTeacher();
    if(null != loginTeacher) {
      this.loginTeacher = loginTeacher;
      this.loginTeacherCopy = this.loginTeacher.copy();
      this.fillViewTeacherInfo();
    } else {
      // 선생님 로그인 데이터를 가져오지 못한다면, 홈으로 이동합니다.
      this.router.navigate(['/']);
    } // end if

  }

  // @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
  /*
  private getInput(eventKey:string) :any {

    if(this.isDebug()) console.log("teacher-info / getInput / init");

    let target:DefaultComponent = null;

    this.inputComponentList.forEach(function(inputComponent) {

      if(this.isDebug()) console.log("teacher-info / getInput / eventKey : ",eventKey);
      if(this.isDebug()) console.log("teacher-info / getInput / inputComponent.getEventKey() : ",inputComponent.getEventKey());

      if(inputComponent.hasEventKey(eventKey)) {
        if(this.isDebug()) console.log("teacher-info / getInput / inputComponent : ",inputComponent);
        target = inputComponent;
        return;
      }

    }); // end for-each

    return target;
  }
  */

  private logActionPage() :void {

    if(this.isDebug()) console.log("teacher-info / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeTeacherInfo
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("teacher-info / logActionPage / myResponse : ",myResponse);
    }) // end service

  }  

  private init() :void {

    if(this.isDebug()) console.log("teacher-info / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginTeacher();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

  }  

  private fillViewTeacherInfo() :void {

    if(this.isDebug()) console.log("teacher-info / fillViewTeacherInfo");
    if(this.isDebug()) console.log("teacher-info / fillViewTeacherInfo / this.loginTeacher : ",this.loginTeacher);

    if(null == this.loginTeacher) {
      if(this.isDebug()) console.log("teacher-info / fillViewTeacherInfo / 중단 / this.loginTeacher is not valid!");
      return;
    }

    this.emailComponent.setInput(this.loginTeacherCopy.email);
    this.nameComponent.setInput(this.loginTeacherCopy.name);
    this.nicknameComponent.setInput(this.loginTeacherCopy.nickname);
    this.resumeComponent.setInput(this.loginTeacherCopy.resume);
    this.greetingComponent.setInput(this.loginTeacherCopy.greeting);
    this.profileImgUploadComponent.setProfileImg(this.loginTeacherCopy.thumbnail);
    this.mobileComponent.setMobileHead(this.loginTeacherCopy.getMobileHead());
    this.mobileComponent.setMobileBody(this.loginTeacherCopy.getMobileBody());
    this.mobileComponent.setMobileTail(this.loginTeacherCopy.getMobileTail());
    this.genderComponent.setGender(this.loginTeacherCopy.gender);
    this.birthdayComponent.setBirthYear(this.loginTeacherCopy.getBirthYear());
    this.birthdayComponent.setBirthMonth(this.loginTeacherCopy.getBirthMonth());
    this.birthdayComponent.setBirthDay(this.loginTeacherCopy.getBirthMonth(), this.loginTeacherCopy.getBirthDay());

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    if(this.isDebug()) console.log("teacher-info / onChangedFromChild / init");
    if(this.isDebug()) console.log("teacher-info / onChangedFromChild / myEvent : ",myEvent);
    if(this.isDebug()) console.log("teacher-info / onChangedFromChild / myEvent.key : ",myEvent.key);

    if(myEvent.isNotValid()) {
      if(this.isDebug()) console.log("teacher-info / onChangedFromChild / ON_CHANGE_NOT_VALID / 중단 / myEvent.isNotValid()");
      // TODO - Error Logger
      return;
    }

    if(this.myCheckerService.isOK(myEvent.myChecker, myEvent.value)) {
      if(this.isDebug()) console.log("teacher-info / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      return;
    }

    if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_USER_NAME)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_NAME");
        // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("name", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NAME

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_NICKNAME)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_NICKNAME");
        // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("nickname", myEvent.value);
        // end if - ON CHANGE - KEY_USER_NICKNAME

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_RESUME)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_TEACHER_RESUME");
        // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("resume", myEvent.value);
        // end if - ON CHANGE - KEY_TEACHER_RESUME

      } else if(myEvent.hasKey(this.myEventService.KEY_TEACHER_GREETING)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_TEACHER_GREETING");
        // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("greeting", myEvent.value);
        // end if - ON CHANGE - KEY_TEACHER_GREETING        

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_THUMBNAIL)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_THUMBNAIL");
        // 1. loginTeacher객체와 비교, 변경된 이름인지 확인합니다.
        this.updateNewProp("thumbnail", myEvent.value);
        // end if - ON CHANGE - KEY_USER_THUMBNAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_HEAD)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_HEAD");
        // 1. loginTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileHead(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_HEAD

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_BODY)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_BODY");
        // 1. loginTeacher객체와 비교, 변경된 전화번호 첫 3자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileBody(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_BODY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_MOBILE_NUM_TAIL)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_MOBILE_NUM_TAIL");
        // 1. loginTeacher객체와 비교, 변경된 전화번호 마지막 4자리 인지 확인합니다.
        // 새로운 전화번호라면 변수에 저장합니다.
        this.updateNewMobileTail(myEvent.value);
        // end if - ON CHANGE - KEY_USER_MOBILE_NUM_TAIL

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_YEAR)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_YEAR");
        this.updateNewBirthYear(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_YEAR

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_MONTH)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_MONTH");
        this.updateNewBirthMonth(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_MONTH

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_BIRTH_DAY)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewBirthDay(myEvent.value);
        // end if - ON CHANGE - KEY_USER_BIRTH_DAY

      } else if(myEvent.hasKey(this.myEventService.KEY_USER_GENDER)) {

        if(this.isDebug()) console.log("teacher-info / onChangedFromChild / KEY_USER_BIRTH_DAY");
        this.updateNewProp("gender", myEvent.value);
        // end if - ON CHANGE - KEY_USER_GENDER

      } // end if - ON CHANGE
    
    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE_NOT_VALID)) {

      this.myEventService.onChangeNotValid(myEvent);

      // 필드값 중 하나라도 유효하지 않다면, 저장 버튼을 동작하지 않게 합니다.
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

    if(this.isDebug()) console.log("teacher-info / updateNewMobileHead / init");

    if(!this.mobileComponent.isOKHead(newMobileHead)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileHead / 중단 / newMobileHead is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameMobileHead(newMobileHead)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileHead / 중단 / newMobileHead is not changed!");
      return;
    }
    this.loginTeacherCopy.setMobileHead(newMobileHead);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }
  }
  private updateNewMobileBody(newMobileBody:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewMobileBody / init");

    if(!this.mobileComponent.isOKBody(newMobileBody)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileBody / 중단 / newMobileBody is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameMobileBody(newMobileBody)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileBody / 중단 / newMobileBody is not changed!");
      return;
    }
    this.loginTeacherCopy.setMobileBody(newMobileBody);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }    
  }
  private updateNewMobileTail(newMobileTail:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewMobileTail / init");

    if(!this.mobileComponent.isOKTail(newMobileTail)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileTail / 중단 / newMobileTail is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameMobileTail(newMobileTail)) {
      if(this.isDebug()) console.log("teacher-info / updateNewMobileTail / 중단 / newMobileTail is not changed!");
      return;
    }
    this.loginTeacherCopy.setMobileBody(newMobileTail);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }
  }

  private updateNewBirthYear(newBirthYear:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewBirthYear / init");

    if(!this.birthdayComponent.isOKBirthYear(newBirthYear)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthYear / 중단 / newBirthYear is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameBirthYear(newBirthYear)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthYear / 중단 / newBirthYear is not changed!");
      return;
    }
    this.loginTeacherCopy.setBirthYear(newBirthYear);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }
  }
  private updateNewBirthMonth(newBirthMonth:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewBirthMonth / init");

    if(!this.birthdayComponent.isOKBirthMonth(newBirthMonth)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthMonth / 중단 / newBirthMonth is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameBirthMonth(newBirthMonth)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthMonth / 중단 / newBirthMonth is not changed!");
      return;
    }
    this.loginTeacherCopy.setBirthMonth(newBirthMonth);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }
  }
  private updateNewBirthDay(newBirthDay:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewBirthDay / init");

    if(!this.birthdayComponent.isOKBirthDay(newBirthDay)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthDay / 중단 / newBirthDay is not valid!");
      return;
    }
    if(this.loginTeacherCopy.isSameBirthDay(newBirthDay)) {
      if(this.isDebug()) console.log("teacher-info / updateNewBirthDay / 중단 / newBirthDay is not changed!");
      return;
    }
    this.loginTeacherCopy.setBirthDay(newBirthDay);

    if(this.isOKAll()) {
      // 저장 버튼 노출
      this.isReadyToSave=true;
    }
  }    


  private updateNewProp(key:string, newValue:string) :void {

    if(this.isDebug()) console.log("teacher-info / updateNewProp / init");

    if(null == key || "" == key) {
      if(this.isDebug()) console.log("teacher-info / updateNewProp / 중단 / key is not valid!");
      return;
    }
    if(null == this.loginTeacherCopy) {
      if(this.isDebug()) console.log("teacher-info / updateNewProp / 중단 / this.loginTeacherCopy is not valid!");
      return;
    }

    let valueFromDB:string = this.loginTeacher[key];
    if(valueFromDB !== newValue) {
      // 1-1. 변경된 값이라면 업데이트.
      if(null != this[key]) {
        this[key] = newValue;
      }
      // 변경된 이름을 복사해둔 loginTeacherCopy에 저장합니다.
      if(null != this.loginTeacherCopy && null != this.loginTeacherCopy[key]) {
        this.loginTeacherCopy[key] = newValue;
        if(this.isDebug()) console.log("teacher-info / updateNewProp / 변경된 이름을 복사해둔 loginTeacherCopy에 저장합니다.");
        if(this.isDebug()) console.log("teacher-info / updateNewProp / this.loginTeacherCopy : ",this.loginTeacherCopy);
      }
      if(this.isDebug()) console.log("teacher-info / updateNewProp / 저장 버튼을 노출합니다.");
      this.isReadyToSave=true;
    } else {
      if(this.checkHasNotChanged()) {
        if(this.isDebug()) console.log("teacher-info / updateNewProp / 모든 다른 항목중에 변경된 것이 없다면, 저장 버튼을 비활성화 합니다.");
        this.isReadyToSave=false;
      } // end if
    } // end if

  } // end method

  onClickSave(event) :void{

    if(this.isDebug()) console.log("teacher-info / onClickSave / init");

    let isReadyToSave:boolean = this.checkHasChanged();
    if(this.isDebug()) console.log("teacher-info / onClickSave / isReadyToSave : ",isReadyToSave);
    if(this.isDebug()) console.log("teacher-info / onClickSave / this.loginTeacherCopy : ",this.loginTeacherCopy);
    if(this.isReadyToSave) {
      // 변경되었다면 저장합니다.
      this.teacherService.updateTeacherByTeacher(
        this.watchTower.getApiKey(),
        this.loginTeacherCopy
      ).then((myResponse:MyResponse) => {

        if(this.isDebug()) console.log("teacher-info / onClickSave / 유저정보 업데이트 / myResponse : ",myResponse);

        let teacherUpdated = myResponse.digDataProp(["teacher"]);
        if(myResponse.isSuccess && null != teacherUpdated) {

          // 저장된 유저 정보를 다시 받아옵니다.
          // 받아온 유저 정보로 업데이트 합니다.
          this.loginTeacher.setJSON(teacherUpdated);
          this.loginTeacherCopy = this.loginTeacher.copy();

          // 업데이트한 선생님 정보를 전파합니다.
          this.watchTower.announceLoginTeacher(this.loginTeacher);

          if(this.isDebug()) console.log("teacher-info / onClickSave / 받아온 유저 정보로 업데이트 합니다.");
          if(this.isDebug()) console.log("teacher-info / onClickSave / this.loginTeacher : ",this.loginTeacher);
          if(this.isDebug()) console.log("teacher-info / onClickSave / this.loginTeacherCopy : ",this.loginTeacherCopy);

        } else {
          // Error Report
          
        } // end if
      }); // end service
    }

    // 저장 버튼 비활성화.
    this.isReadyToSave=false;

  }

  private isNotOKAll() :boolean {
    return !this.isOKAll();
  }
  private isOKAll() :boolean {

    if(this.isDebug()) console.log("teacher-info / isOKAll / init");

    if(null == this.loginTeacherCopy) {
      return false;
    }

    if(this.nameComponent.isNotOK(this.loginTeacherCopy.name)) {
      return false;
    }
    if(this.nicknameComponent.isNotOK(this.loginTeacherCopy.nickname)) {
      return false;
    }
    if(this.resumeComponent.isNotOK(this.loginTeacherCopy.resume)) {
      return false;
    }
    if(this.greetingComponent.isNotOK(this.loginTeacherCopy.greeting)) {
      return false;
    }
    if(this.profileImgUploadComponent.isNotOK(this.loginTeacherCopy.nickname)) {
      return false;
    }
    if(this.mobileComponent.isNotOKHead(this.loginTeacherCopy.getMobileHead())) {
      return false; 
    }
    if(this.mobileComponent.isNotOKBody(this.loginTeacherCopy.getMobileBody())) {
      return false; 
    }
    if(this.mobileComponent.isNotOKTail(this.loginTeacherCopy.getMobileTail())) {
      return false; 
    }
    if(this.genderComponent.isNotOK(this.loginTeacherCopy.gender)) {
      return false;         
    }
    if(this.birthdayComponent.isNotOKBirthYear(this.loginTeacherCopy.getBirthYear())) {
      return false;         
    }
    if(this.birthdayComponent.isNotOKBirthMonth(this.loginTeacherCopy.getBirthMonth())) {
      return false;         
    }
    if(this.birthdayComponent.isNotOKBirthDay(this.loginTeacherCopy.getBirthDay())) {
      return false;         
    }

    return true;
  }

  private checkHasNotChanged() :boolean {
      return !this.checkHasChanged();
  }
  private checkHasChanged() :boolean {

    if(this.isDebug()) console.log("teacher-info / checkHasChanged / init");
    if(this.isDebug()) console.log("teacher-info / checkHasChanged / this.loginTeacher : ",this.loginTeacher);

    // 모든 입력이 정상적이어야 변화가 있었는지 검사할 수 있습니다.
    if(this.isNotOKAll()) {
      if(this.isDebug()) console.log("teacher-info / checkHasChanged / 중단 / 정상적이지 않은 값이 있습니다.");
      return false;
    } // end method

    if(this.loginTeacher.isNotSame(this.loginTeacherCopy)) {
      if(this.isDebug()) console.log("teacher-info / checkHasChanged / 변경됨");
      return true;
    } // end method

    return false;
  } // end method

}