import {  Component, 
          OnInit }                    from '@angular/core';
import { Router }                     from '@angular/router';

import { MyLoggerService }            from '../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../util/service/my-event-watchtower.service';


@Component({
  moduleId: module.id,
  selector: 'policy',
  templateUrl: 'policy.component.html',
  styleUrls: [ 'policy.component.css' ]
})
export class PolicyComponent implements OnInit {

  constructor(  private router: Router,
                private myEventWatchTowerService:MyEventWatchTowerService,
                private myLoggerService: MyLoggerService  ) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("policy / ngOnInit / 시작");

    // my-checker.service의 apikey 가져옴. 
    this.myEventWatchTowerService.myCheckerServicePackReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("policy / ngOnInit / isReady : ",isReady);

      if(!isReady) {
        return;
      }

      this.logActionPage();
    }); 

  }

  logActionPage() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("policy / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.myEventWatchTowerService.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypePolicy
    ).then(result => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("policy / logActionPage / result : ",result);
    })
  }
  
}
