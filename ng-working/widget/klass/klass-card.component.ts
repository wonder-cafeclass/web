import {  Component, 
          Input, 
          Output,
          EventEmitter,          
          OnInit }           from '@angular/core';

import { MyEvent }                  from '../../util/model/my-event';
import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';
import { Klass }                    from '../../klass/model/klass';


@Component({
  moduleId: module.id,
  selector: 'klass-card',
  templateUrl: 'klass-card.component.html',
  styleUrls: [ 'klass-card.component.css' ]
})
export class KlassCardComponent implements OnInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  // @ User Custom
  @Input() eventKey:string;
  @Input() klass:Klass;
  @Input() size:string="default";
  @Input() isSmall:boolean=false;
  @Input() width:number=-1;
  widthStr:string="";

  constructor(private watchTower:MyEventWatchTowerService) {

    // Do something...

  } // end constructor

  private isDebug():boolean {
    return this.watchTower.isDebug();
  } // end method

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-card / ngOnInit / init");
    if(this.isDebug()) console.log("klass-card / ngOnInit / this.width : ",this.width);

    if(0 < this.width) {
      this.widthStr = this.width + "px";
    } else {
      this.widthStr = "100%";
    }

    this.asyncViewPack();

  }

  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-card / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-card / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-card / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-card / init / 시작");

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  }

  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-card / emitEventOnReady / 시작");

    let myEvent:MyEvent = 
    this.watchTower.getEventOnReady(
      // eventKey:string, 
      this.eventKey,
      // component
      this
    );
    this.emitter.emit(myEvent);

    if(this.isDebug()) console.log("klass-card / emitEventOnReady / Done!");

  } 

} // end class

// TODO - Dirty word list 검수 과정 필요!