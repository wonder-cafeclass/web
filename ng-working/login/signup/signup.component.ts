import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: [ 'signup.component.css' ]
})
export class SignupComponent implements OnInit {

  constructor(  private loginService: LoginService, 
                private myLoggerService: MyLoggerService,
                public router: Router) {

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);    

  }
  
}
