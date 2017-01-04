import { Component, 
         OnInit, 
         Input, 
         Output, 
         EventEmitter }                from '@angular/core';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../../util/model/my-event';

/*
*
*	@ Desc : 하나의 체크박스만을 나타내는 컴포넌트. 컴포넌트 내부에서 다수의 checkbox 참조를 제어할 수 없어 만든 래핑 컴포넌트.
*	@ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'checkbox-single',
  templateUrl: 'checkbox.component.html',
  styleUrls: [ 'checkbox.component.css' ]
})
export class CheckBoxComponent implements OnInit {
  
  @Output() emitter = new EventEmitter<MyEvent>();
  @Input() eventKey:string = "";
  @Input() metaObj:any = null;
  isChecked:boolean = false;

  constructor( private myCheckerService:MyCheckerService, 
               private watchTower:MyEventWatchTowerService) {
    
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }  

  ngOnInit():void {

    this.subscribeEventPack();

  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("checkbox / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("checkbox / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("checkbox / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method  

  init() :void {

    if(this.isDebug()) console.log("checkbox / init / 시작");
    if(this.isDebug()) console.log("checkbox / init / this.eventKey : ",this.eventKey);
    this.emitEventOnReady(this.eventKey);

  }

  private emitEventOnReady(eventKey:string) :void {

    if(this.isDebug()) console.log("checkbox / emitEventOnReady / 시작");
    if(this.isDebug()) console.log("checkbox / emitEventOnReady / eventKey : ",eventKey);

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("checkbox / emitEventOnReady / Done!");

  } 

  onChange(event, value) {

    event.preventDefault();
    event.stopPropagation();

    if(this.isDebug()) console.log("checkbox / onChange / 시작");
    if(this.isDebug()) console.log("checkbox / onChange / value : ",value);

    this.isChecked = value;
    this.emitEventOnChange(value);

  }

  getIsChecked():boolean {
    return this.isChecked;
  }

  setIsChecked(isChecked:boolean):void{

    if(this.isDebug()) console.log("checkbox / onChange / 시작");

    if(this.isChecked != isChecked) {
      this.isChecked = isChecked;
    }

    if(this.isDebug()) console.log("checkbox / onChange / isChecked : ",this.isChecked);
  }

  private emitEventOnChange(value:string) :void {

    let myEvent:MyEvent =
    this.watchTower.getEventOnChangeMeta(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // myChecker:MyChecker, 
      this.myCheckerService.getFreePassChecker(),
      // meta:any
      this.metaObj
    );
    this.emitter.emit(myEvent);

  }

}