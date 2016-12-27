import { Component, 
         OnInit, 
         AfterViewInit, 
         Output,
         EventEmitter,
         Input }                from '@angular/core';

import { MyCheckerService }     from '../../util/service/my-checker.service';
import { MyChecker }            from '../../util/model/my-checker';
import { MyEventService }       from '../../util/service/my-event.service';
import { MyEvent }              from '../../util/model/my-event';

@Component({
  moduleId: module.id,
  selector: 'image-grid',
  templateUrl: 'image-grid.component.html',
  styleUrls: [ 'image-grid.component.css' ]
})
export class ImageGridComponent implements OnInit, AfterViewInit {

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

  tdWidthStr:string="";

  constructor(  private myCheckerService:MyCheckerService,
                private myEventService:MyEventService ) {}

  ngOnInit(): void {

    this.init();
    this.emitEventOnReady();

  }

  ngAfterViewInit():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / ngAfterViewInit / 시작");

  }


  private init():void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / init / 시작");

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
    this.tdWidthStr = "10%";
    if(0 < this.imageWidth) {
      this.tdWidthStr = this.imageWidth + "px";
    }


    if(0 < this.tableWidth) {
      this.tableWidthStr=`${this.tableWidth}px`;
    } else {
      this.tableWidthStr="100%";
    }    
  }

  // 테이블에 이미지를 추가합니다.
  addImage(imageUrl:string): void {

  }

  addImageSingleColumn(imageUrl:string): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / addImageSingleColumn / 시작");

    if(null == imageUrl || "" === imageUrl) {
      return;
    }

    // 이미지를 추가합니다. 
    if(null == this.imageTable || 0 == this.imageTable.length) {
      if(isDebug) console.log("image-grid / addImageSingleColumn / 첫번째 배너 추가");
      this.imageTable = [[imageUrl]];
    } else {
      if(isDebug) console.log("image-grid / addImageSingleColumn / 첫번째 배너 이후 추가");
      this.imageTable.push([imageUrl]);
    } // end if

  } // end method

  addImageListSingleColumn(imageUrlList:string[]):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / addImageListSingleColumn / 시작");

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
    if(isDebug) console.log("image-grid / removeImage / 시작");
    if(isDebug) console.log("image-grid / removeImage / imageUrl : ",imageUrl);

    if(null == imageUrl || "" === imageUrl) {
      return;
    }

    if(isDebug) console.log("image-grid / removeImage / this.imageTable : ",this.imageTable);

    let imageTableNext:string[][] = [];
    for (var i = 0; i < this.imageTable.length; ++i) {
      let columnList:string[] = this.imageTable[i];
      let columnListNext:string[] = [];

      for (var j = 0; j < columnList.length; ++j) {
        let banner:string = columnList[j];
        if( null != banner && 
            "" != banner && 
            banner !== imageUrl) {

          if(isDebug) console.log("image-grid / removeImage / banner : ",banner);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / onChangeCheck / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(null == checkboxToggle) {
      return;
    }

    let checked:boolean = checkboxToggle.checked;
    if(isDebug) console.log("image-grid / onChangeCheck / checked : ",checked);

    this.isDisabled = !checked;

    if(isDebug) console.log("image-grid / onChangeCheck / targetImg : ",targetImg);

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / emitEventOnDelete / 시작");

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

    if(isDebug) console.log("image-grid / emitEventOnChange / Done!");    
  }

  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / emitEventOnChange / 시작");

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

    if(isDebug) console.log("image-grid / emitEventOnChange / Done!");

  }  

}