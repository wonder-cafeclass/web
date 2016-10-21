"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
var klass_service_1 = require('./klass.service');
var cclass_search_service_1 = require('./cclass-search.service');
var klass_level_1 = require('./klass-level');
var klass_station_1 = require('./klass-station');
var klass_day_1 = require('./klass-day');
var klass_time_1 = require('./klass-time');
var KlassListComponent = (function () {
    function KlassListComponent(cclassSearchService, service, route, router) {
        this.cclassSearchService = cclassSearchService;
        this.service = service;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isSearchEnabled = false;
        // 추천 검색어 객체리스트 - 결과를 검색어 객체에 넣어주려면?
        this.recommend0 = null;
        this.recommend1 = null;
        this.recommend2 = null;
        this.recommend3 = null;
        this.recommend4 = null;
        this.recommend5 = null;
        this.recommend6 = null;
        this.recommend7 = null;
        this.searchTerms = new Subject_1.Subject();
        // EVENT
        this.isOverMagnifier = false;
    }
    KlassListComponent.prototype.isSelected = function (cclass) {
        return cclass.id === this.selectedId;
    };
    KlassListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get class list
        this.route.params.forEach(function (params) {
            _this.selectedId = params['id'];
            _this.service.getCClasses().then(function (cclasses) { return _this.cclasses = cclasses; });
        });
        // search class with keyword
        // @ referer : http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
        this.klassKeywords =
            this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(function (term) { return term ? _this.cclassSearchService.search(term) : Observable_1.Observable.of([]); })
                .catch(function (error) {
                // TODO: real error handling
                console.log(error);
                return Observable_1.Observable.of([]);
            });
    };
    KlassListComponent.prototype.clickSearch = function (selectileList, searchKeyword) {
        if (!this.isSearchEnabled) {
            return;
        }
        this.search(selectileList, searchKeyword);
    };
    KlassListComponent.prototype.onInitKlassFilterTile = function (searchBox) {
        searchBox.focus();
    };
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
    KlassListComponent.prototype.search = function (selectileList, searchKeyword) {
        var _this = this;
        // 항목별 filter 만들기
        var level = "";
        var station = "";
        var day = "";
        var time = "";
        for (var i = 0; i < selectileList.length; ++i) {
            var selectile = selectileList[i];
            if (selectile instanceof klass_level_1.KlassLevel) {
                level = selectile.key;
            }
            else if (selectile instanceof klass_station_1.KlassStation) {
                station = selectile.key;
            }
            else if (selectile instanceof klass_day_1.KlassDay) {
                day = selectile.key;
            }
            else if (selectile instanceof klass_time_1.KlassTime) {
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
        q).then(function (cclasses) {
            console.log("cclasses ::: ", cclasses);
            _this.cclasses = cclasses;
            // 검색 결과가 돌아오면 검색 버튼이 비활성화.
            // 유저는 자신이 선택한 필터가 유지되기를 원할까? --> 사용성 테스트
        });
    };
    KlassListComponent.prototype.onMouseenterMagnifier = function () {
        if (!this.isSearchEnabled) {
            return;
        }
        if (!this.isOverMagnifier) {
            this.isOverMagnifier = true;
        }
    };
    KlassListComponent.prototype.onMouseleaveMagnifier = function () {
        if (!this.isSearchEnabled) {
            return;
        }
        if (this.isOverMagnifier) {
            this.isOverMagnifier = false;
        }
    };
    KlassListComponent.prototype.onChangedSelectile = function (selectiles) {
        // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
        // this.isSearchEnabled = true;
        // 유저가 검색 필드를 변경하면 변경된 값으로 리스트가 업데이트 됩니다.
        this.search(selectiles, "");
    };
    KlassListComponent.prototype.onClickSearchInput = function (event, searchBox) {
        event.stopPropagation();
        // 시각적으로 보이는 검색창 영역을 클릭하면 focus되도록 해준다.
        searchBox.focus();
    };
    KlassListComponent.prototype.onMouseLeaveSearchInput = function (event, searchBox) {
        event.stopPropagation();
        this.onMouseleaveMagnifier();
    };
    KlassListComponent.prototype.onKeyupEnterSearch = function (keyword) {
        console.log(">>> onKeyupEnterSearch");
        if (null === keyword || "" === keyword) {
            console.log("onKeyupEnterSearch / keyword is not valid!");
            return;
        }
        console.log(">>> onKeyupEnterSearch / init search process");
    };
    KlassListComponent.prototype.isSafeSelectile = function (selectile) {
        if (null == selectile) {
            // error report
            console.log("error report / null == selectile");
            return false;
        }
        else if (null == selectile.klassDays) {
            // error report
            console.log("error report / null == selectile.klassDays");
            return false;
        }
        else if (null == selectile.klassLevels) {
            // error report
            console.log("error report / null == selectile.klassLevels");
            return false;
        }
        else if (null == selectile.klassStations) {
            // error report
            console.log("error report / null == selectile.klassStations");
            return false;
        }
        else if (null == selectile.klassTimes) {
            // error report
            console.log("error report / null == selectile.klassTimes");
            return false;
        }
        return true;
    };
    KlassListComponent.prototype.setKeywordMap = function (selectile) {
        if (!this.isSafeSelectile(selectile)) {
            return;
        }
        else if (null != this.keywordMap) {
            return;
        }
        this.keywordMap = {};
        var klassDays = selectile.klassDays;
        for (var i = 0; i < klassDays.length; ++i) {
            var curObj = klassDays[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassLevels = selectile.klassLevels;
        for (var i = 0; i < klassLevels.length; ++i) {
            var curObj = klassLevels[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassStations = selectile.klassStations;
        for (var i = 0; i < klassStations.length; ++i) {
            var curObj = klassStations[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
        var klassTimes = selectile.klassTimes;
        for (var i = 0; i < klassTimes.length; ++i) {
            var curObj = klassTimes[i];
            this.keywordMap[curObj.name_kor] = curObj;
            this.keywordMap[curObj.name_eng] = curObj;
        }
    };
    KlassListComponent.prototype.searchKeywordMap = function (keyword) {
        if (!this.keywordMap) {
            return;
        }
        var selectileObj = null;
        for (var key in this.keywordMap) {
            var index = key.indexOf(keyword);
            if (-1 < index) {
                selectileObj = this.keywordMap[key];
                break;
            }
        }
        return selectileObj;
    };
    KlassListComponent.prototype.getRegexValidCharInSearch = function () {
        return new RegExp("[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\x20]+", "gi");
    };
    KlassListComponent.prototype.getKeywordSafe = function (keyword) {
        var regex = this.getRegexValidCharInSearch();
        var keywordsSafe = keyword.replace(regex, "");
        return keywordsSafe;
    };
    KlassListComponent.prototype.onKeyupSearchInput = function (keywordsFromUser, searchBox, selectile) {
        // TODO 입력 가능하지 않은 문자는 검색 창에서 사라짐. - 유저에게 안내 필요.
        var keywordsSafe = this.getKeywordSafe(keywordsFromUser);
        if (keywordsFromUser.length !== keywordsSafe.length) {
            searchBox.value = keywordsSafe;
        }
        if (null === keywordsFromUser || "" === keywordsFromUser || keywordsFromUser.length < 2) {
            // 공백 및 1글자 입력은 처리하지 않습니다.
            return;
        }
        else if (!this.isSafeSelectile(selectile)) {
            return;
        }
        this.setKeywordMap(selectile);
        // 안전한 문자열만 받습니다. 
        // 허용 문자열은 알파벳,한글,숫자입니다. 
        // 특수문자는 검색어로 허용하지 않습니다.
        var keywordList = keywordsFromUser.split(" ");
        var keywordListSafe = [];
        for (var i = 0; i < keywordList.length; ++i) {
            var keyword = keywordList[i];
            // let keywordSafe = keyword.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20]+/gi, "");
            var keywordSafe = this.getKeywordSafe(keyword);
            if (null == keywordSafe || "" === keywordSafe) {
                continue;
            }
            keywordListSafe.push(keywordSafe);
        }
        if (null == keywordListSafe || !(0 < keywordListSafe.length)) {
            return;
        }
        // 유효한 검색 키워드를 찾았습니다.
        // 검색 키워드인 selectile 데이터에서 사용자가 입력한 키워드가 있는지 찾아봅니다.
        var selectileFoundList = [];
        var keywordNotFoundList = [];
        for (var i = 0; i < keywordListSafe.length; ++i) {
            var keywordSafe = keywordListSafe[i];
            var selectileObj = this.searchKeywordMap(keywordSafe);
            if (null == selectileObj) {
                keywordNotFoundList.push(keywordSafe);
                continue;
            }
            selectileFoundList.push(selectileObj);
        }
        if (0 < selectileFoundList.length) {
            console.log("selectileFoundList ::: ", selectileFoundList);
        }
        console.log("keywordNotFoundList ::: ", keywordNotFoundList);
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
        if (!this.isSearchEnabled) {
            this.isSearchEnabled = true;
        }
    };
    KlassListComponent.prototype.onSelectKlass = function (cclass) {
        // 유저가 수업을 선택했습니다.
        // 수업 상세 페이지로 이동해야 합니다.
        console.log("TEST / onSelectKlass / cclass :: ", cclass);
        // Navigate with relative link
        // this.router.navigate([cclass.id], { relativeTo: this.route });
    };
    KlassListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-list.component.css'],
            templateUrl: 'klass-list.component.html',
            providers: [cclass_search_service_1.CClassSearchService]
        }), 
        __metadata('design:paramtypes', [cclass_search_service_1.CClassSearchService, klass_service_1.KlassService, router_1.ActivatedRoute, router_1.Router])
    ], KlassListComponent);
    return KlassListComponent;
}());
exports.KlassListComponent = KlassListComponent;
//# sourceMappingURL=klass-list.component.js.map