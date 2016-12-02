import {  Component, 
          ViewChild,
          OnInit, 
          SimpleChanges,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';

@Component({
  moduleId: module.id,
  selector: 'my-info',
  templateUrl: 'my-info.component.html',
  styleUrls: [ 'my-info.component.css' ]
})
export class MyInfoComponent implements OnInit {

  @Input() myCheckerService:MyCheckerService;

  @Output() emitter = new EventEmitter<any>();

  constructor(public myEventService:MyEventService) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info-list / ngOnInit");

  }

  onChangedFromChild(myEvent:MyEvent, myinfo, myhistory, mypayment, myfavorite) {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info-list / onChangedFromChild / init");
    if(isDebug) console.log("my-info-list / onChangedFromChild / myEvent : ",myEvent);
    if(isDebug) console.log("my-info-list / onChangedFromChild / myEvent.key : ",myEvent.key);

  }

}