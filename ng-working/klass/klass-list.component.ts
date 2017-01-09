import {  Component, 
          EventEmitter, 
          AfterViewInit,
          Output }                         from '@angular/core';

import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { KlassService }                    from './service/klass.service';

import { Klass }                           from './model/klass';
import { KlassLevel }                      from './model/klass-level';
import { KlassSubwayLine }                 from './model/klass-subway-line';
import { KlassSubwayStation }              from './model/klass-subway-station';
import { KlassDay }                        from './model/klass-day';
import { KlassTime }                       from './model/klass-time';

import { Pagination }                      from '../widget/pagination/model/pagination';

import { UrlService }                      from '../util/url.service';
import { MyLoggerService }                 from '../util/service/my-logger.service';
import { MyEventWatchTowerService }        from '../util/service/my-event-watchtower.service';
import { MyCheckerService }                from '../util/service/my-checker.service';
import { MyResponse }                      from '../util/model/my-response';
import { HelperMyIs }                      from '../util/helper/my-is';
import { HelperMyArray }                   from '../util/helper/my-array';

import { UserService }                     from '../users/service/user.service';
import { User }                            from '../users/model/user';
import { TeacherService }                  from '../teachers/service/teacher.service';
import { Teacher }                         from '../teachers/model/teacher';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-list.component.css'],
  templateUrl: 'klass-list.component.html',
})
export class KlassListComponent implements AfterViewInit {

  klassList: Klass[];
  public selectedId: number;

  // 검색상태 관련
  isSearchEnabled: boolean = false;

  loginUser:User;
  loginTeacher:Teacher;

  isAdmin:boolean=false;

  private myIs:HelperMyIs;
  private myArray:HelperMyArray;

  private pagination:Pagination;
  // private keywordMap;

  constructor(
    private klassService:KlassService,
    private urlService:UrlService,
    private userService:UserService,
    private teacherService:TeacherService,
    private myLoggerService:MyLoggerService,
    private watchTower:MyEventWatchTowerService,
    private myCheckerService:MyCheckerService,
    private route:ActivatedRoute,
    private router:Router
  ) { 

    this.myIs = new HelperMyIs();
    this.myArray = new HelperMyArray();

    this.klassService.setWatchTower(this.watchTower);

    this.pagination = new Pagination();

  }

  private isDebug():boolean {
    return true;
    // return this.watchTower.isDebug();
  }

  isSelected(klass: Klass): boolean {
    return klass.id === this.selectedId;
  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    if(this.isDebug()) console.log("klass-list / ngAfterViewInit");

    this.asyncViewPack();
    this.subscribeLoginUser();
    this.subscribeLoginTeacher();

    // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
    this.watchTower.announceToggleTopMenu(true);
    this.watchTower.announceToggleFooter(true);

  } 
  private asyncViewPack(): void {
    
    if(this.isDebug()) console.log("klass-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(this.isDebug()) console.log("klass-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(this.isDebug()) console.log("klass-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe    

  }

  private subscribeLoginUser() :void {

      if(this.isDebug()) console.log("klass-list / subscribeLoginUser / 시작");

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(this.isDebug()) console.log("klass-list / subscribeLoginUser / loginUser : ",loginUser);
      this.loginUser = loginUser;  

    }); // end service
  } // end method

