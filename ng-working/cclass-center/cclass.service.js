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
var CClass = (function () {
    function CClass(
        // id
        id, 
        // 수업이름
        title, 
        // 수업설명
        desc, 
        // 시작날짜
        dateBegin, 
        // 시작시간
        timeBegin, 
        // 시작시간 이미지
        timeBeginImgUrl, 
        // 수업시간
        timeDuration, 
        // 종료시간
        timeEnd, 
        // 난이도
        classLevel, 
        // 난이도 이미지
        classLevelImgLink, 
        // 수업최소개월
        monthMin, 
        // 수업최장개월
        monthMax, 
        // 수업요일
        classDay, 
        // 수업요일 이미지
        classDayImgUrl, 
        // 주당수업횟수
        classDayPerWeek, 
        // 수업장소 - 화면에 표시될 이름
        venue, 
        // 수업장소 - 지하철 역
        venueSubwayStation, 
        // 수업장소 이미지 - 지하철 역
        venueSubwayStationImgLink, 
        // 수업장소 - 카페
        venueCafe, 
        // 수업장소 이미지 - 카페
        venueCafeLogoImgLink, 
        // 수업장소링크
        venueLink, 
        // 수업진행상태
        classProgress, 
        // 검색태그
        searchTag, 
        // 가격
        price, 
        // 수업운영상태
        classStatus, 
        // 이미지 링크    
        classImgLink) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.dateBegin = dateBegin;
        this.timeBegin = timeBegin;
        this.timeBeginImgUrl = timeBeginImgUrl;
        this.timeDuration = timeDuration;
        this.timeEnd = timeEnd;
        this.classLevel = classLevel;
        this.classLevelImgLink = classLevelImgLink;
        this.monthMin = monthMin;
        this.monthMax = monthMax;
        this.classDay = classDay;
        this.classDayImgUrl = classDayImgUrl;
        this.classDayPerWeek = classDayPerWeek;
        this.venue = venue;
        this.venueSubwayStation = venueSubwayStation;
        this.venueSubwayStationImgLink = venueSubwayStationImgLink;
        this.venueCafe = venueCafe;
        this.venueCafeLogoImgLink = venueCafeLogoImgLink;
        this.venueLink = venueLink;
        this.classProgress = classProgress;
        this.searchTag = searchTag;
        this.price = price;
        this.classStatus = classStatus;
        this.classImgLink = classImgLink;
    }
    return CClass;
}());
exports.CClass = CClass;
var CCLASSES = [
    new CClass(
    // id
    1, 
    // 수업이름
    "소수정예 초중급 영어회화", 
    // 수업설명
    "틀려도 무조건 영어로 말하기 + 틀린 부분은 나중에 알려준다.", 
    // 시작날짜
    "2016-10-08", 
    // 시작시간
    "10:00", 
    // 시작시간 이미지 
    "assets/images/time/cafeclass_time_mn.png", 
    // 수업시간
    2, 
    // 종료시간
    "12:00", 
    // 난이도
    "초중급", 
    // 난이도 이미지
    "assets/images/level/class_levels_pre_intermediate.svg", 
    // 수업최소개월
    1, 
    // 수업최장개월
    3, 
    // 수업요일
    "토요일", 
    // 수업요일 이미지
    "assets/images/day/cafeclass_week_sat.png", 
    // 주당수업횟수
    1, 
    // 수업장소 - 화면에 표시될 이름
    "투썸플레이스 잠실역", 
    // 수업장소 - 지하철 역
    "잠실역", 
    // 수업장소 이미지 - 지하철 역
    "assets/images/subway/cafeclass_station_2nd_js.png", 
    // 수업장소 - 카페
    "투썸플레이스", 
    // 수업장소 이미지 - 카페
    "assets/images/cafes/logo/twosomeplace.svg", 
    // 수업장소링크
    "http://map.naver.com/?pinId=35135795&pinType=site&dlevel=12&y=fdcd665902373b826efc0d6f5fe69206&x=500b0955451f6cc123cc867c010f2177&enc=b64", 
    // 수업진행상태
    "모집중", 
    // 검색태그
    "모집|영어|잠실|석촌|토요일", 
    // 가격
    65000, 
    // 수업운영상태
    "New", 
    // 이미지 링크
    "http://cafeclass.kr/wp-content/uploads/2016/10/영어회화_잠실_카페클래스.jpg"),
    new CClass(
    // id
    2, 
    // 수업이름
    "매끄러운 영어", 
    // 수업설명
    "초중급 영어회화  하고 싶은 말을 영어로 매끄럽게", 
    // 시작날짜
    "2016-10-13", 
    // 시작시간
    "19:30", 
    // 시작시간 이미지 
    "assets/images/time/cafeclass_time_ev.png", 
    // 수업시간
    2, 
    // 종료시간
    "21:30", 
    // 난이도
    "초급", 
    // 난이도 이미지
    "assets/images/level/class_levels_elementary.svg", 
    // 수업최소개월
    1, 
    // 수업최장개월
    3, 
    // 수업요일
    "목요일", 
    // 수업요일 이미지
    "assets/images/day/cafeclass_week_thu.png", 
    // 주당수업횟수
    1, 
    // 수업장소 - 화면에 표시될 이름
    "종합운동장 신천역 세인트앤드류스", 
    // 수업장소 - 지하철 역
    "신천역", 
    // 수업장소 이미지 - 지하철 역
    "assets/images/subway/cafeclass_station_2nd_sc.png", 
    // 수업장소 - 카페
    "세인트앤드류스", 
    // 수업장소 이미지 - 카페
    "assets/images/cafes/logo/standrewscoffee.png", 
    // 수업장소링크
    "http://map.naver.com/?pinId=36432428&pinType=site&dlevel=12&y=bf1954ec3a182aea0826101150c84ceb&x=9f9fb57b478d2e6f7f8c19ccbfb5f6f4&enc=b64", 
    // 수업진행상태
    "모집중", 
    // 검색태그
    "모집|영어|잠실|신천|무조건|말하기", 
    // 가격
    65000, 
    // 수업운영상태
    "New", 
    // 이미지 링크
    "http://cafeclass.kr/wp-content/uploads/2016/09/초중급-영어회화_신천역_카페클래스.jpg"),
    new CClass(
    // id
    3, 
    // 수업이름
    "영어 회화, 틀려도 무조건 영어로 말하기", 
    // 수업설명
    "틀린 부분은 나중에 알려준다", 
    // 시작날짜
    "2016-10-12", 
    // 시작시간
    "17:10", 
    // 시작시간 이미지 
    "assets/images/time/cafeclass_time_af.png", 
    // 수업시간
    2, 
    // 종료시간
    "19:10", 
    // 난이도
    "초중급", 
    // 난이도 이미지
    "assets/images/level/class_levels_pre_intermediate.svg", 
    // 수업최소개월
    1, 
    // 수업최장개월
    3, 
    // 수업요일
    "수요일", 
    // 수업요일 이미지
    "assets/images/day/cafeclass_week_tue.png", 
    // 주당수업횟수
    1, 
    // 수업장소 - 화면에 표시될 이름
    "송파역-스타벅스 송파사거리점", 
    // 수업장소 - 지하철 역
    "송파역", 
    // 수업장소 이미지 - 지하철 역
    "assets/images/subway/cafeclass_station_8th_sp.png", 
    // 수업장소 - 카페
    "스타벅스", 
    // 수업장소 이미지 - 카페
    "assets/images/cafes/logo/starbucks.svg", 
    // 수업장소링크
    "http://map.naver.com/?pinId=36943350&dlevel=12&enc=b64&pinType=site&y=6a69e37b74a53f2c982b3869d09ca21c&x=87b8ea35d59fda89a0b4678c18e89a6e", 
    // 수업진행상태
    "모집중", 
    // 검색태그
    "모집|영어|잠실|송파|수요일", 
    // 가격
    65000, 
    // 수업운영상태
    "New", 
    // 이미지 링크
    "http://cafeclass.kr/wp-content/uploads/2016/07/영어회화-송파역_카페클래스.jpg")
];
var cclassesPromise = Promise.resolve(CCLASSES);
var core_1 = require('@angular/core');
var CClassService = (function () {
    function CClassService() {
    }
    CClassService.prototype.getCClasses = function () { return cclassesPromise; };
    CClassService.prototype.getCClass = function (id) {
        return cclassesPromise
            .then(function (cclasses) { return cclasses.find(function (cclass) { return cclass.id === +id; }); });
    };
    CClassService.prototype.addCClass = function (title) {
        title = title.trim();
        if (title) {
        }
    };
    CClassService.nextCClassId = 100;
    CClassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CClassService);
    return CClassService;
}());
exports.CClassService = CClassService;
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=cclass.service.js.map