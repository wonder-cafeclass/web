import {  Component, 
          ViewChild,
          OnInit, 
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../util/service/my-event.service';
import { MyEvent }                    from '../util/model/my-event';

import { MyCheckerService }           from '../util/service/my-checker.service';
import { MyChecker }                  from '../util/model/my-checker';

import { KlassColorService }          from '../klass/service/klass-color.service';
import { KlassRadioBtnService }       from '../klass/service/klass-radiobtn.service';

import { RadioBtnOption }             from '../widget/radiobtn/model/radiobtn-option';

@Component({
  moduleId: module.id,
  selector: 'user-my-nav-list',
  templateUrl: 'user-my-nav-list.component.html',
  styleUrls: [ 'user-my-nav-list.component.css' ]
})
export class UserMyNavListComponent implements OnInit {

  navTabsOptions:RadioBtnOption[];

  colorWhite:string;
  colorOrange:string;
  colorGray:string;

  showMyInfo:boolean=false;
  showMyHistory:boolean=false;
  showMyPayment:boolean=false;
  showMyFavorite:boolean=false;

  @Output() emitter = new EventEmitter<any>();

  constructor(  private klassColorService:KlassColorService,
                public myEventService:MyEventService, 
                private radiobtnService:KlassRadioBtnService,
                public myCheckerService:MyCheckerService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / ngOnInit");


    // COLOR
    this.colorWhite = this.klassColorService.white;
    this.colorOrange = this.klassColorService.orange;
    this.colorGray = this.klassColorService.gray;

    if(isDebug) console.log("user-my-nav-list / this.colorWhite : ",this.colorWhite);
    if(isDebug) console.log("user-my-nav-list / this.colorOrange : ",this.colorOrange);
    if(isDebug) console.log("user-my-nav-list / this.colorGray : ",this.colorGray);

    this.navTabsOptions = 
    this.radiobtnService.getNavTabsUserMyInfo(
      // user:User
      null
      // keyFocus:string
      , null
    );
    this.showMyInfo = true;

    if(isDebug) console.log("user-my-nav-list / this.navTabsOptions : ",this.navTabsOptions);

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / init");
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("user-my-nav-list / onChangedFromChild / myEvent.key : ",myEvent.key);

    // 모든 플래그값을 초기화
    this.showMyInfo = false;
    this.showMyHistory = false;
    this.showMyPayment = false;
    this.showMyFavorite = false;

    if(this.myEventService.KEY_USER_MY_INFO === myEvent.key) {
      this.showMyInfo = true;
    } else if(this.myEventService.KEY_USER_MY_HISTORY === myEvent.key) {
      this.showMyHistory = true;
    } else if(this.myEventService.KEY_USER_MY_PAYMENT === myEvent.key) {
      this.showMyPayment = true;
    } else if(this.myEventService.KEY_USER_MY_FAVORITE === myEvent.key) {
      this.showMyFavorite = true;
    }

  }

}