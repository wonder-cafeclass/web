import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';

@Component({
  moduleId: module.id,
  selector: 'kakao-callback',
  templateUrl: 'kakao-callback.component.html',
  styleUrls: [ 'kakao-callback.component.css' ]
})
export class KakaoCallbackComponent implements OnInit {

  constructor(  public loginService: LoginService,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {
    // Do something...
  } // end function

} // end class