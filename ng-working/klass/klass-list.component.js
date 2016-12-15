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
var Subject_1 = require('rxjs/Subject');
var klass_service_1 = require('./service/klass.service');
var url_service_1 = require('../util/url.service');
var my_logger_service_1 = require('../util/service/my-logger.service');
var my_event_watchtower_service_1 = require('../util/service/my-event-watchtower.service');
var my_checker_service_1 = require('../util/service/my-checker.service');
var user_service_1 = require('../users/service/user.service');
var teacher_service_1 = require('../teachers/service/teacher.service');
var KlassListComponent = (function () {
    function KlassListComponent(klassService, urlService, userService, teacherService, myLoggerService, watchTower, myCheckerService, route, router) {
        this.klassService = klassService;
        this.urlService = urlService;
        this.userService = userService;
        this.teacherService = teacherService;
        this.myLoggerService = myLoggerService;
        this.watchTower = watchTower;
        this.myCheckerService = myCheckerService;
        this.route = route;
        this.router = router;
        // 검색상태 관련
        this.isSearchEnabled = false;
        this.searchTerms = new Subject_1.Subject();
        this.isAdmin = false;
        this.errorMsgArr = [];
        // EVENT
        this.isOverMagnifier = false;
        this.prevSelectileMap = null;
    }
    KlassListComponent.prototype.isSelected = function (klass) {
        return klass.id === this.selectedId;
    };
    KlassListComponent.prototype.ngOnInit = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / ngOnInit / 시작");
        this.asyncViewPack();
        this.subscribeLoginUser();
        this.subscribeLoginTeacher();
    };
    KlassListComponent.prototype.ngAfterViewInit = function () {
        // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / ngAfterViewInit");
        this.asyncViewPack();
    };
    KlassListComponent.prototype.subscribeLoginUser = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / subscribeLoginUser / 시작");
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginAnnounced$.subscribe(function (loginUser) {
            if (isDebug)
                console.log("klass-list / subscribeLoginUser / loginUser : ", loginUser);
            // 로그인한 유저 정보가 들어왔습니다.
            _this.loginUser = _this.userService.getUserFromJSON(loginUser);
        });
    };
    KlassListComponent.prototype.subscribeLoginTeacher = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / subscribeLoginTeacher / 시작");
        // 유저가 서비스 어느곳에서든 로그인을 하면 여기서도 로그인 정보를 받아 처리합니다.
        // Subscribe login user
        this.watchTower.loginTeacherAnnounced$.subscribe(function (loginTeacher) {
            if (isDebug)
                console.log("klass-list / subscribeLoginTeacher / loginTeacher : ", loginTeacher);
            // 로그인한 선생님 정보가 들어왔습니다.
            _this.loginTeacher = _this.teacherService.getTeacherFromJSON(loginTeacher);
            // 클래스 리스트를 다시 가져옵니다.
            _this.getKlassList(true);
        });
    };
    KlassListComponent.prototype.asyncViewPack = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / asyncViewPack / 시작");
        // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
        if (this.watchTower.getIsViewPackReady()) {
            if (isDebug)
                console.log("klass-list / asyncViewPack / isViewPackReady : ", true);
            this.init();
        } // end if
        // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
        this.watchTower.isViewPackReady$.subscribe(function (isViewPackReady) {
            if (isDebug)
                console.log("klass-list / asyncViewPack / subscribe / isViewPackReady : ", isViewPackReady);
            _this.init();
        }); // end subscribe    
    };
    KlassListComponent.prototype.setViewPack = function () {
        this.isAdmin = this.watchTower.getIsAdmin();
        this.myCheckerService.setReady(
        // checkerMap:any
        this.watchTower.getCheckerMap(), 
        // constMap:any
        this.watchTower.getConstMap(), 
        // dirtyWordList:any
        this.watchTower.getDirtyWordList(), 
        // apiKey:string
        this.watchTower.getApiKey()); // end setReady
    };
    KlassListComponent.prototype.setLoginUser = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / setLoginUser / 시작");
        // 1. watch tower에게 직접 요청
        // 로그인 학생 데이터를 가져옵니다.
        var userJSON = this.watchTower.getLoginUser();
        var loginUser = null;
        if (null != userJSON) {
            loginUser = this.userService.getUserFromJSON(userJSON);
        }
        if (null != loginUser) {
            this.loginUser = loginUser;
        }
        this.setLoginTeacher();
        // 2. 
    };
    KlassListComponent.prototype.setLoginTeacher = function () {
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-list / setLoginTeacher / 시작");
        // 로그인 선생님 데이터를 가져옵니다.
        var teacherJSON = this.watchTower.getLoginTeacher();
        if (isDebug)
            console.log("klass-list / setLoginTeacher / teacherJSON : ", teacherJSON);
        var loginTeacher = null;
        var isTeacher = false;
        if (null != teacherJSON) {
            loginTeacher = this.teacherService.getTeacherFromJSON(teacherJSON);
        }
        if (null != loginTeacher) {
            this.loginTeacher = loginTeacher;
            isTeacher = true;
        }
        // 기본 유저 정보를 모두 가져왔습니다.
        // 수업 리스트를 가져옵니다.
        this.getKlassList(isTeacher);
    };
    KlassListComponent.prototype.logActionPage = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / logActionPage / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeKlassList).then(function (myResponse) {
            // 로그 등록 결과를 확인해볼 수 있습니다.
            if (isDebug)
                console.log("klass-list / logActionPage / myResponse : ", myResponse);
        }); // end service
    };
    KlassListComponent.prototype.init = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / init / 시작");
        // 뷰에 필요한 공통 정보를 설정합니다.
        this.setViewPack();
        // 로그인한 유저 정보를 가져옵니다.
        this.setLoginUser();
        // 페이지 진입을 기록으로 남깁니다.
        this.logActionPage();
    };
    KlassListComponent.prototype.logPageEnter = function () {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / logPageEnter / 시작");
        // 페이지 진입을 기록으로 남깁니다.
        this.myLoggerService.logActionPage(
        // apiKey:string
        this.watchTower.getApiKey(), 
        // pageType:string
        this.myLoggerService.pageTypeKlassList).then(function (myResponse) {
            if (isDebug)
                console.log("klass-list / logPageEnter / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
            }
            else {
                if (null != myResponse.error && "" != myResponse.error) {
                    // 에러 내용은 화면에 표시한다.
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
            } // end if
        });
    };
    KlassListComponent.prototype.getKlassList = function (isTeacher) {
        var _this = this;
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-list / getKlassList / 시작");
        if (isDebug)
            console.log("klass-list / getKlassList / isTeacher : ", isTeacher);
        // REFACTOR ME!
        this.route.params.forEach(function (params) {
            if (isDebug)
                console.log("klass-list / getKlassList / params : ", params);
            _this.selectedId = params['id'];
            _this.klassService
                .getKlasses()
                .then(function (myResponse) {
                if (isDebug)
                    console.log("klass-list / getKlassList / myResponse : ", myResponse);
                if (myResponse.isSuccess() && myResponse.hasDataProp("klass_list")) {
                    // 성공!
                    var klassJSONList = myResponse.getDataProp("klass_list");
                    if (isDebug)
                        console.log("klass-list / getKlassList / klassJSONList : ", klassJSONList);
                    var klassList = [];
                    if (null != klassJSONList) {
                        klassList = _this.klassService.getKlassListFromJSON(klassJSONList);
                        if (isDebug)
                            console.log("klass-list / getKlassList / klassList : ", klassList);
                    }
                    if (null != klassList && 0 < klassList.length) {
                        // 1. 클래스 리스트를 가져왔습니다.
                        _this.klasses = klassList;
                    }
                    // wonder.jung
                    if (isTeacher) {
                        // 1-1. 선생님이라면 새로 수업 만들기를 노출합니다.
                        var newKlassJSONList = myResponse.getDataProp("new_klass");
                        var newKlass = _this.klassService.getKlassFromJSON(newKlassJSONList[0]);
                        if (isDebug)
                            console.log("klass-list / getKlassList / newKlass : ", newKlass);
                        klassList.unshift(newKlass);
                    } // end if
                }
                else {
                    if (null != myResponse.error && "" != myResponse.error) {
                        // 에러 내용은 화면에 표시한다.
                        _this.watchTower.announceErrorMsgArr([myResponse.error]);
                    }
                } // end if
            }); // end service
        }); // end param
        // 홈화면인 수업 리스트에서는 상단 메뉴를 보여줍니다.
        this.watchTower.announceToggleTopMenu(true);
    };
    KlassListComponent.prototype.onInitKlassFilterTile = function (searchBox) {
        searchBox.focus();
    };
    KlassListComponent.prototype.search = function (level, station, day, time, searchKeyword) {
        var _this = this;
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / search / 시작");
        // 항목별 filter 만들기
        var levelKey = "";
        if (null != level && null != level.key) {
            levelKey = level.key;
        }
        var stationKey = "";
        if (null != station && null != station.key) {
            stationKey = station.key;
        }
        var dayKey = "";
        if (null != day && null != day.key) {
            dayKey = day.key;
        }
        var timeKey = "";
        if (null != time && null != time.key) {
            timeKey = time.key;
        }
        var keywordList = searchKeyword.split(" ");
        var searchKeywordSafe = "";
        for (var i = 0; i < keywordList.length; ++i) {
            var keyword = keywordList[i];
            var keywordSafe = this.getKeywordSafe(keyword);
            if (null == keywordSafe || "" === keywordSafe) {
                continue;
            }
            searchKeywordSafe += keywordSafe + "|";
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
        searchKeywordSafe).then(function (myResponse) {
            if (isDebug)
                console.log("klass-list / search / myResponse : ", myResponse);
            if (myResponse.isSuccess()) {
            }
            else {
                if (null != myResponse.error && "" != myResponse.error) {
                    // 에러 내용은 화면에 표시한다.
                    _this.watchTower.announceErrorMsgArr([myResponse.error]);
                }
            } // end if      
            // wonder.jung
            // this.klasses = klasses 
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
    KlassListComponent.prototype.onChangedSelectile = function (selectileMap, searchBox) {
        // 유저가 검색 필드를 변경한 상태입니다. Search 돋보기 버튼이 활성화 되어야 합니다.
        // this.isSearchEnabled = true;
        if (null == selectileMap) {
            // error report
            console.log("!Error! / onChangedSelectile");
            return;
        }
        this.search(selectileMap.level, selectileMap.station, selectileMap.day, selectileMap.time, searchBox.value);
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
    KlassListComponent.prototype.onKeyupEnterSearch = function (keywordsFromUser, searchBox, selectile) {
        var keywordsSafe = this.getKeywordSafe(keywordsFromUser);
        if (keywordsFromUser.length !== keywordsSafe.length) {
            searchBox.value = keywordsSafe;
        }
        var selectileList = null;
        this.search(selectile.klassLevelSelected, selectile.klassStationSelected, selectile.klassDaySelected, selectile.klassTimeSelected, searchBox.value);
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
        if (!(1 < keyword.length)) {
            // 대조하는 글자는 2글자 이상이어야 한다.
            return;
        }
        var selectileObj = null;
        for (var key in this.keywordMap) {
            var keyNoEmpty = key.replace(" ", "");
            var isOK = false;
            if (2 == keyNoEmpty.length && 2 == keyword.length) {
                isOK = true;
            }
            else if (2 < keyNoEmpty.length && (keyNoEmpty.length - 1) == keyword.length) {
                isOK = true;
            }
            if (!isOK) {
                continue;
            }
            if (0 === keyNoEmpty.indexOf(keyword)) {
                // 첫글자부터 시작, 2글자 이상 매칭되는 경우만 허용.(공백은 제거합니다.)
                selectileObj = this.keywordMap[key];
                break;
            } // end if
        } // end for
        return selectileObj;
    };
    KlassListComponent.prototype.getKeywordSafe = function (keyword) {
        var regex = new RegExp("[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\\x20]+", "gi");
        var keywordsSafe = keyword.replace(regex, "");
        return keywordsSafe;
    };
    KlassListComponent.prototype.onKeyupSearchInput = function (keywordsFromUser, searchBox, selectile) {
        // TODO 입력 가능하지 않은 문자는 검색 창에서 사라짐. - 유저에게 안내 필요.
        var keywordsSafe = this.getKeywordSafe(keywordsFromUser);
        if (keywordsFromUser.length !== keywordsSafe.length) {
            searchBox.value = keywordsSafe;
        }
        if ("" === keywordsFromUser &&
            this.keywordsFromUserPrev !== keywordsFromUser) {
            // 공백일 경우는, 필터만을 이용해서 검색하는 것으로 가정합니다.
            this.keywordsFromUserPrev = keywordsFromUser;
            this.search(selectile.klassLevelSelected, selectile.klassStationSelected, selectile.klassDaySelected, selectile.klassTimeSelected, "");
            return;
        }
        if (null === keywordsFromUser || keywordsFromUser.length < 2) {
            // 공백 및 1글자 입력은 처리하지 않습니다.
            return;
        }
        else if (!this.isSafeSelectile(selectile)) {
            return;
        }
        // 이전과 동일한 내용이라면 중단한다.
        if (null != this.keywordsFromUserPrev &&
            this.keywordsFromUserPrev === keywordsFromUser) {
            return;
        }
        // 다르다면 키워드를 등록.
        this.keywordsFromUserPrev = keywordsFromUser;
        this.setKeywordMap(selectile);
        // 안전한 문자열만 받습니다. 
        // 허용 문자열은 알파벳,한글,숫자입니다. 
        // 특수문자는 검색어로 허용하지 않습니다.
        var keywordList = keywordsFromUser.split(" ");
        var keywordListSafe = [];
        for (var i = 0; i < keywordList.length; ++i) {
            var keyword = keywordList[i];
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
        var selectileMatchList = [];
        var keywordFoundList = [];
        var keywordNotFoundList = [];
        for (var i = 0; i < keywordListSafe.length; ++i) {
            var keywordSafe = keywordListSafe[i];
            var selectileObj = this.searchKeywordMap(keywordSafe);
            if (null == selectileObj) {
                keywordNotFoundList.push(keywordSafe);
                continue;
            }
            selectileMatchList.push(selectileObj);
            keywordFoundList.push(keywordSafe);
        }
        // 필터와 매칭된 키워드를 selectile 리스트에 노출합니다.
        // 사용자가 입력한 키워드는 검색창에서 제외합니다.
        for (var i = 0; i < selectileMatchList.length; ++i) {
            var selectileMatch = selectileMatchList[i];
            selectile.klassSelectileSubject.next(selectileMatch);
            // 사용자가 입력 및 매칭된 키워드는 제거합니다.
            var keywordFound = keywordFoundList[i];
            searchBox.value = searchBox.value.replace(keywordFound, "");
        }
        // 필터와 매칭되지 않은 키워드는 "제목","설명"의 검색 키워드로 사용합니다.
        // 1개의 단어만 검색 키워드로 지원합니다. - 엔터키와 검색 버튼 click으로 진행.
        // 유저가 검색어를 입력한 상태. 유효한 키워드라면, 검색 버튼을 활성화 해줍니다.
        if (!this.isSearchEnabled) {
            this.isSearchEnabled = true;
        }
    };
    KlassListComponent.prototype.onClickWishList = function (event, klass) {
        event.stopPropagation();
        event.preventDefault();
    };
    KlassListComponent.prototype.onSelectKlass = function (event, klass) {
        event.stopPropagation();
        event.preventDefault();
        var isDebug = true;
        // let isDebug:boolean = false;
        if (isDebug)
            console.log("klass-list / onSelectKlass");
        if (isDebug)
            console.log("klass-list / onSelectKlass / klass : ", klass);
        var newClassId = -100;
        if (newClassId === +klass.id) {
            if (isDebug)
                console.log("klass-list / onSelectKlass / 새로운 클래스 만들기");
            this.gotoNewClassDetail(klass);
        }
        else if (0 < +klass.id) {
            if (isDebug)
                console.log("klass-list / onSelectKlass / 수업 상세 화면으로 이동하기");
            this.gotoClassDetail(klass);
        } // end if
    }; // end method
    KlassListComponent.prototype.gotoNewClassDetail = function (klass) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("klass-list / gotoNewClassDetail / init");
        this.router.navigate([klass.id], { relativeTo: this.route });
    };
    KlassListComponent.prototype.gotoClassDetail = function (klass) {
        // 수업 상세 페이지로 이동
        this.router.navigate([klass.id], { relativeTo: this.route });
    };
    KlassListComponent.prototype.onLoadFailClassImage = function (classImage, klassObj) {
        if (null != klassObj.class_img_err_url && "" != klassObj.class_img_err_url) {
            classImage.src = klassObj.class_img_err_url;
        }
    }; // end functions
    KlassListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-list.component.css'],
            templateUrl: 'klass-list.component.html',
        }), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, url_service_1.UrlService, user_service_1.UserService, teacher_service_1.TeacherService, my_logger_service_1.MyLoggerService, my_event_watchtower_service_1.MyEventWatchTowerService, my_checker_service_1.MyCheckerService, router_1.ActivatedRoute, router_1.Router])
    ], KlassListComponent);
    return KlassListComponent;
}());
exports.KlassListComponent = KlassListComponent;
//# sourceMappingURL=klass-list.component.js.map