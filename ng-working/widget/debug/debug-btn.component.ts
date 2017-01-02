import {  Component, 
          Input, 
          Output,
          EventEmitter }            from '@angular/core';

import { MyEvent }                  from '../../util/model/my-event';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { ImageService }             from '../../util/image.service';

@Component({
  moduleId: module.id,
  selector: 'debug-btn',
  templateUrl: 'debug-btn.component.html',
  styleUrls: [ 'debug-btn.component.css' ]
})
export class DebugBtnComponent {

  // @ Common Props
  @Input() eventKey:string="";
  @Output() emitter = new EventEmitter<MyEvent>();

  isDebugging:boolean = false;

  constructor(  public imageService:ImageService,
                private watchTower:MyEventWatchTowerService) {

    if(this.isDebug()) console.log("DebugBtn / constructor / init");
    this.asyncViewPack();

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("DebugBtn / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsEventPackReady()) {
      if(this.isDebug()) console.log("DebugBtn / asyncViewPack / getIsEventPackReady : ",this.watchTower.getIsEventPackReady());
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isEventPackReady$.subscribe(
      (isEventPackReady:boolean) => {
      if(this.isDebug()) console.log("DebugBtn / asyncViewPack / subscribe / isEventPackReady : ",isEventPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("DebugBtn / init / 시작");

    // watchTower에 설정된 isDebug 값이 있다면 가져옵니다.
    this.isDebugging = this.watchTower.isDebug();

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  }

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("DebugBtn / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("DebugBtn / emitEventOnReady / Done!");

  }  

  private emitEventOnChange(value:string) :void {

    if(this.isDebug()) console.log("DebugBtn / emitEventOnChange / 시작");
    if(null == value) {
      if(this.isDebug()) console.log("DebugBtn / emitEventOnChange / 중단 / value is not valid!");
      return;
    }

    let myEvent:MyEvent = 
    this.watchTower.getEventOnChange(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // myChecker:MyChecker
      this.watchTower.getMyCheckerService().getFreePassChecker()
    );

    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("DebugBtn / emitEventOnChange / Done!");

  }  

  onToggleDebugging(event) :void {

    event.stopPropagation();
    event.preventDefault();

    if(this.isDebug()) console.log(`DebugBtn / onToggleDebugging / 시작`);

    this.isDebugging = !this.isDebugging;

    if(this.isDebug()) console.log(`DebugBtn / onToggleDebugging / this.isDebugging : ${this.isDebugging}`);

    this.watchTower.announceIsDebugging(this.isDebugging);

  } // end method

} // end class
