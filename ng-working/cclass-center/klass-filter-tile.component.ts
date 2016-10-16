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
  // Selectile
  klassSelectiles: KlassSelectile[];
  klassSelectileSelected: KlassSelectile; // 사용자가 선택한 클래스 레벨  
  ksKnob: KlassSelectile;
  ksCenter: KlassSelectile;
  ksTopRight: KlassSelectile;
  ksTopLeft: KlassSelectile;
  ksBottomRight: KlassSelectile;
  ksBottomLeft: KlassSelectile;
  ksRightSingle: KlassSelectile;
  ksEmpty: KlassSelectile;

  // selectileTable: KlassSelectileRow[];
  selectileTable: Array<KlassSelectileRow>;

  selectileColumnCnt:number = 4; // selectile에 선택지를 열(Row)당 4개씩 노출

  constructor(
    private service: KlassService,
    private location: Location
  ) {}

  ngOnInit(): void {

    // TODO - 아래 이미지 주소를 가져오기 위해 5번의 통신이 필요하다. 1번으로 압축~!

    // 모든 레벨의 key를 가져온다.
    // 모든 레벨의 이미지 주소를 가져온다.
    this.service.getKlassLevel().then(klassLevels => {
      this.klassLevels = klassLevels;
      if(!this.klassLevelSelected) {
        // 선택된 클래스 레벨이 없다면 '모든 레벨'로 표시.
        this.klassLevelSelected = this.klassLevels[0];
      }
    });

    // 모든 역의 key를 가져온다.
    // 모든 역의 이미지 주소를 가져온다.
    this.service.getKlassStation().then(klassStations => {
      this.klassStations = klassStations;
      if(!this.klassStationSelected) {
        // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
        this.klassStationSelected = this.klassStations[0];
      }
    });

    // 모든 요일의 key를 가져온다.
    // 모든 요일의 이미지 주소를 가져온다.
    this.service.getKlassDay().then(klassDays => {
      this.klassDays = klassDays;
      if(!this.klassDaySelected) {
        // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
        this.klassDaySelected = this.klassDays[0];
      }
    });

    // 모든 시간의 key를 가져온다.
    // 모든 시간의 이미지 주소를 가져온다.
    this.service.getKlassTime().then(klassTimes => {
      this.klassTimes = klassTimes;
      if(!this.klassTimeSelected) {
        // 선택된 클래스 지하철역이 없다면 '모든 역'으로 표시.
        this.klassTimeSelected = this.klassTimes[0];
      }
    });    

    this.service.getKlassSelectile().then(klassSelectiles => {
      this.klassSelectiles = klassSelectiles;

      let selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "knob");
      if(-1 < selectedIdx) {
        this.ksKnob = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "center");
      if(-1 < selectedIdx) {
        this.ksCenter = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }
      
      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "top_right");
      if(-1 < selectedIdx) {
        this.ksTopRight = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "top_left");
      if(-1 < selectedIdx) {
        this.ksTopLeft = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "bottom_left");
      if(-1 < selectedIdx) {
        this.ksBottomLeft = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "bottom_right");
      if(-1 < selectedIdx) {
        this.ksBottomRight = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "right_single");
      if(-1 < selectedIdx) {
        this.ksRightSingle = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      selectedIdx = this.getSelectedIdx(this.klassSelectiles, "key", "empty");
      if(-1 < selectedIdx) {
        this.ksEmpty = this.klassSelectiles[selectedIdx];  
      } else {
        // Error! 로그를 기록합니다.
        return;
      }

      this.hideSeletile();

    });    

  }

  getSelectedIdx(targetList:any[], key:string, value:string):number {

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

  getNextElement(targetList:any[], prevIdx:number):any {
    let nextElement = null;
    if(prevIdx === (targetList.length - 1)) {
      nextElement = targetList[0];
    } else {
      nextElement = targetList[prevIdx + 1];
    }

    return nextElement;
  } 

  hideSeletile() :void {
    // seletile을 숨깁니다. 
    // 현재 선택한 필터만 노출합니다.


  }

  showSeletile(targetList:any[], curSelectileIdx:number) :void {

    if(!targetList) {
      return;
    }

    let elementCnt:number = targetList.length;
    let rowCnt = Math.ceil(elementCnt/this.selectileColumnCnt) + 1;

    let nextSelectileTable = [];
    for (var rowIdx = 0; rowIdx < rowCnt; rowIdx++) {
      // wonder.jung

      var row = new KlassSelectileRow();
      for (var colIdx = 0; colIdx < this.selectileColumnCnt; colIdx++) {

        if(0 === rowIdx) {
          // 1. 첫번째 열은 현재 선택한 값을 보여줍니다.
          if(curSelectileIdx === colIdx) {
            // 사용자가 mouseover한 선택 카테고리입니다.
            row.add(this.ksKnob);
          } else {
            row.add(this.ksEmpty);
          }

        } else if(rowCnt == 2 && elementCnt <= this.selectileColumnCnt) {

          // 2. 사용자가 선택할 수 있는 항목이 1개의 열(row)에 모두 포함되는 경우.
          if(colIdx === 0) {
            // 2-1. 첫번째 컬럼인가?
            row.add(this.ksBottomLeft);
          } else if(colIdx === (this.selectileColumnCnt - 1)) {
            // 2-2. 마지막 컬럼인가?
            row.add(this.ksRightSingle);
          } else {
            row.add(this.ksCenter);
          }

        } else {

          // 3. 사용자가 선택할 수 있는 항목이 2개 이상의 열(row)에 모두 포함되는 경우.
          if(rowIdx === 1) {

            // 3-1. 첫번째 선택열인가?
            if(curSelectileIdx == colIdx && 0 == colIdx) {
              // 첫번째 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
              row.add(this.ksCenter);

            } else if(curSelectileIdx != colIdx && 0 == colIdx) {
              // 첫번째 컬럼에 knob이 없는 경우, 첫번째 컬럼은 top-left
              row.add(this.ksTopLeft);

            } else if(curSelectileIdx == colIdx && colIdx === (this.selectileColumnCnt - 1)) {
              // 마지막 컬럼에 knob이 있는 경우, 첫번째 컬럼은 center
              row.add(this.ksCenter);
              
            } else if(colIdx === (this.selectileColumnCnt - 1)) {
              // 2-2. 마지막 컬럼인가?
              row.add(this.ksTopRight);
            } else {
              row.add(this.ksCenter);
            }

          } else if(rowIdx === (rowCnt - 1)) {
            // 3-1. 마지막 열인가?
            if(colIdx === 0) {
              // 2-1. 첫번째 컬럼인가?
              row.add(this.ksBottomLeft);
            } else if(colIdx === (this.selectileColumnCnt - 1)) {
              // 2-2. 마지막 컬럼인가?
              row.add(this.ksBottomRight);
            } else {
              row.add(this.ksCenter);
            }
          } else {
            // 3-2. 마지막 열보다 이전인가?
            row.add(this.ksCenter);
          } // end inner if
          
        } // end if

      } // end inner for
      nextSelectileTable.push(row);

    } // end outer for

    this.selectileTable = nextSelectileTable;

    this.hasEnteredSeletile = true;
  } 
  leaveSelector() :void {
    if(this.hasEnteredSeletile) {
      return;
    }
    this.selectileTable = null;
  }
  hasEnteredSeletile:boolean=false;
  leaveSelectile() :void {
    this.hasEnteredSeletile = false;
    this.leaveSelector();
  }
  outSelectile() :void {
    this.leaveSelectile()
  }

  nextLevel() :void {
    let selectedIdx = this.getSelectedIdx(this.klassLevels, "key", this.klassLevelSelected.key);
    this.klassLevelSelected = this.getNextElement(this.klassLevels, selectedIdx);

    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 수업 리스트 API Call! - 
    // this.service.getKlassList(this.klassLevelSelected.key, "").then(cclasses => this.cclasses = cclasses);

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overLevel() :void {
    // 관련 selectile을 보여줍니다.
    this.showSeletile(this.klassLevels, 0);
  }


  nextStation() :void {
    let selectedIdx = this.getSelectedIdx(this.klassStations, "key", this.klassStationSelected.key);
    this.klassStationSelected = this.getNextElement(this.klassStations, selectedIdx);

    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 지하철 역이 변경된다.
    // 변경된 지하철 역에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overStation() :void {
    this.showSeletile(this.klassStations, 1);
    // this.showSeletile(this.klassLevels, 1);
  }


  nextDay() :void {
    let selectedIdx = this.getSelectedIdx(this.klassDays, "key", this.klassDaySelected.key);
    this.klassDaySelected = this.getNextElement(this.klassDays, selectedIdx);

    // 값이 변경되었다면, 검색 버튼을 활성화해서 검색이 가능한 것을 유저에게 알려줍니다.

    // 수업 요일이 변경된다.
    // 변경된 수업 요일에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overDay() :void {
    this.showSeletile(this.klassDays, 2);
    // this.showSeletile(this.klassLevels, 2);
  }


  nextTime() :void {
    console.log("TEST / nextTime");

    let selectedIdx = this.getSelectedIdx(this.klassTimes, "key", this.klassTimeSelected.key);
    this.klassTimeSelected = this.getNextElement(this.klassTimes, selectedIdx);


    // 수업 시간이 변경된다.
    // 변경된 수업 시간에 따라 수업 리스트가 달라져야 한다.

    // 수업 리스트 API Call!

    // 부모 컴포넌트에게 변경된 검색 값을 전달해야 합니다. / 컴포넌트간의 통신
  }
  overTime() :void {
    this.showSeletile(this.klassTimes, 3);
    // this.showSeletile(this.klassLevels, 3);
  }


}