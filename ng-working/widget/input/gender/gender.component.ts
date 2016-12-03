import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { MyLoggerService }      from '../../../util/service/my-logger.service';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'gender',
  templateUrl: 'gender.component.html',
  styleUrls: [ 'gender.component.css' ]
})
export class GenderComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() gender:string="";

  @Input() myCheckerService:MyCheckerService = null;

  @Output() emitter = new EventEmitter<MyEvent>();

  tooltipMsgGenderNotValid:string="앗! 성별이 필요합니다.";
  tooltipMsg:string;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isSuccessInput:boolean=false;

  keyFemale:string="F";
  keyMale:string="M";
  keyNoGender:string="U";

  isShowPopover:boolean=false;

  myChecker:MyChecker;

  constructor(  private myLoggerService:MyLoggerService, 
                private myEventService:MyEventService) {}

  ngOnInit(): void {}

  private setMyChecker() :void {
    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_gender");
    }
  }
  isOK(input:string) :boolean {

    this.setMyChecker();

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  } 
  setGender(gender:string) :void {
    if(this.isOK(gender)) {
      this.gender = gender;
    }
  }

  // @ Desc : 이메일이 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {
    return this.isOK(this.gender);
  }
  // @ Desc : 이메일 입력을 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    this.isSuccessInput = false;
    this.tooltipMsg = this.tooltipMsgGenderNotValid;
  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    this.setMyChecker();
  } 

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  }  

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  private emitGenderSelected(gender:string) :void {

    if(this.keyFemale != gender && this.keyMale != gender) {
      return;
    }

    // 부모 객체에게 Change Event 발송 
    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.myEventService.KEY_USER_GENDER,
      // public value:string
      gender,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

  }

  onClickGenderFemale(event) :void {
    
    event.stopPropagation();
    event.preventDefault();

    this.setMyChecker();

    if(this.gender === this.keyMale) {
      this.gender = this.keyMale;
    }

    this.emitGenderSelected(this.keyFemale);

    this.tooltipMsg = null;
  }

  onClickGenderMale(event) :void {

    event.stopPropagation();
    event.preventDefault();

    this.setMyChecker();

    if(this.gender === this.keyFemale) {
      this.gender = this.keyFemale;
    }

    this.emitGenderSelected(this.keyMale);

    this.tooltipMsg = null;
  }   

}
