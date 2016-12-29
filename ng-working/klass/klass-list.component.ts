import {  Component, 
          OnInit, 
          EventEmitter, 
          AfterViewInit,
          Output }                         from '@angular/core';

import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { KlassService }                    from './service/klass.service';
import { UrlService }                      from '../util/url.service';

import { Klass }                           from './model/klass';
import { KlassLevel }                      from './model/klass-level';
import { KlassStation }                    from './model/klass-station';
import { KlassDay }                        from './model/klass-day';
import { KlassTime }                       from './model/klass-time';

import { MyLoggerService }                 from '../util/service/my-logger.service';
import { MyEventWatchTowerService }        from '../util/service/my-event-watchtower.service';
import { MyCheckerService }                from '../util/service/my-checker.service';
import { MyResponse }                      from '../util/model/my-response';
import { HelperMyIs }                      from '../util/helper/my-is';

import { UserService }                     from '../users/service/user.service';
import { User }                            from '../users/model/user';
import { TeacherService }                  from '../teachers/service/teacher.service';
import { Teacher }                         from '../teachers/model/teacher';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-list.component.css'],
  templateUrl: 'klass-list.component.html',
})
export class KlassListComponent implements OnInit, AfterViewInit {

  klasses: Klass[];
  public selectedId: number;

  // 검색상태 관련
  isSearchEnabled: boolean = false;

  private searchTerms = new Subject<string>();

