import {  Component, 
          Input, 
          Output,
          ViewChild,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

import { MyLoggerService }      from '../util/service/my-logger.service';
import { MyCheckerService }     from '../util/service/my-checker.service';
import { MyEventService }       from '../util/service/my-event.service';
import { MyEvent }              from '../util/model/my-event';

import { MyEventWatchTowerService } from '../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'user-my',
  templateUrl: 'user-my.component.html',
  styleUrls: [ 'user-my.component.css' ]
})
export class UserMyComponent implements OnInit {

  constructor(  public myLoggerService: MyLoggerService,
                public myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private myEventWatchTowerService:MyEventWatchTowerService, 
                public router: Router) {}

  ngOnInit(): void {}
}
