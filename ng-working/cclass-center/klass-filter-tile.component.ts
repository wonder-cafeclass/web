import { Component, OnInit }      from '@angular/core';
import { Location }               from '@angular/common';

import { KlassService }                    from './klass.service';

import { KlassLevel }                      from './klass-level';
import { KlassStation }                    from './klass-station';
import { KlassDay }                        from './klass-day';
import { KlassTime }                       from './klass-time';

import { KlassSelectile }                  from './klass-selectile';
import { KlassSelectileRow }                  from './klass-selectile-row';

@Component({
  selector: 'klass-filter-tile',
  templateUrl: './ng-working/cclass-center/klass-filter-tile.component.html',
  styleUrls: [ './ng-working/cclass-center/klass-filter-tile.component.css' ]
})
export class KlassFilterTileComponent implements OnInit {

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

  selectileTable: KlassSelectileRow[];
  selectileShadowRows: KlassSelectileRow[];

  stColCntPerRow:number = 4; // selectile에 선택지를 열(Row)당 4개씩 노출

  constructor(
    private service: KlassService,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.service.getKlassSelectile().then(selectileInfo => {

      this.setLevel(selectileInfo["levels"]);
      this.setStation(selectileInfo["stations"]);
      this.setDay(selectileInfo["days"]);
      this.setTime(selectileInfo["times"]);

      this.showSelectile(null, null, -1);    

    });

  }
  private setTime(times:any[]) {

    var nextObjList:KlassTime[] = [];
    for (var i = 0; i < times.length; ++i) {
      var nextObj = times[i];
      var klassTime = 
      new KlassTime(
        nextObj.key, 
        nextObj.img_url
      );
      nextObjList.push(klassTime);
    }
    this.klassTimes = nextObjList;

    if(this.klassTimes && !this.klassTimeSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassTimeSelected = this.klassTimes[0];
      this.klassTimeSelected["parent_list"] = this.klassTimes;
      this.klassTimeSelected["focus_idx"] = 3;
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

    if(this.klassDays && !this.klassDaySelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassDaySelected = this.klassDays[0];
      this.klassDaySelected["parent_list"] = this.klassDays;
      this.klassDaySelected["focus_idx"] = 2;
    }
  }  
  private setStation(stations:any[]) {

    var nextObjList:KlassStation[] = [];
    for (var i = 0; i < stations.length; ++i) {
      var nextObj = stations[i];
      var klassStation = 
      new KlassStation(
        nextObj.key, 
        nextObj.img_url
      );
      nextObjList.push(klassStation);
    }
    this.klassStations = nextObjList;

    if(this.klassStations && !this.klassStationSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassStationSelected = this.klassStations[0];
      this.klassStationSelected["parent_list"] = this.klassStations;
      this.klassStationSelected["focus_idx"] = 1;
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

    if(this.klassLevels && !this.klassLevelSelected) {
      // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
      this.klassLevelSelected = this.klassLevels[0];
      this.klassLevelSelected["parent_list"] = this.klassLevels;
      this.klassLevelSelected["focus_idx"] = 0;
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
    if(selectile && selectile["parent_list"]) {
      this.showSelectile(selectile["parent_list"], selectile, selectile["focus_idx"]);    
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
  clickSelectile(selectile) :void {
    console.log("clickSelectile / selectile ::: ",selectile);

    if(selectile instanceof KlassLevel) {
      this.klassLevelSelected = selectile;
    } else if(selectile instanceof KlassStation) {
      this.klassStationSelected = selectile;
    } else if(selectile instanceof KlassDay) {
      this.klassDaySelected = selectile;
    } else if(selectile instanceof KlassTime) {
      this.klassTimeSelected = selectile;
    }

    // wonder.jung - 새로운 선택 객체를 만든 뒤에 이벤트를 설정. 선택 창은 내린다.
  }
  private setShadowRows(targetList:any[]) :void {
    if(1 < targetList.length) {
      this.selectileShadowRows = targetList.slice(1, targetList.length);
    } else {
      this.selectileShadowRows = null;
    }
  }
  private showSelectile(targetList:any[], targetObj:any, focusIdx:number) :void {

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

    if(!targetList) {
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

  nextLevel() :void {
    let selectedIdx = this.getSelectedIdx(this.klassLevels, "key", this.klassLevelSelected.key);
    this.klassLevelSelected = this.getNextElement(this.klassLevels, selectedIdx);
    this.klassLevelSelected["parent_list"] = this.klassLevels;

    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 수업 리스트 API Call! - 
    // this.service.getKlassList(this.klassLevelSelected.key, "").then(cclasses => this.cclasses = cclasses);

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overLevel() :void {
    // 관련 selectile을 보여줍니다.
    this.showSelectile(this.klassLevels, null, -1);
  }


  nextStation() :void {
    let selectedIdx = this.getSelectedIdx(this.klassStations, "key", this.klassStationSelected.key);
    this.klassStationSelected = this.getNextElement(this.klassStations, selectedIdx);
    this.klassStationSelected["parent_list"] = this.klassStations;
    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 지하철 역이 변경된다.
    // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overStation() :void {
    this.showSelectile(this.klassStations, null, -1);
  }


  nextDay() :void {
    let selectedIdx = this.getSelectedIdx(this.klassDays, "key", this.klassDaySelected.key);
    this.klassDaySelected = this.getNextElement(this.klassDays, selectedIdx);
    this.klassDaySelected["parent_list"] = this.klassDays;

    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 수업 요일이 변경된다.
    // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overDay() :void {
    this.showSelectile(this.klassDays, null, -1);
  }


  nextTime() :void {
    console.log("TEST / nextTime");

    let selectedIdx = this.getSelectedIdx(this.klassTimes, "key", this.klassTimeSelected.key);
    this.klassTimeSelected = this.getNextElement(this.klassTimes, selectedIdx);
    this.klassTimeSelected["parent_list"] = this.klassTimes;

    // 수업 시간이 변경된다.
    // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overTime() :void {
    this.showSelectile(this.klassTimes, null, -1);
  }
}