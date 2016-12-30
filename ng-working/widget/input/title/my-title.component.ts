import {  Component, 
          Input }                   from '@angular/core';

import { MyCheckerService }         from '../../../util/service/my-checker.service';
import { MyChecker }                from '../../../util/model/my-checker';
import { MyEventService }           from '../../../util/service/my-event.service';
import { MyEvent }                  from '../../../util/model/my-event';

import { MyEventWatchTowerService } from '../../../util/service/my-event-watchtower.service';


@Component({
  moduleId: module.id,
  selector: 'my-title',
  templateUrl: 'my-title.component.html',
  styleUrls: [ 'my-title.component.css' ]
})
export class MyTitleComponent {

  // @ Common Props
  @Input() title:string="";
  @Input() desc:string="";

  constructor(  private watchTower:MyEventWatchTowerService  ) {} // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

} // end class
