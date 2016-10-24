import {  Component, 
          OnInit, 
          EventEmitter, 
          Output }      from '@angular/core';

import { ActivatedRoute, Router, Params }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { KlassService }                    from './klass.service';
import { CClassSearchService }             from './cclass-search.service';
import { CClass }                          from './cclass';
import { KlassKeyword }                    from './klass-keyword';

import { KlassLevel }                      from './klass-level';
import { KlassStation }                    from './klass-station';
import { KlassDay }                        from './klass-day';
import { KlassTime }                       from './klass-time';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-list.component.css'],
  templateUrl: 'klass-list.component.html',
  providers: [CClassSearchService]
})
export class KlassListComponent implements OnInit {

  cclasses: CClass[];
  public selectedId: number;

  // Search
  // TODO - 검색 관련 
  klassKeywords: Observable<KlassKeyword[]>;

  // 검색상태 관련
  isSearchEnabled: boolean = false;

  private searchTerms = new Subject<string>();

  constructor(
    private cclassSearchService: CClassSearchService,
    private service: KlassService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  isSelected(cclass: CClass): boolean {
    return cclass.id === this.selectedId;
  }

  ngOnInit(): void {

    // get class list
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCClasses().then(cclasses => this.cclasses = cclasses);
    });

    // search class with keyword
    // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
    this.klassKeywords = 
    this.searchTerms
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap(
      term => term?this.cclassSearchService.search(term):Observable.of<KlassKeyword[]>([])
    )
    .catch(error => {
      // TODO: real error handling
      console.log(error);
      return Observable.of<KlassKeyword[]>([]);
    })
    ;
  }
  // REMOVE ME
/*
  clickSearch(selectileList, searchKeyword:string): void {

    if(!this.isSearchEnabled) {
      return;
    }

    let klassLevel:KlassLevel;
    let klassStation:KlassStation;
    let klassDay:KlassDay;
    let klassTime:KlassTime;

    for (var i = 0; i < selectileList.length; ++i) {
      let selectile = selectileList[i];
      if(selectile instanceof KlassLevel) {

        klassLevel = selectile;
        
      } else if(selectile instanceof KlassStation) {

        klassStation = selectile;

      } else if(selectile instanceof KlassDay) {

        klassDay = selectile;

      } else if(selectile instanceof KlassTime) {

        klassTime = selectile;

      } // end if
    } // end for
    
    this.search(
      klassLevel,
      klassStation,
      klassDay,
      klassTime,
      searchKeyword
    );
  }
*/
  onInitKlassFilterTile(searchBox) {
    console.log("TEST / 002");
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

    // wonder.jung
    // keyword 안전성 검사 및 param 만들기(구분자추가)

    // TEST
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
    ).then(cclasses => {
        console.log("cclasses ::: ",cclasses);
       this.cclasses = cclasses 
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

  onChangedSelectile(selectiles:any[]) {
    // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
    // this.isSearchEnabled = true;

    if(null == selectiles || 0 === selectiles.length) {
      // error report
      console.log("!Error! / onChangedSelectile");
      return;
    }

    console.log("onChangedSelectile / selectiles : ",selectiles);

    // 유저가 검색 필드를 변경하면 변경된 값으로 리스트가 업데이트 됩니다.
    // this.search(selectiles, "");
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

    console.log("onKeyupEnterSearch / selectile :: ",selectile);

    this.search(
      selectile.klassLevelSelected,
      selectile.klassStationSelected,
      selectile.klassTimeSelected,
      selectile.klassDaySelected,
      searchBox.value
    );

    // REMOVE ME
    /*
    this.clickSearch(
      selectile.klassLevelSelected,
      selectile.klassStationSelected,
      selectile.klassTimeSelected,
      selectile.klassDaySelected,
      keywordsFromUser
    );
    */

    // wonder.jung
    // this.clickSearch(selectileList, keywordsFromUser);
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

    if(null === keywordsFromUser || "" === keywordsFromUser || keywordsFromUser.length < 2) {
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


  onSelectKlass(cclass: CClass) {

    // 유저가 수업을 선택했습니다.
    // 수업 상세 페이지로 이동해야 합니다.
    console.log("TEST / onSelectKlass / cclass :: ",cclass);
    // Navigate with relative link
    // this.router.navigate([cclass.id], { relativeTo: this.route });
  }

  onLoadFailClassImage(classImage, klassObj) {

    // if(null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
    //   classImage.src = klassObj.class_img_err_url;
    // }
  }



}
