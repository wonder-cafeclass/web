export class CClass {
  constructor(
    // id
    public id: number, 
    // 수업이름
    public title: string,
    // 수업설명
    public desc: string,
    // 시작날짜
    public dateBegin: string,
    // 시작시간
    public timeBegin: string,
    // 시작시간 이미지
    public timeBeginImgUrl: string,
    // 수업시간
    public timeDuration: number,
    // 종료시간
    public timeEnd: string,
    // 난이도
    public classLevel: string,
    // 난이도 이미지
    public classLevelImgLink: string,
    // 수업최소개월
    public monthMin: number,
    // 수업최장개월
    public monthMax: number,
    // 수업요일
    public classDay: string,
    // 수업요일 이미지
    public classDayImgUrl: string,
    // 주당수업횟수
    public classDayPerWeek: number,
    // 수업장소 - 화면에 표시될 이름
    public venue: string,
    // 수업장소 - 지하철 역
    public venueSubwayStation: string,
    // 수업장소 이미지 - 지하철 역
    public venueSubwayStationImgLink: string,
    // 수업장소 - 카페
    public venueCafe: string,
    // 수업장소 이미지 - 카페
    public venueCafeLogoImgLink: string,
    // 수업장소링크
    public venueLink: string,
    // 수업진행상태
    public classProgress: string,
    // 검색태그
    public searchTag: string,
    // 가격
    public price: number,
    // 수업운영상태
    public classStatus: string,
    // 이미지 링크    
    public classImgLink: string
  ) { }
}

const CCLASSES = [
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
        "http://cafeclass.kr/wp-content/uploads/2016/10/영어회화_잠실_카페클래스.jpg"
    ),
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
        "http://cafeclass.kr/wp-content/uploads/2016/09/초중급-영어회화_신천역_카페클래스.jpg"
    ),
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
        "http://cafeclass.kr/wp-content/uploads/2016/07/영어회화-송파역_카페클래스.jpg"
    )
];

let cclassesPromise = Promise.resolve(CCLASSES);

import { Injectable } from '@angular/core';

@Injectable()
export class CClassService {

  static nextCClassId = 100;

  getCClasses() { return cclassesPromise; }

  getCClass(id: number | string) {
    return cclassesPromise
      .then(cclasses => cclasses.find(cclass => cclass.id === +id));
  }


  addCClass(title: string) {
    title = title.trim();
    if (title) {
      // FIX ME

      // let cclass = new CClass(CClassService.nextCClassId++, title);
      // cclassesPromise.then(cclasses => cclasses.push(cclass));
    }
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/