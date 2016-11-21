import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';

@Component({
  moduleId: module.id,
  selector: 'email',
  templateUrl: 'email.component.html',
  styleUrls: [ 'email.component.css' ]
})
export class EmailComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Input() topWarning:number=-1;
  @Input() leftWarning:number=-1;

  @Input() myCheckerService:MyCheckerService = null;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isWarning:boolean=false;

  myChecker:MyChecker;

  isSuccessInput:boolean=false;
  tooltipMsg:string="";
  tooltipMsgEmailNotValid:string="이메일 주소를 다시 확인해주세요.";
  tooltipMsgEmailValid:string="성공! 이메일 주소가 완벽해요.";

  constructor() {}

  ngOnInit(): void {}

  private setMyChecker() :void {

    if(null == this.myCheckerService) {
      return;
    }

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_email");
    }
    
  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();
  }

  private lockFocus;
  onBlur(event, email, element) :void {
    event.stopPropagation();
    event.preventDefault();

    if(null == this.myCheckerService) {
      return;
    }

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    // 이메일 주소가 입력된 경우에만 검사를 진행합니다.
    if(null != email && "" != email) {
      // 1. 사용자가 입력한 이메일 주소를 검사합니다.
      let isOK:boolean = this.isOK(email);
      if(!isOK) {
        // 1-1-1. 이메일 주소에 문제가 있습니다!
        let lastHistory = this.myCheckerService.getLastHistory();
        console.log("email / onBlur / lastHistory : ",lastHistory);

        this.isWarning = true;

        if(null == this.lockFocus) {
          this.lockFocus = {};
          element.focus();
        } // end if

        // 1-1-2. 경고 메시지를 노출합니다.
        this.tooltipMsg = this.tooltipMsgEmailNotValid;
        this.isSuccessInput = false;

      } else {
        // 1-2-1. 정상적인 이메일 주소를 등록했습니다.
        this.isWarning = false;

        // 1-1-2. 성공 메시지를 노출합니다.
        this.tooltipMsg = this.tooltipMsgEmailValid;
        this.isSuccessInput = true;

        let _self = this;
        setTimeout(function() {
          // 성공 안내메시지를 3초 뒤에 화면에서 지웁니다.
          _self.tooltipMsg = null;
          _self.isSuccessInput = false;
        }, 2500);


      } // end if
    } // end if

  } 

  onFocus(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
    
    // release lock
    this.lockFocus = null;
  }  

  isOK(email:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, email);
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

}
