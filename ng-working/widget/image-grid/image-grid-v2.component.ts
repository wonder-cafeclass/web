import { Component, 
         OnInit, 
         AfterViewInit,
         Output,
         ViewChildren,
         QueryList,
         EventEmitter,
         Input }                from '@angular/core';

import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyChecker }            from '../../util/model/my-checker';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

import { ImageEntryComponent }  from './image-entry.component';

@Component({
  moduleId: module.id,
  selector: 'image-grid-v2',
  templateUrl: 'image-grid-v2.component.html',
  styleUrls: [ 'image-grid-v2.component.css' ]
})
export class ImageGridV2Component implements OnInit, AfterViewInit {

  // @ Common Props
  @Output() emitter = new EventEmitter<MyEvent>();

  @Input() imageTable:string[][];
  @Input() imageHeight:number=-1;
  @Input() imageWidth:number=-1;
  @Input() tableWidth:number=-1;
  tableWidthStr:string;
  @Input() hasTableBorder:boolean=false;
  @Input() isAdmin:boolean=false;
  @Input() handleType:string="";
  @Input() eventKey:string="";

  gridWidth:number=100;
  isDisabled:boolean=false;

  private imageListFromUser:string[];

  @ViewChildren(ImageEntryComponent) imageEntryList: QueryList<ImageEntryComponent>;

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService ) {}

  ngOnInit(): void {

    this.init();
    this.emitEventOnReady();

  }

  ngAfterViewInit():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / ngAfterViewInit / 시작");
    if(isDebug) console.log("image-grid-v2 / ngAfterViewInit / imageEntryList : ",this.imageEntryList);

  }

  private init():void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / init / 시작");

    if(null == this.imageTable || 0 == this.imageTable.length) {
      return;
    }

    // 첫번째 열의 컬럼 갯수를 기준으로 전체 열의 엘리먼트 갯수가 같은지 확인합니다.
    // 컬럼 갯수가 많다면 마지막 엘리먼트를 제거. - Not implemented!
    // 컬럼 갯수가 적다면 공백 문자열을 추가합니다.
    let rowCnt = this.imageTable.length;
    let colCnt = this.imageTable[0].length;

    for (var rowIdx = 0; rowIdx < this.imageTable.length; ++rowIdx) {
      let row = this.imageTable[rowIdx];

      if(row.length === colCnt) {
        continue;
      } else if(row.length < colCnt) {
        // 엘리먼트가 부족할 경우의 처리.
        let colCntNeeded = colCnt - row.length;
        for (var k = 0; k < colCntNeeded; ++k) {
          row.push(null);
        } // end inner for
      } // end if
    } // end outer for

    this.gridWidth = this.imageWidth * colCnt;

    if(0 < this.tableWidth) {
      this.tableWidthStr=`${this.tableWidth}px`;
    } else {
      this.tableWidthStr="100%";
    }    
  }

  addImageSingleColumn(imageUrl:string): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / addImageSingleColumn / 시작");

    if(null == imageUrl || "" === imageUrl) {
      return;
    }

    // 이미지를 추가합니다. 
    if(null == this.imageTable || 0 == this.imageTable.length) {
      if(isDebug) console.log("image-grid-v2 / addImageSingleColumn / 첫번째 배너 추가");
      this.imageTable = [[imageUrl]];
    } else {
      if(isDebug) console.log("image-grid-v2 / addImageSingleColumn / 첫번째 배너 이후 추가");
      this.imageTable.push([imageUrl]);
    } // end if

  } // end method

  addImageListSingleColumn(imageUrlList:string[]):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / addImageListSingleColumn / 시작");

    if(null == imageUrlList || 0 == imageUrlList.length) {
      return;
    }

    // 이미지를 추가합니다.
    for (var i = 0; i < imageUrlList.length; ++i) {
      let imageUrl:string = imageUrlList[i];
      this.addImageSingleColumn(imageUrl);
    } // end for

  } // end method

  // @ Desc : image-grid와 사용자가 전달한 이미지 주소 리스트를 대조, 사용자가 가지고 있지 않은 이미지들은 비활성 처리합니다.
  compareUserImages(imageUrlList:string[]):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / compareUserImages / 시작");

    if(null == imageUrlList || 0 == imageUrlList.length) {
      if(isDebug) console.log("image-grid-v2 / compareUserImages / 중단 / imageUrlList is not valid!");
      return;
    }
    if(isDebug) console.log("image-grid-v2 / compareUserImages / imageUrlList : ",imageUrlList);

    this.imageListFromUser = imageUrlList;

    // wonder.jung
    if(null != this.imageEntryList) {
      this.imageEntryList.forEach(function(imageEntry) {

        // imageEntry
        if(isDebug) console.log("image-grid-v2 / compareUserImages / imageEntry : ",imageEntry);

      }); // end for-each
    }

  }
  // @ Desc : image-entry 객체가 유효한 이미지 주소를 가지고 있는지 확인합니다.
  compareImage(imageEntry:ImageEntryComponent):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / compareImage / 시작");
    if(isDebug) console.log("image-grid-v2 / compareImage / imageEntry : ",imageEntry);

    if(null == this.imageListFromUser || 0 == this.imageListFromUser.length) {
      if(isDebug) console.log("image-grid-v2 / compareImage / 중단 / imageListFromUser is not valid!");
      return;
    }

    let hasImage:boolean = false;
    for (var i = 0; i < this.imageListFromUser.length; ++i) {
      let imageFromUser:string = this.imageListFromUser[i];
      if(null == imageFromUser || "" === imageFromUser) {
        continue;
      }

      if(imageEntry.hasImage(imageFromUser)) {
        // 활성 처리
        if(isDebug) console.log("image-grid-v2 / compareImage / 활성 처리");
        return;
      }

    } // end for

    if(!hasImage) {
      // 비활성 처리
      if(isDebug) console.log("image-grid-v2 / compareImage / 비활성 처리");
    } // end if

  } // end method

  removeImage(imageUrl:string):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / removeImage / 시작");

    if(null == imageUrl || "" === imageUrl) {
      return;
    }

    let imageTableNext:string[][] = [];
    for (var i = 0; i < this.imageTable.length; ++i) {
      let columnList:string[] = this.imageTable[i];
      let columnListNext:string[] = [];

      for (var j = 0; j < columnList.length; ++j) {
        let banner:string = columnList[j];
        if( null != banner && 
            "" != banner && 
            banner !== imageUrl) {

          // 유효한 배너 이미지입니다.
          columnListNext.push(banner);

        }
      } // end for

      if(0 < columnListNext.length) {
        imageTableNext.push(columnListNext);
      } // end if

    }

    this.imageTable = imageTableNext;

  }

  onChangeCheck(event, checkboxToggle, targetImg) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / onChangeCheck / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(null == checkboxToggle) {
      return;
    }

    let checked:boolean = checkboxToggle.checked;
    if(isDebug) console.log("image-grid-v2 / onChangeCheck / checked : ",checked);

    this.isDisabled = !checked;

    if(isDebug) console.log("image-grid-v2 / onChangeCheck / targetImg : ",targetImg);

  }

  onChangedFromChild(myEvent:MyEvent):void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / onChangedFromChild / 시작");
    if(isDebug) console.log("image-grid-v2 / onChangedFromChild / myEvent : ",myEvent);

    let eventName:string = myEvent.eventName;


    let isOK:boolean = this.myCheckerService.isOK(myEvent.myChecker, myEvent.value);
    if(!isOK) {
      if(isDebug) console.log("image-grid-v2 / onChangedFromChild / 중단 / 값이 유효하지 않습니다.");
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {

        // this.updateKlassTitle(myEvent.value, false);
        // TODO - image-entry가 모두 준비가 된다면, image-grid-v2도 부모에게 Ready 이벤트를 전달해줍니다.

        // 사용자가 전달한 유효한 이미지 리스트가 있다면 여기에서 비교, 활성/비활성화 처리를 합니다.
        this.compareImage(myEvent.metaObj);

      }

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {

        this.emitEventOnAdd(myEvent);

      }       

    } else if(myEvent.hasEventName(this.myEventService.ON_REMOVE_ROW)) {

      if(myEvent.hasKey(this.myEventService.KEY_IMAGE_ENTRY)) {

        this.emitEventOnDelete(myEvent);

      }      

    } // end if

  } // end method 

  private emitEventOnAdd(myEvent:MyEvent) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / emitEventOnAdd / 시작");

    if(null == myEvent) {
      return;
    }

    // image-entry의 이벤트 객체를 그대로 전달.
    // 이벤트 키만 변경합니다.
    myEvent.key = this.eventKey;

    this.emitter.emit(myEvent);

    if(isDebug) console.log("image-grid-v2 / emitEventOnAdd / Done!");
  }  

  private emitEventOnDelete(myEvent:MyEvent) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / emitEventOnDelete / 시작");

    if(null == myEvent) {
      return;
    }

    // image-entry의 이벤트 객체를 그대로 전달.
    // 이벤트 키만 변경합니다.
    myEvent.key = this.eventKey;

    this.emitter.emit(myEvent);

    if(isDebug) console.log("image-grid-v2 / emitEventOnDelete / Done!");
  }

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / emitEventOnReady / 시작");

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

    if(isDebug) console.log("image-grid-v2 / emitEventOnReady / Done!");

  }

}