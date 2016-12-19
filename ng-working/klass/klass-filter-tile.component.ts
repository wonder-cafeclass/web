import {  Component, 
          OnInit, 
          EventEmitter,
          Input, 
          Output }              from '@angular/core';
import { Location }             from '@angular/common';

import { Subject }              from 'rxjs/Subject';

import { KlassService }         from './service/klass.service';

import { KlassLevel }           from './model/klass-level';
import { KlassStation }         from './model/klass-station';
import { KlassDay }             from './model/klass-day';
import { KlassTime }            from './model/klass-time';

import { KlassSelectile }       from './model/klass-selectile';
import { KlassSelectileRow }    from './model/klass-selectile-row';

import { MyResponse }           from '../util/model/my-response';

import { MyCheckerService }     from '../util/service/my-checker.service';
import { MyChecker }            from '../util/model/my-checker';
import { MyEventService }       from '../util/service/my-event.service';
import { MyEvent }              from '../util/model/my-event';
import { MyEventWatchTowerService } from '../util/service/my-event-watchtower.service';

@Component({
  moduleId: module.id,
  selector: 'klass-filter-tile',
  templateUrl: 'klass-filter-tile.component.html',
  styleUrls: [ 'klass-filter-tile.component.css' ]
})
export class KlassFilterTileComponent implements OnInit {

  // Observable Selectile 
  klassSelectileSubject = new Subject();

  // Level
  klassLevels: KlassLevel[];
  klassLevelSelected: KlassLevel; // 사용자가 선택한 클래스 레벨
  // Station
  klassStations: KlassStation[];
  klassStationSelected: KlassStation; // 사용자가 선택한 클래스 레벨
  // Day
  klassDays: KlassDay[];
  klassDaySelected: KlassDay; // 사용자가 선택한 클래스 레벨
  // Time
  klassTimes: KlassTime[];
  klassTimeSelected: KlassTime; // 사용자가 선택한 클래스 레벨 

  @Output() emitter = new EventEmitter<MyEvent>();

  // 검색을 가지고 있는 부모 컴포넌트에게 selectile의 값을 전달하기 위한 통신 이벤트객체
  @Output() emitOnChangedSelectile = new EventEmitter<any>();

  // 컴포넌트 로딩 완료 이벤트 발사!
  @Output() emitOnInitKlassList = new EventEmitter<void>();

  selectileTable: KlassSelectileRow[];
  selectileShadowRows: KlassSelectileRow[];

  stColCntPerRow:number = 4; // selectile에 선택지를 열(Row)당 4개씩 노출

  @Input() elementWidth:number=50;
  elementWidthStr:string="";
  rowWidthStr:string="";

  private myChecker:MyChecker;
  private constMap:any;

  constructor(
    private myCheckerService:MyCheckerService,
    private myEventService:MyEventService,
    private watchTower:MyEventWatchTowerService,    
    private klassService: KlassService,
    private location: Location
  ) {}

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-tile / ngOnInit / 시작");

    this.klassService
    .getKlassSelectile()
    .then((myReponse:MyResponse) => {

      if(isDebug) console.log("klass-filter-tile / ngOnInit / myReponse : ",myReponse);

      if(myReponse.isSuccess()) {
        this.setLevel(myReponse.getDataProp("levels"));
        this.setStation(myReponse.getDataProp("stations"));
        this.setDay(myReponse.getDataProp("days"));
        this.setTime(myReponse.getDataProp("times"));

        this.showSelectile(null, null, -1);

        // @ Recommended
        this.emitEventOnReady();

        if(isDebug) console.log("TEST - 001");

      } // end if

    }); // end service

    // @ Deprecated
    this.emitOnInitKlassList.emit();

    var _self = this;
    this.klassSelectileSubject.subscribe(
      function (x) {
        _self.updateShowingSelectile(x);
        if(isDebug) console.log("TEST - 002");
      },
      function (err) {
        // error report
        console.log('Error: ' + err);
      },
      function () {
        console.log('Completed');
      }
    );

    this.elementWidthStr="100%";
    this.rowWidthStr="198px";
    if(0  < this.elementWidth) {
      this.elementWidthStr = this.elementWidth + "px";
      let rowWidth:number = this.elementWidth * this.stColCntPerRow;
      if(isDebug) console.log("klass-filter-tile / ngOnInit / rowWidth : ",rowWidth);
      this.rowWidthStr = rowWidth + "px";
    }

