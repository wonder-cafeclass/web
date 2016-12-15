import { Component, OnInit, Input }   from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'image-grid',
  templateUrl: 'image-grid.component.html',
  styleUrls: [ 'image-grid.component.css' ]
})
export class ImageGridComponent implements OnInit {

  @Input() imageTable:string[][];
  @Input() imageHeight:number=-1;
  @Input() imageWidth:number=-1;
  @Input() tableWidth:number=-1;
  tableWidthStr:string;
  @Input() hasTableBorder:boolean=false;

  gridWidth:number=100;

  constructor() {}

  ngOnInit(): void {

    this.init();

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

    if(0 < this.tableWidth) {
      this.tableWidthStr=`${this.tableWidth}px`;
    } else {
      this.tableWidthStr="100%";
    }    
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

  }

  removeImage(imageUrl:string): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("image-grid / removeImage / 시작");

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

}