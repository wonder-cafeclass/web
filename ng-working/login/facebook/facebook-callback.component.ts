import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';

@Component({
  moduleId: module.id,
  selector: 'facebook-callback',
  templateUrl: 'facebook-callback.component.html',
  styleUrls: [ 'facebook-callback.component.css' ]
})
export class FacebookCallbackComponent implements OnInit {

  constructor(  public loginService: LoginService,
                public router: Router) {

    // Do something...
  } // end function

  ngOnInit(): void {
    // Do something...
  } // end function

} // end class