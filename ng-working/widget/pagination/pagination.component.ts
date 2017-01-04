import { Component, 
         OnInit, 
         Input, 
         Output, 
         EventEmitter }                from '@angular/core';

import { MyEventService }              from '../../util/service/my-event.service';
import { MyCheckerService }            from '../../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../../util/model/my-event';

import { Pagination }                  from './model/pagination';

/*
*
*	@ Desc : 페이지네이션 컴포넌트.
*	@ Author : Wonder Jung
*/

@Component({
  moduleId: module.id,
  selector: 'pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: [ 'pagination.component.css' ]
})
export class PaginationComponent implements OnInit {
  
  @Output() emitter = new EventEmitter<MyEvent>();
  @Input() eventKey:string = "";
  @Input() pagination:Pagination = null;

  constructor( private myCheckerService:MyCheckerService, 
               private watchTower:MyEventWatchTowerService) {
    
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }  

  ngOnInit():void {

    this.subscribeEventPack();

    if(this.isDebug()) console.log("pagination / ngOnInit / pagination : ",this.pagination);

  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("pagination / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("pagination / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("pagination / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method  

  init() :void {

    if(this.isDebug()) console.log("pagination / init / 시작");
    if(this.isDebug()) console.log("pagination / init / this.eventKey : ",this.eventKey);
    this.emitEventOnReady(this.eventKey);

  } // end method

  private emitEventOnReady(eventKey:string) :void {

    if(this.isDebug()) console.log("pagination / emitEventOnReady / 시작");
    if(this.isDebug()) console.log("pagination / emitEventOnReady / eventKey : ",eventKey);

    let myEvent:MyEvent =
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("pagination / emitEventOnReady / Done!");

  } // end method

  onClick(event, pageNumSelected:number) {

    event.preventDefault();
    event.stopPropagation();

    if(this.isDebug()) console.log("pagination / onClick / 시작");
    if(this.isDebug()) console.log("pagination / onClick / value : ",pageNumSelected);

    if(null == this.pagination) {
      if(this.isDebug()) console.log("pagination / onClick / 중단 / null == this.pagination");
      return;
    } // end if
    if(pageNumSelected === this.pagination.pageNum) {
      if(this.isDebug()) console.log("pagination / onClick / 중단 / pageNumSelected === this.pagination.pageNum");
      return;
    } // end if

    this.emitEventOnChange(""+pageNumSelected);

  } // end method

  private emitEventOnChange(value:string) :void {

    let myEvent:MyEvent =
    this.watchTower.getEventOnChange(
      // eventKey:string, 
      this.eventKey,
      // value:string, 
      value,
      // myChecker:MyChecker, 
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEvent);

  } // end method

}