    this.subscribeConstMap();

  }

  private subscribeConstMap() {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-tile / subscribeConstMap / 시작");

    this.constMap = this.watchTower.getConstMap();
    if(isDebug) console.log("klass-filter-tile / subscribeLoginTeacher / this.constMap : ",this.constMap);

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {

      if(isDebug) console.log("klass-filter-tile / subscribeLoginTeacher / isViewPackReady : ",isViewPackReady);
    
      // 뷰 패키징 정보가 도착!
      this.constMap = this.watchTower.getConstMap();

      if(isDebug) console.log("klass-filter-tile / subscribeLoginTeacher / this.constMap : ",this.constMap);

    }); // end subscribe    

  }

  private setTime(times:any[]) {

    var nextObjList:KlassTime[] = [];
    for (var i = 0; i < times.length; ++i) {
      var nextObj = times[i];
      var klassTime = 
      new KlassTime(
        nextObj.key, 
        nextObj.name_eng, 
        nextObj.name_kor, 
        nextObj.hh_mm,
        nextObj.img_url
      );
      nextObjList.push(klassTime);
    }
    this.klassTimes = nextObjList;

    // 부모 리스트 참조
    for (var i = 0; i < this.klassTimes.length; ++i) {
      let nextObj:KlassTime = this.klassTimes[i];
      nextObj.parentList = this.klassTimes;
      nextObj["focusIdx"] = 3;
    }

    if(this.klassTimes && !this.klassTimeSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassTimeSelected = this.klassTimes[0];
    }
  }    
  private setDay(days:any[]) {

    var nextObjList:KlassDay[] = [];
    for (var i = 0; i < days.length; ++i) {
      var nextObj = days[i];
      var klassDay = 
      new KlassDay(
        nextObj.key, 
        nextObj.name_eng, 
        nextObj.name_kor, 
        nextObj.img_url
      );
      nextObjList.push(klassDay);
    }
    this.klassDays = nextObjList;

    // 부모 리스트 참조
    for (var i = 0; i < this.klassDays.length; ++i) {
      let nextObj:KlassDay = this.klassDays[i];
      nextObj.parentList = this.klassDays;
      nextObj["focusIdx"] = 2;
    }

    if(this.klassDays && !this.klassDaySelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassDaySelected = this.klassDays[0];
    }
  }  
  private setStation(stations:any[]) {

    var nextObjList:KlassStation[] = [];
    for (var i = 0; i < stations.length; ++i) {
      var nextObj = stations[i];

      var klassStation = 
      new KlassStation(
        nextObj.key, 
        nextObj.name_eng, 
        nextObj.name_kor, 
        nextObj.img_url
      );
      nextObjList.push(klassStation);
    }
    this.klassStations = nextObjList;

    // 부모 리스트 참조
    for (var i = 0; i < this.klassStations.length; ++i) {
      let nextObj:KlassStation = this.klassStations[i];
      nextObj.parentList = this.klassStations;
      nextObj["focusIdx"] = 1;
    }

    if(this.klassStations && !this.klassStationSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassStationSelected = this.klassStations[0];
    }

  }
  private setLevel(levels:any[]) {

    var nextObjList:KlassLevel[] = [];
    for (var i = 0; i < levels.length; ++i) {
      var nextObj = levels[i];
      var klassLevel = 
      new KlassLevel(
        nextObj.key, 
        nextObj.name_eng, 
        nextObj.name_kor, 
        nextObj.img_url
      );
      nextObjList.push(klassLevel);
    }
    this.klassLevels = nextObjList;

    // 부모 리스트 참조
    for (var i = 0; i < this.klassLevels.length; ++i) {
      let nextObj:KlassLevel = this.klassLevels[i];
      nextObj.parentList = this.klassLevels;
      nextObj["focusIdx"] = 0;
    }

    if(this.klassLevels && !this.klassLevelSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassLevelSelected = this.klassLevels[0];
    }

  }

  private getSelectedIdx(targetList:any[], key:string, value:string):number {

    let selectedIdx = -1;
    for (var i = 0; i < targetList.length; i++) {
      let element = targetList[i];
      if(element[key] === value) {
        selectedIdx = i;
        break;
      }
    }    

    return selectedIdx;
  }
  private getNextElement(targetList:any[], prevIdx:number):any {
    let nextElement = null;
    if(prevIdx === (targetList.length - 1)) {
      nextElement = targetList[0];
    } else {
      nextElement = targetList[prevIdx + 1];
    }

    return nextElement;
  } 

  isEnterST:boolean=false;
  enterSelectile(selectile) :void {
    if(selectile.class_name !== "empty" || this.isEnterST) {
      return;
    }
    this.isEnterST = true;
    if(selectile && selectile["parentList"]) {
      this.showSelectile(selectile["parentList"], selectile, selectile["focusIdx"]);
    }
  }
  leaveSelectile(selectile) :void {
    // selectile 내부의 버튼에 mouseover시 leave로 판정. 이것을 막는 방법은?
    if(selectile.class_name !== "knob") {
      return;
    }
    this.isEnterST = false;
  }
  leaveTable() :void {
    this.isEnterST = false;
    this.showSelectile(null, null, -1);
  }
  clickSelectile(event, selectile) :void {
    event.stopPropagation();

    if(null == selectile) {
      // error report
      return;
    }
    this.updateShowingSelectile(selectile);
  }
  // REFACTOR ME - widget으로 옮겨져야 할 엘리먼트.
  updateShowingSelectilesAll(klassLevel:KlassLevel, klassStation:KlassStation, klassDay:KlassDay, klassTime:KlassTime):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-tile / updateShowingSelectilesAll / 시작");

    if(null == klassLevel){
      console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassLevel is not valid!");
      return;
    } 
    if(null == klassStation){
      console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassStation is not valid!");
      return;
    } 
    if(null == klassDay){
      console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassDay is not valid!");
      return;
    } 
    if(null == klassTime){
      console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassTime is not valid!");
      return;
    } 

    this.selectileTable;

    console.log("klass-filter-tile / updateShowingSelectilesAll / this.selectileTable : ",this.selectileTable);

    // 선택된 필드들을 검색, 지정한다.
    for (var i = 0; i < this.klassLevels.length; ++i) {
      let klassLevelFromList:KlassLevel = this.klassLevels[i];
      if(klassLevelFromList.isSharing("key", klassLevel)) {
        console.log("klass-filter-tile / updateShowingSelectilesAll / klassLevelFromList : ",klassLevelFromList);
        this.klassLevelSelected = klassLevelFromList;
      }
    } // end for
    for (var i = 0; i < this.klassStations.length; ++i) {
      let klassStationFromList:KlassStation = this.klassStations[i];
      if(klassStationFromList.isSharing("key", klassStation)) {
        console.log("klass-filter-tile / updateShowingSelectilesAll / klassStationFromList : ",klassStationFromList);
        this.klassStationSelected = klassStationFromList;
      }
    } // end for
    for (var i = 0; i < this.klassDays.length; ++i) {
      let klassDayFromList:KlassDay = this.klassDays[i];
      if(klassDayFromList.isSharing("key", klassDay)) {
        console.log("klass-filter-tile / updateShowingSelectilesAll / klassDayFromList : ",klassDayFromList);
        this.klassDaySelected = klassDayFromList;
      }
    } // end for
    for (var i = 0; i < this.klassTimes.length; ++i) {
      let klassTimeFromList:KlassTime = this.klassTimes[i];
      if(klassTimeFromList.isSharing("key", klassTime)) {
        console.log("klass-filter-tile / updateShowingSelectilesAll / klassTimeFromList : ",klassTimeFromList);
        this.klassTimeSelected = klassTimeFromList;
      }
    } // end for

    this.leaveTable();
  }
  updateShowingSelectile(selectile) :void {

    if(null == selectile) {
      // error report
      return;
    }

    let hasChanged = false;
    if(selectile instanceof KlassLevel) {

      if(null == this.klassLevelSelected || this.klassLevelSelected.key !== selectile.key) {
        this.klassLevelSelected = selectile;
        hasChanged = true;
      }
      
    } else if(selectile instanceof KlassStation) {

      if(null == this.klassStationSelected || this.klassStationSelected.key !== selectile.key) {
        this.klassStationSelected = selectile;  
        hasChanged = true;
      }

    } else if(selectile instanceof KlassDay) {

      if(null == this.klassDaySelected || this.klassDaySelected.key !== selectile.key) {
        this.klassDaySelected = selectile;  
        hasChanged = true;
      }

    } else if(selectile instanceof KlassTime) {

      if(null == this.klassTimeSelected || this.klassTimeSelected.key !== selectile.key) {
        this.klassTimeSelected = selectile;  
        hasChanged = true;
      }

    }

    this.leaveTable();

    if(hasChanged) {
      // 이전과 다른 값을 선택한 경우에만 리스트를 조회한다.
      this.emitChangedSelectile();
    }
  }
  emitChangedSelectile() :void {
    // 변경된 selectile의 값을 전달한다.
    var selectileMap = this.getFocusedSelectiles();
    this.emitOnChangedSelectile.emit(selectileMap);
    this.emitEventOnChange(
     // value:string, 
     "",
     // metaObj:any   
     selectileMap
    );
  }
  private emitEventOnChange(value:string, metaObj:any) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-tile / emitEventOnChange / 시작");
    if(null == value) {
      if(isDebug) console.log("klass-filter-tile / emitEventOnChange / 중단 / value is not valid!");
      return;
    }
    if(null == metaObj) {
      if(isDebug) console.log("klass-filter-tile / emitEventOnChange / 중단 / metaObj is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_CHANGE,
      // public key:string
      this.myEventService.KEY_KLASS_SELECTILE,
      // public value:string
      value,
      // public metaObj:any
      metaObj,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("klass-filter-tile / emitEventOnChange / Done!");

  } 
  private emitEventOnReady() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-tile / emitEventOnReady / 시작");

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_READY,
      // public key:string
      this.myEventService.KEY_KLASS_SELECTILE,
      // public value:string
      "",
      // public metaObj:any
      this,
      // public myChecker:MyChecker
      this.myCheckerService.getFreePassChecker()
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("klass-filter-tile / emitEventOnChange / Done!");

  }    
  // emitOnChangedSelectile
  public getFocusedSelectiles() :any {
    var selectileMap = 
    {
      level:this.klassLevelSelected,
      station:this.klassStationSelected,
      day:this.klassDaySelected,
      time:this.klassTimeSelected
    };

    return selectileMap;
  }
  private setShadowRows(targetList:any[]) :void {
    if(1 < targetList.length) {
      this.selectileShadowRows = targetList.slice(1, targetList.length);
    } else {
      this.selectileShadowRows = null;
    }
  }
  private showSelectile(targetList:any[], targetObj:any, focusIdx:number) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-filter-file / constructor / init");

    if(isDebug) console.log("klass-filter-file / constructor / this.klassLevelSelected : ",this.klassLevelSelected);
    if(isDebug) console.log("klass-filter-file / constructor / this.klassStationSelected : ",this.klassStationSelected);
    if(isDebug) console.log("klass-filter-file / constructor / this.klassDaySelected : ",this.klassDaySelected);
    if(isDebug) console.log("klass-filter-file / constructor / this.klassTimeSelected : ",this.klassTimeSelected);

    // 사용자가 선택한 필터를 보여주는 열(Row)
    let nextSelectileTable:any[] = [];
    var row:any[] = [];

    this.klassLevelSelected["class_name"] = "empty";
    row.push(this.klassLevelSelected);
    this.klassStationSelected["class_name"] = "empty";
    row.push(this.klassStationSelected);
    this.klassDaySelected["class_name"] = "empty";
    row.push(this.klassDaySelected);
    this.klassTimeSelected["class_name"] = "empty";
    row.push(this.klassTimeSelected);

    nextSelectileTable.push(row);

    if(!targetList || null == targetObj || !(-1 < focusIdx)) {
      this.selectileTable = nextSelectileTable;
      this.setShadowRows(this.selectileTable);
      return;
    }

    var targetListValid:any[] = [];
    // 현재 표시되는 선택지는 제외합니다.
    for (var i = 0; i < targetList.length; i++) {
      let curObj = targetList[i];
      if(targetObj.key && curObj.key && (targetObj.key === curObj.key)) {
        continue;
      }
      targetListValid.push(curObj);
    }

    // 사용자가 선택할 수 있는 필터를 보여주는 열(Row)
    let elementCnt:number = targetListValid.length;
    let rowCnt = Math.ceil(elementCnt/this.stColCntPerRow);

    for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {

      var row:any[] = [];
      for (var colIdx = 0; colIdx < this.stColCntPerRow; colIdx++) {

        let curIdx = this.stColCntPerRow * (rowIdx) + colIdx;
        if((targetListValid.length - 1) < curIdx) {
          // 표시할 수 있는 선택지가 더 이상 없습니다. Empty 영역을 표시할 객체들로 채워줍니다.
          row.push({});
          continue;
        }
        let curObj = targetListValid[curIdx];

        if(curObj.img_url) {
          row.push(curObj);
        }

      } // end inner for

      nextSelectileTable.push(row);
    } // end outer for

    nextSelectileTable = this.setSelectileType(nextSelectileTable, focusIdx);

    this.selectileTable = nextSelectileTable;
    this.setShadowRows(this.selectileTable);
  }
  private setSelectileType(targetList:any[], curSelectileIdx:number) :any[] {

    if(!targetList) {
      return;
    }

    let rowCnt = targetList.length;
    for (var rowIdx = 0; rowIdx < targetList.length; rowIdx++) {

      var row = targetList[rowIdx];
      for (var colIdx = 0; colIdx < row.length; colIdx++) {

        var field = row[colIdx];
        if(0 === rowIdx) {
          // 1. 첫번째 열은 현재 선택한 값을 보여줍니다.
          if(curSelectileIdx === colIdx) {
            // 사용자가 mouseover한 선택 카테고리입니다.
            field["class_name"] = "knob";
          } else {
            field["class_name"] = "empty";
          }

        } else if(rowCnt == 2) {

          // 2. 사용자가 선택할 수 있는 항목이 1개의 열(row)에 모두 포함되는 경우.
          if(colIdx === 0 && curSelectileIdx === colIdx) {
            // 2-0. 첫번째 컬럼이면서 knob이 연결되어 있는가?
            field["class_name"] = "left-round-knob";
          } else if(colIdx === 0) {
            // 2-1. 첫번째 컬럼인가?
            field["class_name"] = "left-round";
          } else if(colIdx === (this.stColCntPerRow - 1) && curSelectileIdx === colIdx) {
            // 2-2. 마지막 컬럼이면서 knob이 연결되어 있는가?
            field["class_name"] = "right-round-knob";
          } else if(colIdx === (this.stColCntPerRow - 1)) {
            // 2-3. 마지막 컬럼인가?
            field["class_name"] = "right-round";
          } else {
            // 2-4. 다른 타일에 둘러싸여있는 타일인가?
            field["class_name"] = "center-round";
          }

        } else {

          // 3. 사용자가 선택할 수 있는 항목이 2개 이상의 열(row)에 모두 포함되는 경우.
          if(rowIdx === 1) {

            // 3-1. 첫번째 선택열인가?
            if(curSelectileIdx == colIdx && 0 == colIdx) {
              // 첫번째 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
              field["class_name"] = "left-single";

            } else if(curSelectileIdx == colIdx && 0 < colIdx) {
              // 두번째 이상 컬럼에 knob이 있는 경우 
              field["class_name"] = "top-knob";

            } else if(curSelectileIdx != colIdx && 0 == colIdx) {
              // 첫번째 컬럼에 knob이 없는 경우, 첫번째 컬럼은 top-left
              field["class_name"] = "top-left";

            } else if(curSelectileIdx == colIdx && colIdx === (this.stColCntPerRow - 1)) {
              // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
              field["class_name"] = "center";
              
            } else if(colIdx === (this.stColCntPerRow - 1)) {
              // 2-2. 마지막 컬럼인가?
              field["class_name"] = "top-right";
            } else {
              field["class_name"] = "top";
            }

          } else if(rowIdx === (rowCnt - 1)) {
            // 3-1. 마지막 열인가?
            if(colIdx === 0) {
              // 2-1. 첫번째 컬럼인가?
              field["class_name"] = "bottom-left";
            } else if(colIdx === (this.stColCntPerRow - 1)) {
              // 2-2. 마지막 컬럼인가?
              field["class_name"] = "bottom-right";
            } else {
              field["class_name"] = "bottom";
            }

          } else {

            // 첫번재 열인경우.
            if(0 == colIdx) {
              field["class_name"] = "left-single";
            } else if(colIdx === (this.stColCntPerRow - 1)) {
              field["class_name"] = "right-single";
            } else {
              // 3-2. 마지막 열보다 이전인가?
              field["class_name"] = "center";
            } // end inner if

          } // end inner if
        } // end if        
      } // end inner for
    } // end outer for

    return targetList;
  }

}