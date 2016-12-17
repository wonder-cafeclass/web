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

  gridWidth:number=100;
  isDisabled:boolean=false;

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

  removeImage(imageUrl:string): void {

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

  onClickDelete(event, imgUrlToDelete:string) :void {

    event.stopPropagation();
    event.preventDefault();

    if(null == imgUrlToDelete || "" === imgUrlToDelete) {
      return;
    }

    this.removeImage(imgUrlToDelete);
    this.emitEventOnDelete(imgUrlToDelete);

  }

  private emitEventOnDelete(imgUrlToDelete:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / emitEventOnDelete / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_REMOVE_ROW,
      // public key:string
      this.myEventService.KEY_IMAGE_GRID,
      // public value:string
      imgUrlToDelete,
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      null
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("image-grid-v2 / emitEventOnChange / Done!");    
  }

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid-v2 / emitEventOnChange / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.myEventService.KEY_IMAGE_GRID,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      null
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("image-grid-v2 / emitEventOnChange / Done!");

  }  

  //onChangedFromChild
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

    if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        // this.updateKlassTitle(myEvent.value, false);

      }

    } else if(myEvent.hasEventName(this.myEventService.ON_SUBMIT)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_TITLE)) {

        // this.updateKlassTitle(myEvent.value, true);

      }      

    } else if(myEvent.hasEventName(this.myEventService.ON_DONE)) {

      if(myEvent.hasKey(this.myEventService.KEY_KLASS_POSTER)) {

        // this.addKlassPoster(myEvent.value);

      }

    } else if(myEvent.hasEventName(this.myEventService.ON_ADD_ROW)) {

      // Do something ...

    } // end if

  } // end method  

}