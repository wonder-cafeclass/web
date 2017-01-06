import { Component, 
         OnInit, 
         Input, 
         Output, 
         ViewChild,
         EventEmitter }                from '@angular/core';

import { Router }                      from '@angular/router';

import { AdminService }                from './service/admin.service';

import { Klass }                       from '../klass/model/klass';
import { Teacher }                     from '../teachers/model/teacher';
import { User }                        from '../users/model/user';

import { DefaultMeta }                 from '../widget/input/default/model/default-meta';
import { DefaultType }                 from '../widget/input/default/model/default-type';
import { DefaultOption }               from '../widget/input/default/model/default-option';
import { DefaultComponent }            from '../widget/input/default/default.component';
import { CheckBoxComponent }           from '../widget/checkbox/checkbox.component';
import { Pagination }                  from '../widget/pagination/model/pagination';

import { MyEventService }              from '../util/service/my-event.service';
import { MyCheckerService }            from '../util/service/my-checker.service';
import { MyEventWatchTowerService }    from '../util/service/my-event-watchtower.service';
import { MyEvent }                     from '../util/model/my-event';
import { MyResponse }                  from '../util/model/my-response';

import { HelperMyIs }                  from '../util/helper/my-is';
import { HelperMyTime }                from '../util/helper/my-time';
import { HelperMyArray }               from '../util/helper/my-array';
import { HelperMyFormat }              from '../util/helper/my-format';

@Component({
  moduleId: module.id,
  selector: 'manage-klasses',
  templateUrl: 'manage-klasses.component.html',
  styleUrls: [ 'manage-klasses.component.css' ]
})
export class ManageKlassesComponent implements OnInit {

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;
  private myFormat:HelperMyFormat;
  private defaultType:DefaultType;
  private defaultMetaStatus:DefaultMeta;
  private defaultMetaStatusForSearch:DefaultMeta;
  private defaultMetaLevelForSearch:DefaultMeta;
  private defaultMetaSubwayLineForSearch:DefaultMeta;
  private defaultMetaSubwayStationForSearch:DefaultMeta;
  private defaultMetaDaysForSearch:DefaultMeta;
  private defaultMetaTimeForSearch:DefaultMeta;
  private defaultMetaSearchQuery:DefaultMeta;

  private checkboxKlassDays:DefaultComponent;

  private loginUser:User;

  private checkBoxList:CheckBoxComponent[]=[];

  klassList:Klass[];
  pagination:Pagination;

  private searchQuery:string="";
  private klassStatus:string="";
  private klassLevel:string="";
  private klassSubwayLine:string="";
  private klassDays:string="";
  private klassTime:string="";
  // @ Immutable
  private pageNum:number = 1; 
  // @ Immutable
  private pageRange:number = 5;

  selectOptionListStatus:DefaultOption[];

  selectOptionListLevel:DefaultOption[];
  selectOptionListSubwayLine:DefaultOption[];
  selectOptionListSubwayStation:DefaultOption[];
  selectOptionListDay:DefaultOption[];
  selectOptionListTime:DefaultOption[];

  checkOptionTableDays:DefaultOption[][];

  // 자신의 자식 객체에서 이벤트를 받는다.
  constructor(  private adminService:AdminService,
                private myEventService:MyEventService,
                private watchTower:MyEventWatchTowerService,
                private router:Router ) {

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();
    this.myFormat = new HelperMyFormat();
    this.defaultType = new DefaultType();

    this.defaultMetaSearchQuery = this.getMetaSearchInput();

    this.pagination = new Pagination();

    this.defaultMetaStatus = this.getMetaSelectKlassStatus();

    this.defaultMetaStatusForSearch = this.getMetaStatusForSearch();
    this.defaultMetaLevelForSearch = this.getMetaLevelForSearch();
    this.defaultMetaSubwayLineForSearch = this.getMetaSubwayLineForSearch();
    this.defaultMetaSubwayStationForSearch = this.getMetaSubwayStationForSearch();
    this.defaultMetaDaysForSearch = this.getMetaDaysForSearch();
    this.defaultMetaTimeForSearch = this.getMetaTimeForSearch();

    this.selectOptionListStatus = this.getDefaultOptionStatusForSearch();
    this.selectOptionListLevel = this.getDefaultOptionLevelForSearch();
    this.selectOptionListSubwayLine = this.getDefaultOptionSubwayLineForSearch();
    this.checkOptionTableDays = this.getDefaultOptionDaysForSearch();
    this.selectOptionListTime = this.getDefaultOptionTimeForSearch();

    this.subscribeLoginUser();
    this.subscribeEventPack();

  } // end constructor