  loginUser:User;
  loginTeacher:Teacher;

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  private helperMyIs:HelperMyIs;

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
  ) { }

  isSelected(klass: Klass): boolean {
    return klass.id === this.selectedId;
  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / ngOnInit / 시작");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / ngAfterViewInit");

    this.asyncViewPack();
    this.subscribeLoginUser();
    this.subscribeLoginTeacher();

    // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
    this.watchTower.announceToggleTopMenu(true);

  } 
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("klass-list / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("klass-list / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe    

  }

  private subscribeLoginUser() :void {

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("klass-list / subscribeLoginUser / 시작");

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.loginAnnounced$.subscribe(
      (loginUser:User) => {

      if(isDebug) console.log("klass-list / subscribeLoginUser / loginUser : ",loginUser);
      this.loginUser = loginUser;  

    }); // end service
  } // end method

  private subscribeLoginTeacher() :void {

      // let isDebug:boolean = true;
      let isDebug:boolean = false;
      if(isDebug) console.log("klass-list / subscribeLoginTeacher / 시작");

    // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
    // Subscribe login user
    this.watchTower.loginTeacherAnnounced$.subscribe(
      (loginTeacher:Teacher) => {

      if(isDebug) console.log("klass-list / subscribeLoginTeacher / loginTeacher : ",loginTeacher);
    
      // 로그인한 선생님 정보가 들어왔습니다.
      this.loginTeacher = new Teacher().setJSON(loginTeacher);

      // 클래스 리스트를 다시 가져옵니다.
      this.getKlassList(true);
    });
  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / setLoginUser / 시작");

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
    this.setLoginTeacher();

  } 
  private setLoginTeacher() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / setLoginTeacher / 시작");

    // 로그인 선생님 데이터를 가져옵니다.
    let isTeacher:boolean = false;
    let loginTeacher:Teacher = this.watchTower.getLoginTeacher();
    if(null != loginTeacher) {
      this.loginTeacher = loginTeacher;
      isTeacher = true;
    }

    // 기본 유저 정보를 모두 가져왔습니다.
    // 수업 리스트를 가져옵니다.
    this.getKlassList(isTeacher);
  }
  private logActionPage() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / logActionPage / 시작");

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.watchTower.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeKlassList
    ).then((myResponse:MyResponse) => {
      // 로그 등록 결과를 확인해볼 수 있습니다.
      if(isDebug) console.log("klass-list / logActionPage / myResponse : ",myResponse);
    }) // end service

  }
  private init() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / init / 시작");

    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    // 로그인한 유저 정보를 가져옵니다.
    this.setLoginUser();
    // 페이지 진입을 기록으로 남깁니다.
    this.logActionPage();

  }

  private getKlassList(isTeacher:boolean) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / getKlassList / 시작");
    if(isDebug) console.log("klass-list / getKlassList / isTeacher : ",isTeacher);

    // 1. 선생님인 경우, 자신의 수업을 추가한 리스트를 가져와야 합니다.
    // 


    this.klassService
    .getKlasses()
    .then((myResponse:MyResponse) => {

      if(isDebug) console.log("klass-list / getKlassList / myResponse : ",myResponse);

      if(myResponse.isSuccess() && myResponse.hasDataProp("klass_list")) {

        // 성공!
        let klassJSONList = myResponse.getDataProp("klass_list");
        if(isDebug) console.log("klass-list / getKlassList / klassJSONList : ",klassJSONList);

        let klassList:Klass[] = [];
        if(null != klassJSONList) {
          klassList = this.klassService.getKlassListFromJSON(klassJSONList);
          if(isDebug) console.log("klass-list / getKlassList / klassList : ",klassList);
        }
        if(null != klassList && 0 < klassList.length) {
          // 1. 클래스 리스트를 가져왔습니다.
          this.klasses = klassList;
        }

        // wonder.jung
        if(isTeacher) {
          // 1-1. 선생님이라면 새로 수업 만들기를 노출합니다.
          let newKlassJSONList = myResponse.getDataProp("new_klass");

          // REMOVE ME
          // let newKlass:Klass = this.klassService.getKlassFromJSON(newKlassJSONList[0]);

          let newKlass:Klass = new Klass().setJSON(newKlassJSONList[0]);

          if(isDebug) console.log("klass-list / getKlassList / newKlass : ",newKlass);

          klassList.unshift(newKlass);
        } // end if

        // let klass:Klass = new_klass
        // 1-2. 유저라면 수업 없음 칸을 노출합니다.
        // new_klass

      } else {

        if(null != myResponse.error && "" != myResponse.error) {
          // 에러 내용은 화면에 표시한다.
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }
        
      } // end if
    }); // end service    

    // REFACTOR ME!
    // wonder.jung
    /*
    this.route.params.forEach((params: Params) => {

      if(isDebug) console.log("klass-list / getKlassList / params : ",params);

      this.selectedId = params['id'];

      this.klassService
      .getKlasses()
      .then((myResponse:MyResponse) => {

        if(isDebug) console.log("klass-list / getKlassList / myResponse : ",myResponse);

        if(myResponse.isSuccess() && myResponse.hasDataProp("klass_list")) {

          // 성공!
          let klassJSONList = myResponse.getDataProp("klass_list");
          if(isDebug) console.log("klass-list / getKlassList / klassJSONList : ",klassJSONList);

          let klassList:Klass[] = [];
          if(null != klassJSONList) {
            klassList = this.klassService.getKlassListFromJSON(klassJSONList);
            if(isDebug) console.log("klass-list / getKlassList / klassList : ",klassList);
          }
          if(null != klassList && 0 < klassList.length) {
            // 1. 클래스 리스트를 가져왔습니다.
            this.klasses = klassList;
          }

          // wonder.jung
          if(isTeacher) {
            // 1-1. 선생님이라면 새로 수업 만들기를 노출합니다.
            let newKlassJSONList = myResponse.getDataProp("new_klass");
            let newKlass:Klass = this.klassService.getKlassFromJSON(newKlassJSONList[0]);

            if(isDebug) console.log("klass-list / getKlassList / newKlass : ",newKlass);

            klassList.unshift(newKlass);
          } // end if

          // let klass:Klass = new_klass
          // 1-2. 유저라면 수업 없음 칸을 노출합니다.
          // new_klass

        } else {
          if(null != myResponse.error && "" != myResponse.error) {
            // 에러 내용은 화면에 표시한다.
            this.watchTower.announceErrorMsgArr([myResponse.error]);
          }
        } // end if
      }); // end service
    }); // end param
    */

  }


  onInitKlassFilterTile(searchBox) {
    searchBox.focus();
  }

  search( level:KlassLevel, 
          station:KlassStation, 
          day:KlassDay, 
          time:KlassTime, 
          searchKeyword:string): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / search / 시작");

    // 항목별 filter 만들기
    var levelKey = "";
    if(null != level && null != level.key) {
      levelKey = level.key;
    }
    var stationKey = "";
    if(null != station && null != station.key) {
      stationKey = station.key;
    }
    var dayKey = "";
    if(null != day && null != day.key) {
      dayKey = day.key;
    }
    var timeKey = "";
    if(null != time && null != time.key) {
      timeKey = time.key;
    }

    let keywordList:string[] = searchKeyword.split(" ");
    let searchKeywordSafe = "";

    for (var i = 0; i < keywordList.length; ++i) {
      let keyword = keywordList[i];
      let keywordSafe = this.getKeywordSafe(keyword);

      if(null == keywordSafe || "" === keywordSafe) {
        continue;
      }
      searchKeywordSafe += `${keywordSafe}|`;
    }

    this.klassService.searchKlassList(
      // level:string, 
      levelKey,
      // station:string, 
      stationKey,
      // day:string, 
      dayKey,
      // time:string,
      timeKey, 
      // q:string
      searchKeywordSafe
    ).then((myResponse:MyResponse) => {
      if(isDebug) console.log("klass-list / search / myResponse : ",myResponse);

      if(myResponse.isSuccess()) {

        // 성공!

      } else {
        if(null != myResponse.error && "" != myResponse.error) {
          // 에러 내용은 화면에 표시한다.
          this.watchTower.announceErrorMsgArr([myResponse.error]);
        }
      } // end if      
      // wonder.jung
      // this.klasses = klasses 
    });

  }

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
    // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
    // this.isSearchEnabled = true;

    if(null == selectileMap) {
      // error report
      console.log("!Error! / onChangedSelectile");
      return;
    }

    this.search(
      selectileMap.level,
      selectileMap.station,
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
      selectile.klassStationSelected,
      selectile.klassDaySelected,
      selectile.klassTimeSelected,
      searchBox.value
    );
  }
  private keywordMap;
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
  private setKeywordMap(selectile) {

    if(!this.isSafeSelectile(selectile)) {
      return;
    } else if(null != this.keywordMap) {
      return;
    }

    this.keywordMap = {};
    
    let klassDays = selectile.klassDays;
    for (let i = 0; i < klassDays.length; ++i) {
      // wonder.jung
      let curObj = klassDays[i];
      let klassDay:KlassDay = 
      new KlassDay(
        // public key: string,
        curObj["key"],
        // public name_eng: string,
        curObj["name_eng"],
        // public name_kor: string,
        curObj["name_kor"],
        // public img_url: string
        curObj["img_url"]
      );

      this.keywordMap[klassDay.name_kor] = klassDay;
      this.keywordMap[klassDay.name_eng] = klassDay;
    }
    let klassLevels = selectile.klassLevels;
    for (let i = 0; i < klassLevels.length; ++i) {
      // wonder.jung
      let curObj = klassLevels[i];
      let klassLevel:KlassLevel =
      new KlassLevel(
        // public key: string,
        curObj["key"],
        // public name_eng: string,
        curObj["name_eng"],
        // public name_kor: string,
        curObj["name_kor"],
        // public img_url: string
        curObj["img_url"]
      );      

      this.keywordMap[klassLevel.name_kor] = klassLevel;
      this.keywordMap[klassLevel.name_eng] = klassLevel;
    }
    let klassStations = selectile.klassStations;
    for (let i = 0; i < klassStations.length; ++i) {
      // wonder.jung
      let curObj = klassStations[i];
      let klassStation:KlassStation =
      new KlassStation(
        // public key: string,
        curObj["key"],
        // public name_eng: string,
        curObj["name_eng"],
        // public name_kor: string,
        curObj["name_kor"],
        // public img_url: string
        curObj["img_url"]
      );      

      this.keywordMap[klassStation.name_kor] = klassStation;
      this.keywordMap[klassStation.name_eng] = klassStation;
    }

    let klassTimes = selectile.klassTimes;
    for (let i = 0; i < klassTimes.length; ++i) {
      // wonder.jung
      let curObj = klassTimes[i];
      let klassTime:KlassTime = 
      new KlassTime(
        // public key: string,
        curObj["key"],
        // public name_eng: string,
        curObj["name_eng"],
        // public name_kor: string,
        curObj["name_kor"],
        // public hh_mm: string,
        curObj["hh_mm"],
        // public img_url: string
        curObj["img_url"]
      ); 

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
        selectile.klassStationSelected,
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

    this.setKeywordMap(selectile);

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
    // 검색 키워드인 selectile 데이터에서 사용자가 입력한 키워드가 있는지 찾아봅니다.
    var selectileMatchList = [];
    var keywordFoundList:string[] = [];
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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / onSelectKlass");
    if(isDebug) console.log("klass-list / onSelectKlass / klass : ",klass);

    let newClassId:number = -100;

    if(newClassId === +klass.id) {
      if(isDebug) console.log("klass-list / onSelectKlass / 새로운 클래스 만들기");
      this.gotoNewClassDetail(klass);
    } else if(0 < +klass.id) {
      if(isDebug) console.log("klass-list / onSelectKlass / 수업 상세 화면으로 이동하기");
      this.gotoClassDetail(klass);
    } // end if
  } // end method
  gotoNewClassDetail(klass: Klass):void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / gotoNewClassDetail / init");

    this.router.navigate([klass.id], { relativeTo: this.route });
  }
  gotoClassDetail(klass: Klass):void {
    // 수업 상세 페이지로 이동
    this.router.navigate([klass.id], { relativeTo: this.route });
  }
  onLoadFailClassImage(classImage, klassObj) {
    if(null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
      classImage.src = klassObj.class_img_err_url;
    }
  } // end functions
}
