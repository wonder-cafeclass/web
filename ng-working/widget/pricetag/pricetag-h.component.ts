import { Component, 
         OnInit, 
         Output,
         EventEmitter,
         Input }                    from '@angular/core';

import { MyCheckerService }         from '../../util/service/my-checker.service';
import { MyChecker }                from '../../util/model/my-checker';
import { MyEventService }           from '../../util/service/my-event.service';
import { MyEvent }                  from '../../util/model/my-event';

import { MyEventWatchTowerService } from '../../util/service/my-event-watchtower.service';


@Component({
  moduleId: module.id,
  selector: 'pricetag-h',
  templateUrl: 'pricetag-h.component.html',
  styleUrls: [ 'pricetag-h.component.css' ]
})
export class PriceTagHComponent implements OnInit {

  @Input() title:string;
  @Input() fontSizeTitle:number=12;
  @Input() paddingTitle:number=10;

  @Input() desc:string;
  @Input() fontSizeDesc:number=12;
  @Input() paddingDesc:number=10;

  @Input() price:number;
  @Input() fontSizePrice:number=12;
  @Input() paddingTopPrice:number=10;

  @Input() cageWidth:number=-1;
  cageWidthStr:string="";
  @Input() currency:string;
  @Input() color:string;

  @Input() eventKey:string;

  @Output() emitter = new EventEmitter<MyEvent>();

  priceWithFormat:string;
  priceDesc:string;

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService ) {}

  ngOnInit(): void {
    this.priceWithFormat = this.numberWithCommas(this.price);

    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    }

    // 부모 객체에게 준비되었다는 이벤트를 보냅니다.
    this.emitEventOnReady();

  }

  private emitEventOnReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("pricetag-h / emitEventOnReady / 시작");

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

    if(isDebug) console.log("pricetag-h / emitEventOnReady / Done!");

  } 

  setTitle(title:string): void {
    // title

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("pricetag-h / setTitle / 시작");

    if(null == title || "" === title) {
      if(isDebug) console.log("pricetag-h / setTitle / 중단 / title is not valid!");
      return;
    }

    this.title = title;

  }  

  setPrice(price:number): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("pricetag-h / setPrice / 시작");
    if(isDebug) console.log("pricetag-h / setPrice / price : ",price);

    this.priceWithFormat = this.numberWithCommas(price);

    if(isDebug) console.log("pricetag-h / setPrice / this.priceWithFormat : ",this.priceWithFormat);
  }

  // @ Desc : 가격 밑에 보여지는 설명 ex) 수수료등.
  setPriceDesc(priceDesc:string):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("pricetag-h / setPrice / 시작");
    if(isDebug) console.log("pricetag-h / setPrice / priceDesc : ",priceDesc);

    this.priceDesc = priceDesc;
  }

  private numberWithCommas(x) :string{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}