  private subscribeLoginTeacher() :void {

    if(this.isDebug()) console.log("klass-list / subscribeLoginTeacher / 시작");

    // 이미 들어온 선생님 정보가 있는지 확인합니다.
    this.loginTeacher = this.watchTower.getLoginTeacher();
    if(this.isDebug()) console.log("klass-list / subscribeLoginTeacher / this.loginTeacher : ",this.loginTeacher);

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.loginTeacherAnnounced$.subscribe(
      (loginTeacher:Teacher) => {

      if(this.isDebug()) console.log("klass-list / subscribeLoginTeacher / loginTeacher : ",loginTeacher);
    
      // 로그인한 선생님 정보가 들어왔습니다.
      this.loginTeacher = new Teacher().setJSON(loginTeacher);

    });
  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdminServer();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }
  private setLoginUser() :void {

    if(this.isDebug()) console.log("klass-list / setLoginUser / 시작");

    // 1. watch tower에게 직접 요청
    // 로그인 학생 데이터를 가져옵니다.
    let userJSON = this.watchTower.getLoginUser();
    let loginUser:User = null;
    if(null != userJSON) {
      loginUser = new User().setJSON(userJSON);
    }
    if(null != loginUser) {
      this.loginUser = loginUser;
    }

    this.getKlassListOnInit();

  } 
  private logActionPage() :void {

    if(this.isDebug()) console.log("klass-list / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeKlassList
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-list / logActionPage / myResponse : ",myResponse);
    }) // end service

  }
  private init() :void {

    if(this.isDebug()) console.log("klass-list / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

  } // end method

  // @ Desc : 초기화시 1번만 수업 리스트를 가져옴. 
  private getKlassListOnInit() :void {

    if(this.myArray.isOK(this.klassList)) {
      // 이미 리스트가 있다면 로딩하지 않습니다.
      return;
    }

    if(this.isDebug()) console.log("klass-list / getKlassListOnInit / 시작");

    let loginUserId:number = -1;
    if(null != this.loginUser) {
      loginUserId = this.loginUser.id;
    }

    this.fetchKlassList(
      // userId:Number, 
      loginUserId,
      // pageNum:number, 
      this.pagination.pageNum,
      // pageSize:number, 
      this.pagination.pageRange,
      // searchQuery:string, 
      "",
      // klassStatus:string, 
      "O",
      // klassLevel:string, 
      "",
      // klassSubwayLine:string, 
      "",
      // klassSubwayStation:string, 
      "",
      // klassDays:string, 
      "",
      // klassTime:string  
      ""
    );

  } // end method

  onInitKlassFilterTile(searchBox) {
    searchBox.focus();
  }


  private updatePagination(jsonPagination:any) :void {

    if(this.isDebug()) console.log("klass-list / updatePagination / 시작");

    if(this.isDebug()) console.log("klass-list / updatePagination / jsonPagination : ",jsonPagination);

    if(null == jsonPagination) {
      this.pagination = new Pagination(); // 기본 값으로 설정
    } else {
      this.pagination = new Pagination().setJSON(jsonPagination);
    }
  }

  private updateKlassList(jsonKlassList:any[]) :void {

    if(this.isDebug()) console.log("klass-list / updateKlassList / 시작");

    if(this.myArray.isNotOK(jsonKlassList)) {

      // 검색 결과가 없습니다.
      this.klassList = null;

    } else {

      let klassList:Klass[] = [];
      for (var i = 0; i < jsonKlassList.length; ++i) {
        let klassJSON = jsonKlassList[i];
        let klass:Klass = new Klass().setJSON(klassJSON);

        klassList.push(klass);

      } // end for

      if(this.isDebug()) console.log("klass-list / updateKlassList / klassList : ",klassList);

      // 1. 스크롤로 추가적인 수업읇 보여준다면, 교체가 아닌 리스트에 덧붙이는 형식으로 표현.
      // 리스트 추가.
      // 2. 검색등으로 완전히 다른 리스트를 보여준다면, 교체.
      this.klassList = klassList; // 리스트 교체.
      
    } // end if

  } // end method    

  private fetchKlassList( loginUserId:number,
                          pageNum:number, 
                          pageSize:number, 
                          searchQuery:string, 
                          klassStatus:string, 
                          klassLevel:string, 
                          klassSubwayLine:string, 
                          klassSubwayStation:string, 
                          klassDays:string, 
                          klassTime:string ) {

    this.klassService.fetchKlassList(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number, 
      loginUserId,
      // pageNum:number, 
      this.pagination.pageNum,
      // pageSize:number, 
      this.pagination.pageRange,
      // searchQuery:string, 
      searchQuery,
      // klassStatus:string,
      klassStatus,
      // klassLevel:string,
      klassLevel,
      // klassSubwayLine:string,
      klassSubwayLine,
      // klassSubwayStation:string,
      klassSubwayStation,
      // klassDays:string,
      klassDays,
      // klassTime:string
      klassTime
    ).then((myResponse:MyResponse) => {

      if(this.isDebug()) console.log("klass-list / fetchKlassList / myResponse : ",myResponse);

      if(this.isDebug()) console.log("klass-list / fetchKlassList / myResponse : ",myResponse);

      if( myResponse.isSuccess() && 
          myResponse.hasDataProp("pagination") &&
          myResponse.hasDataProp("klass_list")) {

        // 1. Pagination 재설정
        let jsonPagination = myResponse.getDataProp("pagination");
        if(this.isDebug()) console.log("klass-list / fetchKlassList / jsonPagination : ",jsonPagination);
        this.updatePagination(jsonPagination);

        // 2. Klass List 재설정 
        let klassJSONList:any[] = myResponse.getDataProp("klass_list");
        if(this.isDebug()) console.log("klass-list / fetchKlassList / klassJSONList : ",klassJSONList);
        this.updateKlassList(klassJSONList);
        
      } else if(myResponse.isFailed()){
        if(this.isDebug()) console.log("klass-list / fetchKlassList / 쿠키에 등록된 유저 정보가 없습니다. 초기화합니다.");

        this.watchTower.logAPIError("fetchKlassList has been failed!");
        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if
        
      } // end if

    }); // end service    

  } // end method

  search( level:KlassLevel, 
          subwayLine:KlassSubwayLine, 
          subwayStation:KlassSubwayStation, 
          day:KlassDay, 
          time:KlassTime, 
          searchQuery:string): void {

    if(this.isDebug()) console.log("klass-list / search / 시작");

    // 항목별 filter 만들기
    var levelKey = "";
    if(null != level && null != level.key) {
      levelKey = level.getKeyNotDefault();
    }
    var subwayLineKey = "";
    if(null != subwayLine && null != subwayLine.key) {
      subwayLineKey = subwayLine.getKeyNotDefault();
    } // end if
    var subwayStationKey = "";
    if(null != subwayStation && null != subwayStation.key) {
      subwayStationKey = subwayStation.getKeyNotDefault();
    } // end if
    var dayKey = "";
    if(null != day && null != day.key) {
      dayKey = day.getKeyNotDefault();
    } // end if
    var timeKey = "";
    if(null != time && null != time.key) {
      timeKey = time.getKeyNotDefault();
    } // end if

    // 입력한 키워드중, 첫번째 단어만 검색에 사용합니다. 
    let keywordList:string[] = searchQuery.split(" ");
    let searchQuerySafe:string = "";
    if(this.myArray.isOK(keywordList)) {
      searchQuerySafe = keywordList[0];
    } // end if

    let loginUserId:number = -1;
    if(null != this.loginUser) {
      loginUserId = this.loginUser.id;
    } // end if

    if(null == this.pagination) {
      this.pagination = new Pagination();
    }

    this.fetchKlassList(
      // userId:number, 
      loginUserId,
      // pageNum:number, 
      this.pagination.pageNum,
      // pageSize:number, 
      this.pagination.pageRange,
      // searchQuery:string, 
      searchQuerySafe,
      // klassStatus:string, 
      "O",
      // klassLevel:string, 
      levelKey,
      // klassSubwayLine:string, 
      subwayLineKey,
      // klassSubwayStation:string, 
      subwayStationKey,
      // klassDays:string, 
      dayKey,
      // klassTime:string  
      timeKey    
    );

  } // end method

  // EVENT
  private isOverMagnifier: boolean=false;
  onMouseenterMagnifier() {

    if(!this.isSearchEnabled) {
      return;
    }
    
    if(!this.isOverMagnifier) {
      this.isOverMagnifier = true;
    }

  }
  onMouseleaveMagnifier() {

    if(!this.isSearchEnabled) {
      return;
    }

    if(this.isOverMagnifier) {
      this.isOverMagnifier = false;
    }

  }

  private prevSelectileMap = null;
  onChangedSelectile(selectileMap, searchBox) {

    if(this.isDebug()) console.log("klass-list / onChangedSelectile / 시작");

    // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
    this.isSearchEnabled = true;

    if(null == selectileMap) {
      // error report
      if(this.isDebug()) console.log("klass-list / onChangedSelectile / 중단 / selectileMap is not valid!");
      return;
    }

    if(this.isDebug()) console.log("klass-list / onChangedSelectile / selectileMap : ",selectileMap);

    this.search(
      selectileMap.level,
      selectileMap.subwayLine,
      selectileMap.subwayStation,
      selectileMap.day,
      selectileMap.time,
      searchBox.value
    );

  }
  onClickSearchInput(event, searchBox) {
    event.stopPropagation();

    // 시각적으로 보이는 검색창 영역을 클릭하면 focus되도록 해준다.
    searchBox.focus();
  }
  onMouseLeaveSearchInput(event, searchBox) {
    event.stopPropagation();
    this.onMouseleaveMagnifier();
  }
  onKeyupEnterSearch(keywordsFromUser:string, searchBox, selectile) {

    let keywordsSafe = this.getKeywordSafe(keywordsFromUser);
    if(keywordsFromUser.length !== keywordsSafe.length) {
      searchBox.value = keywordsSafe;
    }

    let selectileList = null;

    this.search(
      selectile.klassLevelSelected,
      selectile.klassSubwayLineSelected,
      selectile.klassSubwayStationSelected,
      selectile.klassDaySelected,
      selectile.klassTimeSelected,
      searchBox.value
    );
  }
  
  private isSafeSelectile(selectile) {

    if(null == selectile) {
      // error report
      console.log("error report / null == selectile");
      return false;
    } else if(null == selectile.klassDays) {
      // error report
      console.log("error report / null == selectile.klassDays");
      return false;
    } else if(null == selectile.klassLevels) {
      // error report
      console.log("error report / null == selectile.klassLevels");
      return false;
    } else if(null == selectile.klassStations) {
      // error report
      console.log("error report / null == selectile.klassStations");
      return false;
    } else if(null == selectile.klassTimes) {
      // error report
      console.log("error report / null == selectile.klassTimes");
      return false;
    } 

    return true;

  }

  private getKeywordSafe(keyword:string) {
    let regex = new RegExp("[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\x20]+", "gi");
    let keywordsSafe = keyword.replace(regex, "");

    return keywordsSafe;
  }
  private keywordsFromUserPrev:string;
  onKeyupSearchInput(keywordsFromUser:string, searchBox, selectile) {

    // TODO 입력 가능하지 않은 문자는 검색 창에서 사라짐. - 유저에게 안내 필요.
    let keywordsSafe = this.getKeywordSafe(keywordsFromUser);
    if(keywordsFromUser.length !== keywordsSafe.length) {
      searchBox.value = keywordsSafe;
    }

    if( "" === keywordsFromUser && 
        this.keywordsFromUserPrev !== keywordsFromUser) {

      // 공백일 경우는, 필터만을 이용해서 검색하는 것으로 가정합니다.
      this.keywordsFromUserPrev = keywordsFromUser;

      this.search(
        selectile.klassLevelSelected,
        selectile.klassSubwayLineSelected,
        selectile.klassSubwayStationSelected,
        selectile.klassDaySelected,
        selectile.klassTimeSelected,
        ""
      );

      return;
    }

    if(null === keywordsFromUser || keywordsFromUser.length < 2) {
      // 공백 및 1글자 입력은 처리하지 않습니다.
      return;
    } else if(!this.isSafeSelectile(selectile)) {
      return;
    }

    // 이전과 동일한 내용이라면 중단한다.
    if( null != this.keywordsFromUserPrev && 
        this.keywordsFromUserPrev === keywordsFromUser){

        return;
    }
    // 다르다면 키워드를 등록.
    this.keywordsFromUserPrev = keywordsFromUser;

    // REMOVE ME
    // this.setKeywordMap(selectile);

    // 안전한 문자열만 받습니다. 
    // 허용 문자열은 알파벳,한글,숫자입니다. 
    // 특수문자는 검색어로 허용하지 않습니다.
    let keywordList:string[] = keywordsFromUser.split(" ");
    let keywordListSafe:string[] = [];
    for (var i = 0; i < keywordList.length; ++i) {
      let keyword = keywordList[i];
      let keywordSafe = this.getKeywordSafe(keyword);

      if(null == keywordSafe || "" === keywordSafe) {
        continue;
      }

      keywordListSafe.push(keywordSafe);
    }

    if(null == keywordListSafe || !(0 < keywordListSafe.length)) {
      return;
    }


    // 유효한 검색 키워드를 찾았습니다.
    var selectileMatchList = [];
    var keywordFoundList:string[] = [];

    // REMOVE ME
    // 검색 키워드인 selectile 데이터에서 사용자가 입력한 키워드가 있는지 찾아봅니다.
    /*
    var keywordNotFoundList:string[] = [];
    for (var i = 0; i < keywordListSafe.length; ++i) {
      let keywordSafe = keywordListSafe[i];
      let selectileObj:any = this.searchKeywordMap(keywordSafe);

      if(null == selectileObj) {
        keywordNotFoundList.push(keywordSafe);
        continue;
      }

      selectileMatchList.push(selectileObj);
      keywordFoundList.push(keywordSafe);
    }
    */

    // 필터와 매칭된 키워드를 selectile 리스트에 노출합니다.
    // 사용자가 입력한 키워드는 검색창에서 제외합니다.
    for (var i = 0; i < selectileMatchList.length; ++i) {
      let selectileMatch = selectileMatchList[i];
      selectile.klassSelectileSubject.next(selectileMatch);

      // 사용자가 입력 및 매칭된 키워드는 제거합니다.
      let keywordFound = keywordFoundList[i];
      searchBox.value = searchBox.value.replace(keywordFound,"");
    }

    // 필터와 매칭되지 않은 키워드는 "제목","설명"의 검색 키워드로 사용합니다.
    // 1개의 단어만 검색 키워드로 지원합니다. - 엔터키와 검색 버튼 click으로 진행.

    // 유저가 검색어를 입력한 상태. 유효한 키워드라면, 검색 버튼을 활성화 해줍니다.
    if(!this.isSearchEnabled) {
      this.isSearchEnabled = true;
    }
  }

  onClickWishList(event, klass: Klass) {

    event.stopPropagation();
    event.preventDefault();

  }
  onSelectKlass(event, klass: Klass) {

    event.stopPropagation();
    event.preventDefault();

    if(this.isDebug()) console.log("klass-list / onSelectKlass");
    if(this.isDebug()) console.log("klass-list / onSelectKlass / klass : ",klass);

    let newClassId:number = -100;

    if(newClassId === +klass.id) {
      if(this.isDebug()) console.log("klass-list / onSelectKlass / 새로운 클래스 만들기");

      // this.gotoNewClassDetail(klass);

      if(confirm("수업을 새로 만드시겠어요?")) {
        // 1. 새로운 클래스를 만든다.
        this.addNewKlass();
      } // end if

    } else if(0 < +klass.id) {
      if(this.isDebug()) console.log("klass-list / onSelectKlass / 수업 상세 화면으로 이동하기");
      this.gotoClassDetail(klass);
    } // end if
  } // end method

  addNewKlass():void {

    if(this.isDebug()) console.log("klass-list / addNewKlass / init");

    // 선생님인 경우에만 수업을 추가할 수 있습니다.
    if(null == this.loginUser) {
      if(this.isDebug()) console.log("klass-list / addNewKlass / 중단 / null == this.loginUser");
      return;
    }

    this.klassService.addKlassEmpty(
      // apiKey:string, 
      this.watchTower.getApiKey(),
      // userId:number,
      +this.loginUser.id,
      // teacherId:number,
      +this.loginTeacher.id,
      // teacherResume:string,
      this.loginTeacher.resume,
      // teacherGreeting:string
      this.loginTeacher.greeting
    ).then((myResponse:MyResponse) => {

      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(this.isDebug()) console.log("klass-list / addReview / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("klass")) {

        let klass:Klass = new Klass().setJSON(myResponse.getDataProp("klass"));
        if(null != klass) {
          // 새로운 클래스가 등록되었습니다. 해당 수업 페이지로 이동합니다.
          this.gotoClassDetail(klass);
        } // end if

      } else if(myResponse.isFailed()) {  

        if(null != myResponse.error) {
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        } // end if

        // 에러 로그 등록
        this.watchTower.logAPIError(`klass-list / addNewKlass / user_id : ${this.loginUser.id}`);

      } // end if

    }) // end service

  } // end method

  gotoClassDetail(klass: Klass):void {
    // 수업 상세 페이지로 이동
    this.router.navigate([klass.id], { relativeTo: this.route });
  } // end method

  onLoadFailClassImage(classImage, klassObj) {
    if(null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
      classImage.src = klassObj.class_img_err_url;
    }
  } // end functions

  // REMOVE ME
  /*
  private setKeywordMap(selectile) {

    // wonder.jung
    if(this.isDebug()) console.log("klass-list / setKeywordMap / 시작");
    if(this.isDebug()) console.log("klass-list / setKeywordMap / 시작");

    if(!this.isSafeSelectile(selectile)) {
      return;
    } else if(null != this.keywordMap) {
      return;
    }

    this.keywordMap = {};

    let klassDayList:KlassDay[] = selectile.klassDays;
    for (let i = 0; i < klassDayList.length; ++i) {
      // wonder.jung
      let klassDay:KlassDay = klassDayList[i];

      this.keywordMap[klassDay.name_kor] = klassDay;
      this.keywordMap[klassDay.name_eng] = klassDay;
    }
    let klassLevelList:KlassLevel[] = selectile.klassLevels;
    for (let i = 0; i < klassLevelList.length; ++i) {
      // wonder.jung
      let klassLevel:KlassLevel = klassLevelList[i];

      this.keywordMap[klassLevel.name_kor] = klassLevel;
      this.keywordMap[klassLevel.name_eng] = klassLevel;
    }
    let klassSubwayLineList:KlassSubwayLine[] = selectile.klassSubwayLines;
    for (let i = 0; i < klassSubwayLineList.length; ++i) {
      // wonder.jung
      let klassSubwayLine:KlassSubwayLine = klassSubwayLineList[i];

      this.keywordMap[klassSubwayLine.name_kor] = klassSubwayLine;
      this.keywordMap[klassSubwayLine.name_eng] = klassSubwayLine;
    }
    let klassSubwayStationList:KlassSubwayStation[] = selectile.klassSubwayStations;
    for (let i = 0; i < klassSubwayStationList.length; ++i) {
      // wonder.jung
      let klassSubwayStation:KlassSubwayStation = klassSubwayStationList[i];

      this.keywordMap[klassSubwayStation.name_kor] = klassSubwayStation;
      this.keywordMap[klassSubwayStation.name_eng] = klassSubwayStation;
    }
    let klassTimeList:KlassTime[] = selectile.klassTimes;
    for (let i = 0; i < klassTimeList.length; ++i) {
      // wonder.jung
      let klassTime:KlassTime = klassTimeList[i];

      this.keywordMap[klassTime.name_kor] = klassTime;
      this.keywordMap[klassTime.name_eng] = klassTime;
    }

  }
  private searchKeywordMap(keyword:string):any {

    if(!this.keywordMap) {
      return;
    }

    if(!(1 < keyword.length)) {
      // 대조하는 글자는 2글자 이상이어야 한다.
      return;
    }

    var selectileObj = null;
    for (let key in this.keywordMap) {

      let keyNoEmpty = key.replace(" ","");

      let isOK = false;
      if( 2 == keyNoEmpty.length && 2 == keyword.length ) {
        isOK = true;
      } else if( 2 < keyNoEmpty.length && (keyNoEmpty.length - 1) == keyword.length ) {
        isOK = true;
      }

      if(!isOK) {
        continue;
      }

      if(0 === keyNoEmpty.indexOf(keyword)) {
        // 첫글자부터 시작, 2글자 이상 매칭되는 경우만 허용.(공백은 제거합니다.)
        selectileObj = this.keywordMap[key];
        break;        
      } // end if
    } // end for

    return selectileObj; 
  }
  */

} // end class