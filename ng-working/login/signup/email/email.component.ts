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

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  myChecker:MyChecker;

  constructor(private myCheckerService:MyCheckerService) {
    console.log("email/ myCheckerService : ",this.myCheckerService);

    // 서버에서 파라미터를 검증할 check 데이터를 받아옵니다.
    this.myCheckerService.getReady();    
  }

  ngOnInit(): void {}

  private setMyChecker() :void {
    console.log("setMyChecker / 1");
    if(null == this.myChecker) {
      console.log("setMyChecker / 2");
      this.myChecker = this.myCheckerService.getMyChecker("user_email");
      console.log("setMyChecker / 3 / this.myChecker : ",this.myChecker);
    }

  }

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if

    // Checker가 없다면, Checker를 가져옵니다.
    this.setMyChecker();

    // "regex_match[/^[a-zA-Z가-힣0-9]+$/]"

    // let myCheckerUserEmail:MyChecker = this.myCheckerService.getMyChecker("user_email");
  }

  onBlur(event, email) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if

    // 사용자가 입력한 이메일 주소를 검사합니다.
    if(!this.isOK(email)) {
      alert("이메일 주소를 다시 확인해주세요.");

      let lastHistory = this.myCheckerService.getLastHistory();
      console.log("email / onBlur / lastHistory : ",lastHistory);
    }
  } 

  isOK(email:string) :boolean {
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
