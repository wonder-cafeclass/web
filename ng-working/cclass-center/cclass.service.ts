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
    // 수업시간
    public timeDuration: number,
    // 종료시간
    public timeEnd: string,
    // 난이도
    public classLevel: string,
    // 수업최소개월
    public monthMin: number,
    // 수업최장개월
    public monthMax: number,
    // 수업요일
    public classDay: string,
    // 주당수업횟수
    public classDayPerWeek: number,
    // 수업장소
    public venue: string,
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
    // 수업시간
    2,
    // 종료시간
    "12:00",
    // 난이도
    "초중급",
    // 수업최소개월
    1,
    // 수업최장개월
    3,
    // 수업요일
    "토요일",
    // 주당수업횟수
    1,
    // 수업장소
    "투썸플레이스 잠실역",  
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
    // 수업시간
    2,
    // 종료시간
    "21:30",
    // 난이도
    "초급",
    // 수업최소개월
    1,
    // 수업최장개월
    3,
    // 수업요일
    "목요일",
    // 주당수업횟수
    1,
    // 수업장소
    "종합운동장 신천역 세인트앤드류스",  
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