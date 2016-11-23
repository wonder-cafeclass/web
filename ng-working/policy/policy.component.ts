import {  Component, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { MyLoggerService }      from '../util/service/my-logger.service';


@Component({
  moduleId: module.id,
  selector: 'policy',
  templateUrl: 'policy.component.html',
  styleUrls: [ 'policy.component.css' ]
})
export class PolicyComponent implements OnInit {

  constructor(  public router: Router,
                public myLoggerService: MyLoggerService  ) {}

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeyPolicy);

  }
  
}
