import {  Component, 
          OnInit, 
          EventEmitter,
          Input, 
          Output }              from '@angular/core';
import { Location }             from '@angular/common';

import { Subject }              from 'rxjs/Subject';

import { KlassService }         from './service/klass.service';

import { KlassLevel }           from './model/klass-level';
// import { KlassStation }         from './model/klass-station';
import { KlassSubwayLine }      from './model/klass-subway-line';
import { KlassSubwayStation }   from './model/klass-subway-station';
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

import { HelperMyArray }        from '../util/helper/my-array';

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
  // 사용자가 선택한 클래스 레벨
  klassLevelSelected: KlassLevel;
  focusIdxKlassLevel:number = 0;
  // Subway Line
  klassSubwayLines: KlassSubwayLine[];
  // 사용자가 선택한 지하철 노선
  klassSubwayLineSelected: KlassSubwayLine; 
  focusIdxKlassSubwayLine:number = 1;
  // Subway Station
  klassSubwayStations: KlassSubwayStation[];
  // 사용자가 선택한 지하철 노선
  klassSubwayStationSelected: KlassSubwayStation; 
  focusIdxKlassSubwayStation:number = 2;
  // Day
  klassDays: KlassDay[];
  // 사용자가 선택한 클래스 레벨
  klassDaySelected: KlassDay; 
  focusIdxKlassDay:number = 3;
  // Time
  klassTimes: KlassTime[];
  // 사용자가 선택한 클래스 레벨 
  klassTimeSelected: KlassTime; 
  focusIdxKlassTime:number = 4;

  @Output() emitter = new EventEmitter<MyEvent>();

  // 검색을 가지고 있는 부모 컴포넌트에게 selectile의 값을 전달하기 위한 통신 이벤트객체
  @Output() emitOnChangedSelectile = new EventEmitter<any>();

  // 컴포넌트 로딩 완료 이벤트 발사!
  @Output() emitOnInitKlassList = new EventEmitter<void>();

  // stColCntPerRow:number = 5; // selectile에 선택지를 열(Row)당 n개씩 노출
  selectileTable: KlassSelectileRow[];
  selectileShadowRows: KlassSelectileRow[];

  @Input() elementWidth:number=50;
  elementWidthStr:string="";
  rowWidthStr:string="";

  private myChecker:MyChecker;
  private myArray:HelperMyArray;

  constructor(
    private myCheckerService:MyCheckerService,
    private myEventService:MyEventService,
    private watchTower:MyEventWatchTowerService,    
    private klassService: KlassService,
    private location: Location
  ) {
    this.myArray = new HelperMyArray();
  }

  private isDebug():boolean {
    return true;
    // return this.watchTower.this.isDebug();
  }

  setSelectileProps():void {

    if(this.isDebug()) console.log("klass-filter-tile / setSelectileProps / 시작");

    // watchTower에서 checker의 정보를 가져옵니다.
    this.setLevel();
    this.setDay();
    this.setTime();
    this.setSubwayLine();
    this.setSubwayStation("");

    this.showSelectile(null, null, -1);

  }

  ngOnInit(): void {

    if(this.isDebug()) console.log("klass-filter-tile / ngOnInit / 시작");

    if(this.watchTower.getIsViewPackReady()) {

      this.setSelectileProps();

    } else {

      this.watchTower.isViewPackReady$.subscribe(
        (isViewPackReady:boolean) => {
        if(this.isDebug()) console.log("klass-filter-tile / ngOnInit / subscribe / isViewPackReady : ",isViewPackReady);

        this.setSelectileProps();
        
      }); // end subscribe       

    } // end if

    // @ Deprecated
    this.emitOnInitKlassList.emit();

    var _self = this;
    this.klassSelectileSubject.subscribe(
      function (x) {
        _self.updateShowingSelectile(x);
      },
      function (err) {
        // error report
        console.log('Error: ' + err);
      },
      function () {
        console.log('Completed');
      }
    );

  } // end method

  updateLayout(stColCntPerRow:number):void {

    if(!(0 < stColCntPerRow)) {
      return;
    }

    this.elementWidthStr="100%";
    this.rowWidthStr="198px";
    if(0  < this.elementWidth) {
      this.elementWidthStr = this.elementWidth + "px";
      let rowWidth:number = this.elementWidth * stColCntPerRow;
      if(this.isDebug()) console.log("klass-filter-tile / ngOnInit / rowWidth : ",rowWidth);
      this.rowWidthStr = rowWidth + "px";
    }    
  }

  private setLevel() {

    if(this.isDebug()) console.log("klass-filter-tile / setLevel / 시작");

    if(!this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-filter-tile / setLevel / 중단 / !IsViewPackReady() : ",!this.watchTower.getIsViewPackReady());
      return;
    }

    // klass Level
    let klassLevelList:string[] = 
    this.watchTower.getMyConst().getList("class_level_list");
    let klassLevelEngList:string[] = 
    this.watchTower.getMyConst().getList("class_level_eng_list");
    let klassLevelKorList:string[] = 
    this.watchTower.getMyConst().getList("class_level_kor_list");
    let klassLevelImgList:string[] = 
    this.watchTower.getMyConst().getList("class_level_img_url_list");

    let klassLevelObjList:KlassLevel[] = [];
    for (var i = 0; i < klassLevelList.length; ++i) {
      // code...
      let key:string = klassLevelList[i];
      let name_eng:string = klassLevelEngList[i];
      let name_kor:string = klassLevelKorList[i];
      let img_url:string = klassLevelImgList[i];

      let klassLevel:KlassLevel = 
      new KlassLevel(key,name_eng,name_kor,img_url);

      klassLevelObjList.push(klassLevel);
    }
    this.klassLevels = klassLevelObjList;

    if(this.myArray.isOK(this.klassLevels)) {
      // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
      for (var i = 0; i < this.klassLevels.length; ++i) {
        let nextObj:KlassLevel = this.klassLevels[i];
        nextObj.selectableList = this.klassLevels;
        nextObj.focusIdx = this.focusIdxKlassLevel;
      }
      this.klassLevelSelected = this.klassLevels[0];
    }
  }


  private setSubwayLine():void {

    if(this.isDebug()) console.log("klass-filter-tile / setSubwayLine / 시작");

    if(!this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-filter-tile / setSubwayLine / 중단 / !IsViewPackReady() : ",!this.watchTower.getIsViewPackReady());
      return;
    }

    // klass Subway Line
    let klassSubwayLineList:string[] = 
    this.watchTower.getMyConst().getList("subway_line_list");
    let klassSubwayLineEngList:string[] = 
    this.watchTower.getMyConst().getList("subway_line_eng_list");
    let klassSubwayLineKorList:string[] = 
    this.watchTower.getMyConst().getList("subway_line_kor_list");
    let klassSubwayLineImgList:string[] = 
    this.watchTower.getMyConst().getList("subway_line_img_list");

    let klassSubwayLineObjList:KlassSubwayLine[] = [];
    for (var i = 0; i < klassSubwayLineList.length; ++i) {
      // code...
      let key:string = klassSubwayLineList[i];
      let name_eng:string = klassSubwayLineEngList[i];
      let name_kor:string = klassSubwayLineKorList[i];
      let img_url:string = klassSubwayLineImgList[i];

      // 해당 노선에 역이 등록되어 있지 않다면 선택 리스트에 노출되지 않습니다.
      let subwayStationList:any =
      this.watchTower.getMyConst().getNestedChildList(
        // parentKey:string, 
        "subway_line_list",
        // parentValue:string, 
        key,
        // childKey:string
        "subway_station_list"
      );
      if(this.myArray.isNotOK(subwayStationList)) {
        continue;
      } // end if

      let klassSubwayLine:KlassSubwayLine = 
      new KlassSubwayLine(key,name_eng,name_kor,img_url);
      klassSubwayLineObjList.push(klassSubwayLine);
    } 
    this.klassSubwayLines = klassSubwayLineObjList;
    if(this.myArray.isOK(this.klassSubwayLines)) {
      // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
      for (var i = 0; i < this.klassSubwayLines.length; ++i) {
        let nextObj:KlassSubwayLine = this.klassSubwayLines[i];
        nextObj.selectableList = this.klassSubwayLines;
        nextObj.focusIdx = this.focusIdxKlassSubwayLine;
      }      
      this.klassSubwayLineSelected = this.klassSubwayLines[0];
    } // end if

  } // end method

  private setSubwayStation(subwayLineNameSelected:string):void {

    if(this.isDebug()) console.log("klass-filter-tile / setSubwayStation / 시작");

    if(!this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-filter-tile / setSubwayStation / 중단 / !IsViewPackReady() : ",!this.watchTower.getIsViewPackReady());
      return;
    } // end if

    // Klass Subway Station
    if(null == subwayLineNameSelected || "" === subwayLineNameSelected) {
      // 지하철 노선이 선택되지 않았다면 지하철 역도 선택되지 않음.
      let subwayLineSelected:KlassSubwayLine = this.klassSubwayLines[0];
      subwayLineNameSelected = subwayLineSelected.key;
    } // end if
    
    if(this.isDebug()) console.log("klass-filter-tile / setSubwayStation / subwayLineNameSelected : ",subwayLineNameSelected);

    let subwayStationList:any =
    this.watchTower.getMyConst().getNestedChildList(
      // parentKey:string, 
      "subway_line_list",
      // parentValue:string, 
      subwayLineNameSelected,
      // childKey:string
      "subway_station_list"
    );

    if(this.isDebug()) console.log("klass-filter-tile / setSubwayStation / subwayStationList : ",subwayStationList);

    let subwayStationEngList:any =
    this.watchTower.getMyConst().getNestedChildList(
      // parentKey:string, 
      "subway_line_list",
      // parentValue:string, 
      subwayLineNameSelected,
      // childKey:string
      "subway_station_eng_list"
    );
    let subwayStationKorList:any =
    this.watchTower.getMyConst().getNestedChildList(
      // parentKey:string, 
      "subway_line_list",
      // parentValue:string, 
      subwayLineNameSelected,
      // childKey:string
      "subway_station_kor_list"
    );
    let subwayStationImgList:any =
    this.watchTower.getMyConst().getNestedChildList(
      // parentKey:string, 
      "subway_line_list",
      // parentValue:string, 
      subwayLineNameSelected,
      // childKey:string
      "subway_station_img_list"
    );

    let klassSubwayStationObjList:KlassSubwayStation[] = [];
    for (var i = 0; i < subwayStationList.length; ++i) {
      // code...
      let key:string = subwayStationList[i];
      let name_eng:string = subwayStationEngList[i];
      let name_kor:string = subwayStationKorList[i];
      let img_url:string = subwayStationImgList[i];

      let klassSubwayStation:KlassSubwayStation = 
      new KlassSubwayStation(key,name_eng,name_kor,img_url);

      klassSubwayStationObjList.push(klassSubwayStation);
    }
    this.klassSubwayStations = klassSubwayStationObjList;

    if(this.isDebug()) console.log("klass-filter-tile / setSubwayStation / this.klassSubwayStations : ",this.klassSubwayStations);

    if(this.myArray.isOK(this.klassSubwayStations)) {
      // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
      for (var i = 0; i < this.klassSubwayStations.length; ++i) {
        let nextObj:KlassSubwayStation = this.klassSubwayStations[i];
        nextObj.selectableList = this.klassSubwayStations;
        nextObj.focusIdx = this.focusIdxKlassSubwayStation;
      } // end for      
      this.klassSubwayStationSelected = this.klassSubwayStations[0];
    }
  }  

  private setDay() {

    if(this.isDebug()) console.log("klass-filter-tile / setDay / 시작");

    if(!this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-filter-tile / setDay / 중단 / !IsViewPackReady() : ",!this.watchTower.getIsViewPackReady());
      return;
    }

    // klass Day
    let klassDayList:string[] = 
    this.watchTower.getMyConst().getList("class_days_list");
    let klassDayEngList:string[] = 
    this.watchTower.getMyConst().getList("class_days_eng_list");
    let klassDayKorList:string[] = 
    this.watchTower.getMyConst().getList("class_days_kor_list");
    let klassDayImgList:string[] = 
    this.watchTower.getMyConst().getList("class_days_img_url_list");

    let klassDayObjList:KlassDay[] = [];
    for (var i = 0; i < klassDayList.length; ++i) {
      // code...
      let key:string = klassDayList[i];
      let name_eng:string = klassDayEngList[i];
      let name_kor:string = klassDayKorList[i];
      let img_url:string = klassDayImgList[i];

      let klassDay:KlassDay = 
      new KlassDay(key,name_eng,name_kor,img_url);

      klassDayObjList.push(klassDay);
    }  
    this.klassDays = klassDayObjList;
    if(this.myArray.isOK(this.klassDays)) {
      // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
      for (var i = 0; i < this.klassDays.length; ++i) {
        let nextObj:KlassDay = this.klassDays[i];
        nextObj.selectableList = this.klassDays;
        nextObj.focusIdx = this.focusIdxKlassDay;
      }
      this.klassDaySelected = this.klassDays[0];
    }
  } // end method

  private setTime():void {

    if(this.isDebug()) console.log("klass-filter-tile / setTime / 시작");

    if(!this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-filter-tile / setTime / 중단 / !IsViewPackReady() : ",!this.watchTower.getIsViewPackReady());
      return;
    }

    // klass Time
    let klassTimeList:string[] = 
    this.watchTower.getMyConst().getList("class_times_list");
    let klassTimeEngList:string[] = 
    this.watchTower.getMyConst().getList("class_times_eng_list");
    let klassTimeKorList:string[] = 
    this.watchTower.getMyConst().getList("class_times_kor_list");
    let klassTimeHHMMList:string[] = 
    this.watchTower.getMyConst().getList("class_times_hh_mm_list");
    let klassTimeImgList:string[] = 
    this.watchTower.getMyConst().getList("class_times_img_url_list");

    let klassTimeObjList:KlassTime[] = [];
    for (var i = 0; i < klassTimeList.length; ++i) {
      // code...
      let key:string = klassTimeList[i];
      let name_eng:string = klassTimeEngList[i];
      let name_kor:string = klassTimeKorList[i];
      let hh_mm:string = klassTimeHHMMList[i];
      let img_url:string = klassTimeImgList[i];

      let klassTime:KlassTime = 
      new KlassTime(key,name_eng,name_kor,hh_mm,img_url);

      klassTimeObjList.push(klassTime);
    }
    this.klassTimes = klassTimeObjList;
    if(this.myArray.isOK(this.klassTimes)) {
      // 선택할 수 있는 selectile 리스트 참조를 각 selectile 객체에 줍니다.
      for (var i = 0; i < this.klassTimes.length; ++i) {
        let nextObj:KlassTime = this.klassTimes[i];
        nextObj.selectableList = this.klassTimes;
        nextObj.focusIdx = this.focusIdxKlassTime;
      }
      this.klassTimeSelected = this.klassTimes[0];
    } // end if

  } // end method
   

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

    if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / 시작");

    if(selectile.class_name !== "empty") {
      if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / 중단 / selectile.class_name !== \"empty\"");
      return;
    }
    if(this.isEnterST) {
      if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / 중단 / 이미 selectile에 들어왔습니다.");
      return;
    }

    let selectableList:any = selectile["selectableList"];
    if(this.myArray.isNotOK(selectableList)) {
      if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / 중단 / this.myArray.isNotOK(selectableList)");
      this.leaveTable();
      return;
    }
    if(selectableList.length < 2) {
      if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / 중단 / selectableList.length < 2");
      this.leaveTable();
      return;
    }

    if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / selectile : ",selectile);
    if(this.isDebug()) console.log("klass-filter-tile / enterSelectile / selectableList : ",selectableList);

    this.isEnterST = true;
    if(selectile && selectableList) {
      this.showSelectile(selectile["selectableList"], selectile, selectile["focusIdx"]);
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
  updateShowingSelectilesAll( klassLevel:KlassLevel, 
                              klassSubwayLine:KlassSubwayLine, 
                              klassSubwayStation:KlassSubwayStation, 
                              klassDay:KlassDay, 
                              klassTime:KlassTime):void {

    if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 시작");

    if(null == klassLevel){
      if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassLevel is not valid!");
      return;
    } 
    if(null == klassSubwayLine){
      if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassSubwayLine is not valid!");
      return;
    } 
    if(null == klassSubwayStation){
      if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassSubwayStation is not valid!");
      return;
    }
    if(null == klassDay){
      if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassDay is not valid!");
      return;
    } 
    if(null == klassTime){
      if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / 중단 / klassTime is not valid!");
      return;
    } 

    this.selectileTable;

    // 선택된 필드들을 검색, 지정한다.
    for (var i = 0; i < this.klassLevels.length; ++i) {
      let target:KlassLevel = this.klassLevels[i];
      if(target.isSharing("key", klassLevel)) {
        if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / KlassLevel : ",target);
        this.klassLevelSelected = target;
      }
    } // end for
    for (var i = 0; i < this.klassSubwayLines.length; ++i) {
      let target:KlassSubwayLine = this.klassSubwayLines[i];
      if(target.isSharing("key", klassSubwayLine)) {
        if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / KlassSubwayLine : ",target);
        this.klassSubwayLineSelected = target;
      }
    } // end for
    for (var i = 0; i < this.klassSubwayStations.length; ++i) {
      let target:KlassSubwayStation = this.klassSubwayStations[i];
      if(target.isSharing("key", klassSubwayStation)) {
        if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / KlassSubwayStation : ",target);
        this.klassSubwayStationSelected = target;
      }
    } // end for
    for (var i = 0; i < this.klassDays.length; ++i) {
      let target:KlassDay = this.klassDays[i];
      if(target.isSharing("key", klassDay)) {
        if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / KlassDay : ",target);
        this.klassDaySelected = target;
      }
    } // end for
    for (var i = 0; i < this.klassTimes.length; ++i) {
      let target:KlassTime = this.klassTimes[i];
      if(target.isSharing("key", klassTime)) {
        if(this.isDebug()) console.log("klass-filter-tile / updateShowingSelectilesAll / KlassTime : ",target);
        this.klassTimeSelected = target;
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
      
    } else if(selectile instanceof KlassSubwayLine) {

      if(null == this.klassSubwayLineSelected || this.klassSubwayLineSelected.key !== selectile.key) {
        this.klassSubwayLineSelected = selectile;  
        hasChanged = true;

        // wonder.jung
        // 지하철 노선이 변경되었습니다. 이에 맞게 지하철 역 리스트가 변경되어야 합니다.
        this.setSubwayStation(selectile.key);
      }

    } else if(selectile instanceof KlassSubwayStation) {

      if(null == this.klassSubwayStationSelected || this.klassSubwayStationSelected.key !== selectile.key) {
        this.klassSubwayStationSelected = selectile;  
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

    if(this.isDebug()) console.log("klass-filter-tile / emitEventOnChange / 시작");
    if(null == value) {
      if(this.isDebug()) console.log("klass-filter-tile / emitEventOnChange / 중단 / value is not valid!");
      return;
    }
    if(null == metaObj) {
      if(this.isDebug()) console.log("klass-filter-tile / emitEventOnChange / 중단 / metaObj is not valid!");
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

    if(this.isDebug()) console.log("klass-filter-tile / emitEventOnChange / Done!");

  } 
  private emitEventOnReady() :void {

    if(this.isDebug()) console.log("klass-filter-tile / emitEventOnReady / 시작");

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

    if(this.isDebug()) console.log("klass-filter-tile / emitEventOnChange / Done!");

  }    
  // emitOnChangedSelectile
  public getFocusedSelectiles() :any {
    var selectileMap = 
    {
      level:this.klassLevelSelected,
      subwayLine:this.klassSubwayLineSelected,
      subwayStation:this.klassSubwayStationSelected,
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

    if(this.isDebug()) console.log("klass-filter-file / constructor / init");

    if(this.isDebug()) console.log("klass-filter-file / constructor / this.klassLevelSelected : ",this.klassLevelSelected);
    if(this.isDebug()) console.log("klass-filter-file / constructor / this.klassSubwayLineSelected : ",this.klassSubwayLineSelected);
    if(this.isDebug()) console.log("klass-filter-file / constructor / this.klassSubwayStationSelected : ",this.klassSubwayStationSelected);
    if(this.isDebug()) console.log("klass-filter-file / constructor / this.klassDaySelected : ",this.klassDaySelected);
    if(this.isDebug()) console.log("klass-filter-file / constructor / this.klassTimeSelected : ",this.klassTimeSelected);

    // 사용자가 선택한 필터를 보여주는 열(Row)
    let nextSelectileTable:any[] = [];
    var row:any[] = [];

    this.klassLevelSelected["class_name"] = "empty";
    row.push(this.klassLevelSelected);
    this.klassSubwayLineSelected["class_name"] = "empty";
    row.push(this.klassSubwayLineSelected);
    this.klassSubwayStationSelected["class_name"] = "empty";
    row.push(this.klassSubwayStationSelected);
    this.klassDaySelected["class_name"] = "empty";
    row.push(this.klassDaySelected);
    this.klassTimeSelected["class_name"] = "empty";
    row.push(this.klassTimeSelected);

    nextSelectileTable.push(row);

    // 화면에 보여줄 column 갯수를 결정
    let stColCntPerRow:number = row.length;
    if(!(0 < stColCntPerRow)) {
      if(this.isDebug()) console.log("klass-filter-file / constructor / 중단 / !(0 < stColCntPerRow)");
      return;
    }

    if(this.isDebug()) console.log("klass-filter-file / constructor / stColCntPerRow : ",stColCntPerRow);

    this.updateLayout(stColCntPerRow);

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
    let rowCnt = Math.ceil(elementCnt/stColCntPerRow);

    for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {

      var row:any[] = [];
      for (var colIdx = 0; colIdx < stColCntPerRow; colIdx++) {

        let curIdx = stColCntPerRow * (rowIdx) + colIdx;
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

    nextSelectileTable = this.setSelectileType(nextSelectileTable, focusIdx, stColCntPerRow);

    this.selectileTable = nextSelectileTable;
    this.setShadowRows(this.selectileTable);
  }
  private setSelectileType(targetList:any[], curSelectileIdx:number, stColCntPerRow:number) :any[] {

    if(this.isDebug()) console.log("klass-filter-file / setSelectileType / 시작");

    if(!targetList) {
      if(this.isDebug()) console.log("klass-filter-file / setSelectileType / 중단 / !targetList");
      return;
    }

    if(!(0 < stColCntPerRow)) {
      if(this.isDebug()) console.log("klass-filter-file / setSelectileType / 중단 / !(0 < stColCntPerRow)");
      return;
    }

    if(this.isDebug()) console.log("klass-filter-file / setSelectileType / curSelectileIdx : ",curSelectileIdx);
    if(this.isDebug()) console.log("klass-filter-file / setSelectileType / stColCntPerRow : ",stColCntPerRow);

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
          } else if(colIdx === (stColCntPerRow - 1) && curSelectileIdx === colIdx) {
            // 2-2. 마지막 컬럼이면서 knob이 연결되어 있는가?
            field["class_name"] = "right-round-knob";
          } else if(colIdx === (stColCntPerRow - 1)) {
            // 2-3. 마지막 컬럼인가?
            field["class_name"] = "right-round";
          } else if(curSelectileIdx === colIdx) {
            // 2-3. 첫번째와 마지막 컬럼이 아니지만 knob과 연결되어 있는가?
            field["class_name"] = "top-knob";
          } else {
            // 2-5. 다른 타일에 둘러싸여있는 타일인가?
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

            } else if(curSelectileIdx == colIdx && colIdx === (stColCntPerRow - 1)) {
              // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
              field["class_name"] = "center";
              
            } else if(colIdx === (stColCntPerRow - 1)) {
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
            } else if(colIdx === (stColCntPerRow - 1)) {
              // 2-2. 마지막 컬럼인가?
              field["class_name"] = "bottom-right";
            } else {
              field["class_name"] = "bottom";
            }

          } else {

            // 첫번재 열인경우.
            if(0 == colIdx) {
              field["class_name"] = "left-single";
            } else if(colIdx === (stColCntPerRow - 1)) {
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