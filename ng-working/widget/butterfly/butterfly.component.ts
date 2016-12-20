import { Component, 
         OnInit, 
         Output,
         EventEmitter,          
         Input }   from '@angular/core';

import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyChecker }            from '../../util/model/my-checker';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';         

@Component({
  moduleId: module.id,
  selector: 'butterfly',
  templateUrl: 'butterfly.component.html',
  styleUrls: [ 'butterfly.component.css' ]
})
export class ButterflyComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();  

  @Input() title:string;
  @Input() text:string;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTitle:number=10;
  @Input() fontSizeText:number=12;
  @Input() paddingText:number=10;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  @Input() color:string;
  @Input() eventKey:string;

  priceWithFormat:string;

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService) {

  }

  ngOnInit(): void {
    // Do something.

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("butterfly / ngOnInit / 시작");
    

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    this.emitEventOnReady();

  }

  setText(text:string) :void {

    if(null == text || "" === text ) {
      return;
    }

    this.text = text;
  }

  private emitEventOnReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("butterfly / emitEventOnReady / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.eventKey,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("butterfly / emitEventOnReady / Done!");

  }    

}