  ngOnInit():void {
  }

  private isDebug():boolean {
    return this.watchTower.isDebug();
  }

  private getMetaSelectKlassStatus():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "수업 상태",
      // public placeholder:string
      "수업 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_STATUS,
      // public checkerKey:string
      "klass_status",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }

  private getMetaSearchInput():DefaultMeta{
    return new DefaultMeta( // 2
      // public title:string
      "검색",
      // public placeholder:string
      "검색어를 입력해주세요",
      // public eventKey:string
      this.myEventService.KEY_SEARCH_QUERY,
      // public checkerKey:string
      "search_query",
      // public type:string
      this.defaultType.TYPE_INPUT
    );
  } 

  private getMetaStatusForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 수업 상태",
      // public placeholder:string
      "검색 조건 - 수업 상태를 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_STATUS_FOR_SEARCH,
      // public checkerKey:string
      "klass_status",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }

  private getMetaLevelForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 수업 레벨",
      // public placeholder:string
      "검색 조건 - 수업 레벨을 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_LEVEL_FOR_SEARCH,
      // public checkerKey:string
      "klass_level_for_search",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }       

  private getMetaSubwayLineForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 지하철 노선",
      // public placeholder:string
      "검색 조건 - 지하철 노선을 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_SUBWAY_LINE_FOR_SEARCH,
      // public checkerKey:string
      "klass_subway_line",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }       

  private getMetaSubwayStationForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 지하철 역",
      // public placeholder:string
      "검색 조건 - 지하철 역을 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_SUBWAY_STATION_FOR_SEARCH,
      // public checkerKey:string
      "klass_subway_station",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }       

  private getMetaDaysForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 요일",
      // public placeholder:string
      "검색 조건 - 요일을 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH,
      // public checkerKey:string
      "klass_subway_station",
      // public type:string
      this.defaultType.TYPE_CHECKBOX
    );
  }

  private getMetaTimeForSearch():DefaultMeta{
    return new DefaultMeta( // 5
      // public title:string
      "검색 조건 - 시간",
      // public placeholder:string
      "검색 조건 - 시간을 선택해주세요",
      // public eventKey:string
      this.myEventService.KEY_KLASS_TIME_FOR_SEARCH,
      // public checkerKey:string
      "klass_subway_station",
      // public type:string
      this.defaultType.TYPE_SELECT
    );
  }
  private subscribeLoginUser() :void {

    if(this.isDebug()) console.log("manage-klasses / subscribeLoginUser / init");

    this.loginUser = this.watchTower.getLoginUser();

    if(null == this.loginUser || !this.loginUser.isAdminUser()) {
      this.goHome();
    } // end if

    this.init();
  } // end method

  private goHome() :void {
    if(this.isDebug()) console.log("manage-klasses / goHome / init");
    this.router.navigate(["/"]);
  }

  private subscribeEventPack() :void {

    if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / init");

    let isEventPackReady:boolean = this.watchTower.getIsEventPackReady();
    if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / isEventPackReady : ",isEventPackReady);

    if(this.watchTower.getIsEventPackReady()) {
      this.init();
    } else {
      // 2. EventPack 로딩이 완료되지 않았습니다. 로딩을 기다립니다.
      this.watchTower.isEventPackReady$.subscribe(
        (isEventPackReady:boolean) => {

        if(this.isDebug()) console.log("manage-klasses / subscribeEventPack / isEventPackReady : ",isEventPackReady);
        this.init();

      }); // end subscribe

    } // end if

  } // end method

  init() :void {

    if(this.isDebug()) console.log("manage-klasses / init / 시작");

    this.doFetchKlassList();

  } // end method

  private getDefaultOptionKlassListStatus(klass:Klass):DefaultOption[] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionKlassListStatus / 시작");

    let defaultOptionList:DefaultOption[] = 
    this.watchTower.getDefaultOptionListWithMetaByKeys(
      // keyListName:string,
      "class_status_kor_list",
      // valueListName:string,
      "class_status_list",
      // valueFocus:string,
      klass.status,
      // metaObj:any
      klass
    );
    if(this.myArray.isOK(defaultOptionList)) {
      // "모든 상태" - 기본값 을 제거함.
      defaultOptionList.shift();
    }

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionKlassListStatus / defaultOptionList : ",defaultOptionList);

    return defaultOptionList;
    
  } // end method

  // @ Desc : 검색을 위한 유저 상태 default option list - select box 
  private getDefaultOptionStatusForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionStatusForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "class_status_kor_list",
      // valueListName:string,
      "class_status_list",
      // valueFocus:string
      ""
    );

  } // end method

  private getDefaultOptionLevelForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionLevelForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "class_level_kor_list",
      // valueListName:string,
      "class_level_list",
      // valueFocus:string
      ""
    );

  } // end method

  private getDefaultOptionSubwayLineForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionSubwayLineForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "subway_line_kor_list",
      // valueListName:string,
      "subway_line_list",
      // valueFocus:string
      ""
    );

  } // end method

  private getDefaultOptionDaysForSearch():DefaultOption[][] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionDaysForSearch / 시작");

    let optionList:DefaultOption[] =
    this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "class_days_kor_list",
      // valueListName:string,
      "class_days_list",
      // valueFocus:string
      ""
    );

    if(this.myArray.isOK(optionList)) {
      optionList.shift();
    }

    // 기본 값은 모든 요일을 조회. 모두 선택되도록 변경.
    for (var i = 0; i < optionList.length; ++i) {
      let option:DefaultOption = optionList[i];
      option.isFocus = true;
    }

    return [optionList];

  } // end method

  private getDefaultOptionTimeForSearch():DefaultOption[] {

    if(this.isDebug()) console.log("manage-klasses / getDefaultOptionDaysForSearch / 시작");

    return this.watchTower.getDefaultOptionListByKeys(
      // keyListName:string,
      "class_times_kor_list",
      // valueListName:string,
      "class_times_list",
      // valueFocus:string
      ""
    );

  } // end method


  private updatePagination(jsonPagination:any) :void {

    if(this.isDebug()) console.log("manage-klasses / updatePagination / 시작");

    if(this.isDebug()) console.log("manage-klasses / updatePagination / jsonPagination : ",jsonPagination);

    if(null == jsonPagination) {
      this.pagination = null;
    } else {
      this.pagination = new Pagination().setJSON(jsonPagination);
    }
  }

  private updateKlassList(jsonKlassList:any[]) :void {

    if(this.isDebug()) console.log("manage-klasses / updateKlassList / 시작");

    if(this.myArray.isNotOK(jsonKlassList)) {

      // 검색 결과가 없습니다.
      this.klassList = null;

    } else {

      let klassList:Klass[] = [];
      for (var i = 0; i < jsonKlassList.length; ++i) {
        let klassJSON = jsonKlassList[i];
        let klass:Klass = new Klass().setJSON(klassJSON);

        let defaultOptionListStatus:DefaultOption[] = this.getDefaultOptionKlassListStatus(klass);
        klass["selectOptionListStatus"] = defaultOptionListStatus;

        klassList.push(klass);

      } // end for

      if(this.isDebug()) console.log("manage-klasses / updateKlassList / klassList : ",klassList);

      this.klassList = klassList;
      
    } // end if

  } // end method

  private updateKlassDays():void {

    if(this.isDebug()) console.log("manage-klasses / updateKlassDays / 시작");

    let checkboxList:DefaultOption[] = [];
    if(null != this.checkboxKlassDays) {
      checkboxList = this.checkboxKlassDays.getCheckedDefaultOptionList();
    }

    let klassDays:string = "";
    if(this.myArray.isOK(checkboxList)) {
      for (var i = 0; i < checkboxList.length; ++i) {
        let checkbox:DefaultOption = checkboxList[i];

        if(0 < i) {
          klassDays += "|||" + checkbox.value; // REFACTOR ME
        } else {
          klassDays = checkbox.value;
        } // end if
      } // end for
    }

    this.klassDays = klassDays;

    if(this.isDebug()) console.log("manage-klasses / updateKlassDays / klassDays : ",klassDays);
  }

  // @ Desc : 저장된 변수 값들로 유저 리스트를 가져옵니다.
  private doFetchKlassList():void {

    let pageNum:number = this.pageNum;
    let pageRange:number = this.pageRange;
    if(null != this.pagination) {
      pageNum = this.pagination.pageNum;
      pageRange = this.pagination.pageRange;
    }

    this.fetchKlassList(
      // pageNum:number, 
      pageNum, 
      // pageSize:number, 
      pageRange,
      // searchQuery:string, 
      this.searchQuery,
      // klassStatus:string, 
      this.klassStatus,
      // klassLevel:string="",
      this.klassLevel,
      // klassSubwayLine:string="",
      this.klassSubwayLine,
      // klassDays:string="",
      this.klassDays,
      // klassTime:string=""
      this.klassTime
    );    

  } // end method

  // @ Desc : 유저 리스트를 가져옵니다.
  private fetchKlassList( pageNum:number, 
                          pageSize:number, 
                          searchQuery:string, 
                          klassStatus:string,
                          klassLevel:string,
                          klassSubwayLine:string,
                          klassDays:string,
                          klassTime:string  ) :void {

    this.adminService
    .fetchKlassList(
      // apiKey:string, 
      this.watchTower.getApiKey(), 
      // pageNum:number, 
      pageNum, 
      // pageSize:number, 
      pageSize,
      // searchQuery:string, 
      searchQuery,
      // klassStatus:string, 
      klassStatus,
      // klassLevel:string="",
      klassLevel,
      // klassSubwayLine:string="",
      klassSubwayLine,
      // klassDays:string="",
      klassDays,
      // klassTime:string=""
      klassTime
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-klasses / fetchKlassList / myResponse : ",myResponse);

      if( myResponse.isSuccess() && 
          myResponse.hasDataProp("pagination") &&
          myResponse.hasDataProp("klass_list")) {

        // 1. Pagination 재설정
        let jsonPagination = myResponse.getDataProp("pagination");
        if(this.isDebug()) console.log("manage-klasses / fetchKlassList / jsonPagination : ",jsonPagination);
        this.updatePagination(jsonPagination);

        // 2. Klass List 재설정 
        let klassJSONList:any[] = myResponse.getDataProp("klass_list");
        if(this.isDebug()) console.log("manage-klasses / fetchKlassList / klassJSONList : ",klassJSONList);

        this.updateKlassList(klassJSONList);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-klasses / fetchKlassList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");

        this.watchTower.logAPIError("fetchKlassList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  } // end method



  updateCheckBoxes(checked:boolean) :void {

    if(this.isDebug()) console.log("manage-klasses / updateCheckBoxes / 시작");

    if(this.isDebug()) console.log("manage-klasses / updateCheckBoxes / this.checkBoxList : ",this.checkBoxList);    

    if(this.isDebug()) console.log("manage-klasses / updateCheckBoxes / checked : ",checked);

    for (var i = 0; i < this.checkBoxList.length; ++i) {
      let checkBox:CheckBoxComponent = this.checkBoxList[i];
      checkBox.setIsChecked(checked);
    } // end for

  } // end method

  updateKlassStatus(value:string, klass:Klass) :void {

    if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / 시작");

    if(null == value || "" === value) {
      if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / 중단 / value is not valid!");
      return;
    }
    if(null == klass) {
      if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / 중단 / klass is not valid!");
      return;
    }

    if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / value : ",value);
    if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / klass : ",klass);

    this.adminService
    .updateKlass(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userIdAdmin:number, 
      this.loginUser.id,
      // klassId:number, 
      klass.id,
      // klassStatus:string, 
      value
    )
    .then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {
        if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / success");

      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("manage-klasses / updateKlassStatus / failed");

        this.watchTower.logAPIError("updateKlassStatus has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service

  }


  onClickSearch(event) :void {

    if(this.isDebug()) console.log("manage-klasses / onClickSearch / 시작");

    event.stopPropagation();
    event.preventDefault();

    if(null != this.pagination) {
      this.pagination.pageNum = 1;
    }

    this.doFetchKlassList();

  } // end method

  isDefaultStatus(value:string):boolean {

    if(null == value || "" === value) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListStatus)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListStatus[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === value)?true:false;
  }

  isDefaultLevel(value:string):boolean {

    if(null == value || "" === value) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListLevel)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListLevel[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === value)?true:false;
  }

  isDefaultSubwayLine(value:string):boolean {

    if(null == value || "" === value) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListSubwayLine)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListSubwayLine[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === value)?true:false;
  }  

// REMOVE ME
/*
  isDefaultDay(value:string):boolean {

    if(null == value || "" === value) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListDay)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListDay[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === value)?true:false;
  }  
  */

  isDefaultTime(time:string):boolean {

    if(null == time || "" === time) {
      return false;
    }

    if(this.myArray.isNotOK(this.selectOptionListTime)) {
      return false;
    } // end if

    let defaultOption:DefaultOption = this.selectOptionListTime[0];
    if(null == defaultOption) {
      return false;
    } // end if

    return (defaultOption.value === status)?true:false;
  }  

  onChangedFromChild(myEvent:MyEvent) :void{

    if(this.isDebug()) console.log("manage-klasses / onChangedFromChild / myEvent : ",myEvent);

    if(null == myEvent) {
      if(this.isDebug()) console.log("manage-klasses / onChangedFromChild / 중단 / null == myEvent");
      return;
    } // end if

    if(myEvent.hasEventName(this.myEventService.ON_READY)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        // Do something...

      } else if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX)) {

        this.checkBoxList.push(myEvent.metaObj);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH)) {

        this.checkboxKlassDays = myEvent.metaObj;

      } // end if

    } else if(myEvent.hasEventName(this.myEventService.ON_CHANGE)) {

      if(myEvent.hasKey(this.myEventService.KEY_CHECKBOX_ALL)) {

        let isChecked:boolean = ("true" == ""+myEvent.value)?true:false;
        this.updateCheckBoxes(isChecked);

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_STATUS)) {

        this.updateKlassStatus(myEvent.value, myEvent.metaObj);


      } else if(myEvent.hasKey(this.myEventService.KEY_PAGE_NUM)) {

        this.pagination.pageNum = +myEvent.value;
        this.doFetchKlassList();

      } else if(myEvent.hasKey(this.myEventService.KEY_SEARCH_QUERY)) {

        this.searchQuery = myEvent.value;

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_STATUS_FOR_SEARCH)) {

        if(this.isDefaultStatus(myEvent.value)) {
          this.klassStatus = "";
        } else {
          this.klassStatus = myEvent.value;  
        } // end if

        this.doFetchKlassList();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_LEVEL_FOR_SEARCH)) {

        if(this.isDefaultLevel(myEvent.value)) {
          this.klassLevel = "";
        } else {
          this.klassLevel = myEvent.value;  
        } // end if

        this.doFetchKlassList();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_SUBWAY_LINE_FOR_SEARCH)) {

        if(this.isDefaultSubwayLine(myEvent.value)) {
          this.klassSubwayLine = "";
        } else {
          this.klassSubwayLine = myEvent.value;  
        } // end if

        this.doFetchKlassList();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_DAYS_FOR_SEARCH)) {

        /*
        if(this.isDefaultDay(myEvent.value)) {
          this.klassDays = "";
        } else {
          this.klassDays = myEvent.value;  
        } // end if
        */
        this.updateKlassDays();

        this.doFetchKlassList();

      } else if(myEvent.hasKey(this.myEventService.KEY_KLASS_TIME_FOR_SEARCH)) {

        if(this.isDefaultTime(myEvent.value)) {
          this.klassTime = "";
        } else {
          this.klassTime = myEvent.value;  
        } // end if

        this.doFetchKlassList();

      } // end if

      // KEY_KLASS_LEVEL_FOR_SEARCH

    } // end if

  } // end method

} // end class