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

import { KlassSearchRecommend }            from './klass-search-recommend';

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

  // 추천 검색어 객체리스트 - 결과를 검색어 객체에 넣어주려면?
  recommend0: KlassSearchRecommend = null;
  recommend1: KlassSearchRecommend = null;
  recommend2: KlassSearchRecommend = null;
  recommend3: KlassSearchRecommend = null;
  recommend4: KlassSearchRecommend = null;
  recommend5: KlassSearchRecommend = null;
  recommend6: KlassSearchRecommend = null;
  recommend7: KlassSearchRecommend = null;
 
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

  clickSearch(selectileList, searchKeyword:string): void {

    if(!this.isSearchEnabled) {
      return;
    }
    
    this.search(selectileList, searchKeyword);
  }

  onInitKlassFilterTile(searchBox) {
    searchBox.focus();
  }
  // REMOVE ME
  /*
  onFetchedSelectiles(selectileGroupList:any) {

    if(!selectileGroupList || 0 === selectileGroupList.length) {
      // Error Report
      return;
    }

    for (let i = 0; i < selectileGroupList.length; ++i) {
      let selectileList = selectileGroupList[i];
      if(!selectileList || 0 === selectileList.length) {
        // Error Report
        return;
      }

      let selectile = selectileList[0];


    }
  }
  */

  search(selectileList, searchKeyword:string): void {

    // 항목별 filter 만들기
    var level = "";
    var station = "";
    var day = "";
    var time = "";

    for (var i = 0; i < selectileList.length; ++i) {
      let selectile = selectileList[i];
      if(selectile instanceof KlassLevel) {
        level = selectile.key;
      } else if(selectile instanceof KlassStation) {
        station = selectile.key;
      } else if(selectile instanceof KlassDay) {
        day = selectile.key;
      } else if(selectile instanceof KlassTime) {
        time = selectile.key;
      }
    }

    // keyword 안전성 검사 및 param 만들기(구분자추가)

    var q = "";

    this.service.searchKlassList(
      // level:string, 
      level,
      // station:string, 
      station,
      // day:string, 
      day,
      // time:string,
      time, 
      // q:string
      q
    ).then(cclasses => {
        console.log("cclasses ::: ",cclasses);
       this.cclasses = cclasses 

       // 검색 결과가 돌아오면 검색 버튼이 비활성화.
       // 유저는 자신이 선택한 필터가 유지되기를 원할까? --> 사용성 테스트
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

    // 유저가 검색 필드를 변경하면 변경된 값으로 리스트가 업데이트 됩니다.
    this.search(selectiles, "");
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
  onKeyupEnterSearch(keyword:string) {
    console.log(">>> onKeyupEnterSearch");
    if(null === keyword || "" === keyword) {
      console.log("onKeyupEnterSearch / keyword is not valid!");
      return;
    }

    console.log(">>> onKeyupEnterSearch / init search process");
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
    
    var selectileObj = null;
    for (let key in this.keywordMap) {
      let index = key.indexOf(keyword);
      if(-1 < index) {
        selectileObj = this.keywordMap[key];
        break;
      }
    }   

    return selectileObj; 
  }
  private getRegexValidCharInSearch() {
    return new RegExp("[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\x20]+", "gi");
  }
  private getKeywordSafe(keyword:string) {
    let regex = this.getRegexValidCharInSearch();
    let keywordsSafe = keyword.replace(regex, "");

    return keywordsSafe;
  }
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

    this.setKeywordMap(selectile);

    // 안전한 문자열만 받습니다. 
    // 허용 문자열은 알파벳,한글,숫자입니다. 
    // 특수문자는 검색어로 허용하지 않습니다.
    let keywordList:string[] = keywordsFromUser.split(" ");
    let keywordListSafe:string[] = [];
    for (var i = 0; i < keywordList.length; ++i) {
      let keyword = keywordList[i];

      // let keywordSafe = keyword.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20]+/gi, "");
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
    var selectileFoundList = [];
    var keywordNotFoundList:string[] = [];
    for (var i = 0; i < keywordListSafe.length; ++i) {
      let keywordSafe = keywordListSafe[i];
      let selectileObj:any = this.searchKeywordMap(keywordSafe);

      if(null == selectileObj) {
        keywordNotFoundList.push(keywordSafe);
        continue;
      }

      selectileFoundList.push(selectileObj);
    }

    if(0 < selectileFoundList.length) {
      console.log("selectileFoundList ::: ",selectileFoundList);
    }
    console.log("keywordNotFoundList ::: ",keywordNotFoundList);

    // 검색 키워드를 정리합니다. 필터 카테고리에서 여러개의 검색어를 in clause 쿼리로 처리할 수 있도록 합니다.
    // 입력한 키워드에 매칭하는 필터 결과를 리스트 하단에 노출, 사용자가 선택할 수 있게합니다. 
    // 사용자가 추천으로 보게되는 결과는 
    // "필터 키워드 모음" + "추가 검색어" 입니다.
    // 사용자가 추천을 무시하면 공백 구분자로 나누어진 단어로 제목과 설명, tag만을 검색합니다.

    // 입력 가능한 문자에 대해 가이드 메시지 필요.
    // 입력 가능하지 않은 문자는 검색 창에서 사라짐.




    // 2글자 이상이어야 유효한 단어

    // 최소 한단어 이상이어야 함.

    // 1. 단어 분할로 제목 검색.

    // 사용자가 입력한 단어를 공백 단위로 분할.

    // 2. 제목과 설명은 최대 3개 단어 조합으로 검색. 그 이상은 무리가 있음.

    // 2-1. 사용자가 선택할 수 있는 모든 selectile의 키워드 중심으로 먼저 검색. --> 여기에 선정된 단어는 제외됨.
    // wonder.jung - 이걸 먼저 만들어 보자.


    // 2-2. 나머지 매칭되지 않는 단어들을 가지고 수업타이틀 및 수업 설명으로 검색.



    // 검색 결과가 많을 경우, 스크롤로 더 보여줄 수 있어야 함. 
    // 검색 결과는 최초 10개만 보여줌.

    // 유효한 검색어를 추천

    //

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



}
