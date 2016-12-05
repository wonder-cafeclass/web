import {  Component, 
          OnInit, 
          EventEmitter, 
          Output }      from '@angular/core';

import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { KlassService }                    from './klass.service';
import { UrlService }                      from '../util/url.service';

import { Klass }                           from './model/klass';
import { KlassLevel }                      from './model/klass-level';
import { KlassStation }                    from './model/klass-station';
import { KlassDay }                        from './model/klass-day';
import { KlassTime }                       from './model/klass-time';

import { UserService }                     from '../users/service/user.service';
import { MyLoggerService }                 from '../util/service/my-logger.service';
import { MyEventWatchTowerService }        from '../util/service/my-event-watchtower.service';
import { MyCheckerService }                from '../util/service/my-checker.service';

import { User }                            from '../users/model/user';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-list.component.css'],
  templateUrl: 'klass-list.component.html',
})
export class KlassListComponent implements OnInit {

  klasses: Klass[];
  public selectedId: number;

  // 검색상태 관련
  isSearchEnabled: boolean = false;

  private searchTerms = new Subject<string>();

  loginUser:User;

  private apiKey:string;
  isAdmin:boolean=false;
  errorMsgArr: string[]=[];

  constructor(
    private service: KlassService,
    private urlService: UrlService,
    private userService:UserService,
    private myLoggerService: MyLoggerService,
    private myEventWatchTowerService:MyEventWatchTowerService,
    private myCheckerService:MyCheckerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  isSelected(klass: Klass): boolean {
    return klass.id === this.selectedId;
  }

  ngOnInit(): void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("klass-list / ngOnInit / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.setIsAdmin();

    // my-checker.service의 apikey 가져옴. 
    this.setMyCheckerReady();

    // REMOVE ME
    // get class list
    /*
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getKlasses().then(klasses => this.klasses = klasses);
    });

    // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
    this.myEventWatchTowerService.announceToggleTopMenu(true);

    // 회원 로그인 쿠키를 가져옵니다.
    // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
    this.myCheckerService.getReady().then(() => {
      this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(result => {

        console.log("shared service에 이미 저장된 로그인 유저가 없음. 새로 가져옴.");
        console.log("result : ",result);

        if(null != result && null != result.user) {
          
          this.loginUser = result.user;
          // 가져온 유저 정보를 shared service 객체를 통해 전달합니다.
          this.myEventWatchTowerService.announceLogin(this.loginUser);
        }
      });
    }); // end Promise    
   */

  }


  private setIsAdmin() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setIsAdmin / 시작");

    // 운영 서버인지 서비스 서버인지 판단하는 플래그값 가져옴.
    this.myEventWatchTowerService.isAdmin$.subscribe(
      (isAdmin:boolean) => {

      if(isDebug) console.log("naver-callback / setIsAdmin / isAdmin : ",isAdmin);
      this.isAdmin = isAdmin;
    });
  }  

  private setMyCheckerReady() :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("naver-callback / setMyCheckerReady / 시작");

    this.myEventWatchTowerService.myCheckerServiceReady$.subscribe(
      (isReady:boolean) => {

      if(isDebug) console.log("naver-callback / setMyCheckerReady / isReady : ",isReady);

      if(!isReady) {
        // 에러 로그 등록
        this.myLoggerService.logError(
          // apiKey:string
          this.myEventWatchTowerService.getApiKey(),
          // errorType:string
          this.myLoggerService.errorTypeNotValidValue,
          // errorMsg:string
          `login / setMyCheckerReady / Failed! / isReady : ${isReady}`
        );        
        return;
      }

      this.myCheckerService.setReady(
        // checkerMap:any
        this.myEventWatchTowerService.getCheckerMap(),
        // constMap:any
        this.myEventWatchTowerService.getConstMap(),
        // dirtyWordList:any
        this.myEventWatchTowerService.getDirtyWordList(),
        // apiKey:string
        this.myEventWatchTowerService.getApiKey()
      ); // end setReady

      this.logPageEnter();

    });    
  }
  private logPageEnter() :void {
    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(
      // apiKey:string
      this.myEventWatchTowerService.getApiKey(),
      // pageType:string
      this.myLoggerService.pageTypeKlassList
    ); 

    this.getKlassList();
  }
  private getKlassList() :void {
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getKlasses().then(klasses => this.klasses = klasses);
    });

    // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
    this.myEventWatchTowerService.announceToggleTopMenu(true);

    // 회원 로그인 쿠키를 가져옵니다.
    // 로그인 이후 만들어진 쿠키와 유저 정보가 있다면 DB를 통해 가져옵니다.
    this.myCheckerService.getReady().then(() => {
      this.userService.getUserCookie(this.myCheckerService.getAPIKey()).then(result => {

        console.log("shared service에 이미 저장된 로그인 유저가 없음. 새로 가져옴.");
        console.log("result : ",result);

        if(null != result && null != result.user) {
          
          this.loginUser = result.user;
          // 가져온 유저 정보를 shared service 객체를 통해 전달합니다.
          this.myEventWatchTowerService.announceLogin(this.loginUser);
        }
      });
    }); // end Promise
  }


  onInitKlassFilterTile(searchBox) {
    searchBox.focus();
  }

  search(level:KlassLevel, station:KlassStation, day:KlassDay, time:KlassTime, searchKeyword:string): void {

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

    this.service.searchKlassList(
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
    ).then(klasses => {
       this.klasses = klasses 
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
      var curObj:KlassDay = klassDays[i];
      this.keywordMap[curObj.name_kor] = curObj;
      this.keywordMap[curObj.name_eng] = curObj;
    }
    let klassLevels = selectile.klassLevels;
    for (let i = 0; i < klassLevels.length; ++i) {
      var curObj:KlassLevel = klassLevels[i];
      this.keywordMap[curObj.name_kor] = curObj;
      this.keywordMap[curObj.name_eng] = curObj;
    }
    let klassStations = selectile.klassStations;
    for (let i = 0; i < klassStations.length; ++i) {
      var curObj:KlassStation = klassStations[i];
      this.keywordMap[curObj.name_kor] = curObj;
      this.keywordMap[curObj.name_eng] = curObj;
    }

    let klassTimes = selectile.klassTimes;
    for (let i = 0; i < klassTimes.length; ++i) {
      var curObj:KlassTime = klassTimes[i];
      this.keywordMap[curObj.name_kor] = curObj;
      this.keywordMap[curObj.name_eng] = curObj;
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
    console.log("onClickWishList / klass : ",klass);
  }
  onSelectKlass(event, klass: Klass) {
    event.stopPropagation();
    this.gotoClassDetail(klass);
  }
  gotoClassDetail(klass: Klass) {
    console.log("TEST / gotoClassDetail / klass :: ",klass);
    // 수업 상세 페이지로 이동
    // Navigate with relative link
    this.router.navigate([klass.id], { relativeTo: this.route });
  }
  onLoadFailClassImage(classImage, klassObj) {
    if(null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
      classImage.src = klassObj.class_img_err_url;
    }
  } // end functions
}
