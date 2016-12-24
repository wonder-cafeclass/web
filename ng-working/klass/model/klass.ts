import { Calendar }                 from '../../widget/calendar/model/calendar';
import { KlassPrice }               from './klass-price';
import { KlassTeacher }             from './klass-teacher';
import { KlassReview }              from './klass-review';
import { KlassQuestion }            from './klass-question';
import { KlassCalendarDay }         from './klass-calendar-day';
import { KlassCalendar }            from './klass-calendar';
import { KlassVenue }               from './klass-venue';
import { HelperMyArray }            from '../../util/helper/my-array';
import { HelperMyIs }               from '../../util/helper/my-is';
import { HelperMyTime }             from '../../util/helper/my-time';

export class Klass {

    public id: number=-1;

    public teacher:KlassTeacher=null;
    public review_list:KlassReview[]=[];
    public question_list:KlassQuestion[]=[];
    public klassVenue:KlassVenue=null;

    public teacher_id:number=-1;
    public teacher_resume:string="";
    public teacher_resume_list:string[]=[];
    public teacher_greeting:string="";
    public teacher_greeting_list:string[]=[];

    public title: string="";
    public desc: string="";
    public feature: string="";
    public feature_list: string[]=[];
    public target: string="";
    public target_list: string[]=[];
    public schedule: string="";
    public date_begin: string="";
    public time_begin: string="";
    public time_begin_img_url: string="";
    public time_duration_minutes: number=-1;
    public time_end: string="";
    public level: string="";
    public level_eng: string="";
    public level_kor: string="";
    public level_img_url: string="";
    public week_min: number=-1;
    public week_max: number=-1;
    public week_list: string[]=[];
    public weekly_price_list: any[]=[];
    public month_min: number=-1;
    public month_max: number=-1;
    public days: string="";
    public days_list: string[]=[];
    public days_img_url: string="";
    public days_img_url_list: string[]=[];
    public days_eng: string="";
    public days_kor: string="";
    public class_day_per_week: number=-1; // 주 n회 수업

    public resume: string="";      // @ Deprecated
    public greeting: string="";    // @ Deprecated

    public venue: string="";
    public venue_cafe: string="";
    public venue_cafe_logo_img_url: string="";
    public venue_map_link: string="";

    // @ Deprecated
    public venue_subway_station: string="";
    public venue_subway_station_img_url: string="";

    // @ Recommended
    public subway_line: string="";
    public subway_station: string="";
    public subway_station_img: string="";

    public venue_title: string="";
    public venue_telephone: string="";
    public venue_address: string="";
    public venue_road_address: string="";
    public venue_latitude: string="";
    public venue_longitude: string="";

    public search_tag: string="";
    public price: number=-1;
    public price_list: string[]=[];
    public klass_price_list: KlassPrice[]=[];
    public price_list_width_discount: number[]=[];
    public discount:string="";
    public discount_arr:number[]=[];
    public price_with_format: string="";
    public class_status: string="";
    public enrollment_interval_week:number=-1;
    public class_banner_url:string="";
    public class_banner_url_arr:string[]=[];
    public class_poster_url:string="";
    public class_poster_url_loadable:string="";
    public calendar_table_linear: Calendar[][]=null;
    public calendar_table_monthly: Calendar[][][]=null;
    public klass_calendar_list: KlassCalendar[]=null;

    public date_created: string="";
    public date_updated: string="";

    private delimiter:string="|||";
    private myArray:HelperMyArray=null;
    private myIs:HelperMyIs=null;
    private myTime:HelperMyTime=null;

    constructor() {
        this.myArray = new HelperMyArray();
        this.myIs = new HelperMyIs();
        this.myTime = new HelperMyTime();
    }

    setFeatureList(featureList:string[]) :void {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass / setFeatureList / init");

        if(this.myArray.isNotOK(featureList)) {
            if(isDebug) console.log("klass / setFeatureList / 중단 / featureList is not valid!");
        } // end if

        this.feature_list = featureList;
        this.feature = featureList.join(this.delimiter);

    } // end method

    setTargetList(targetList:string[]) :void {

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass / setTargetList / init");

        if(this.myArray.isNotOK(targetList)) {
            if(isDebug) console.log("klass / setTargetList / 중단 / targetList is not valid!");
        } // end if

        this.target_list = targetList;
        this.target = targetList.join(this.delimiter);

    } // end method 
    
    setSchedule(schedule:string) :void { 

        let isDebug:boolean = true;
        // let isDebug:boolean = false;
        if(isDebug) console.log("klass / setSchedule / init");

        this.schedule = schedule;

    }

    setTeacherResumeList(resumeList:string[]) :void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setTeacherResumeList / init");

        if(this.myArray.isNotOK(resumeList)) {
            if(isDebug) console.log("klass / setTeacherResumeList / 중단 / resumeList is not valid!");
        } // end if

        this.teacher_resume = resumeList.join(this.delimiter);

    } // end method

    setTeacherGreetingList(greetingList:string[]) :void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setTeacherGreetingList / init");

        if(this.myArray.isNotOK(greetingList)) {
            if(isDebug) console.log("klass / setTeacherGreetingList / 중단 / greetingList is not valid!");
        } // end if

        this.teacher_greeting = greetingList.join(this.delimiter);

    } // end method

    // @ Desc : 네이버 맵에서 검색한 수업 장소 데이터를 저장합니다. klass 내의 venue관련 데이터도 함께 업데이트합니다.
    setKlassVenue(klassVenue:KlassVenue) :void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setKlassVenue / init");

        if(null == klassVenue) {
            return;
        } // end if
  
        this.klassVenue = klassVenue;

        this.venue_title = klassVenue.title;
        this.venue_telephone = klassVenue.telephone;
        this.venue_address = klassVenue.address;
        this.venue_road_address = klassVenue.roadAddress;
        this.venue_latitude = ""+klassVenue.latitude;
        this.venue_longitude = ""+klassVenue.longitude;

    }

    getKlassVenue() :KlassVenue {

        if(null == this.klassVenue) {
            this.klassVenue = 
            new KlassVenue().set(
                // title:string,
                this.venue_title,
                // telephone:string,
                this.venue_telephone,
                // address:string,
                this.venue_address,
                // roadAddress:string,
                this.venue_road_address,
                // latitude:number,
                +this.venue_latitude,
                // longitude:number
                +this.venue_longitude
            );
        } // end if
        
        return this.klassVenue;
    }

    // @ Desc : 수업의 대상을 배열 형태로 반환합니다.
    getTargetList() :string[] {

        if(null == this.target || "" === this.target) {
            return [];            
        }

        return this.target.split(this.delimiter);
    }

    // @ Desc : 수업의 특징을 배열 형태로 반환합니다.
    getFeatureList() :string[] {

        if(null == this.feature || "" === this.feature) {
            return [];            
        }

        return this.feature.split(this.delimiter);
    }
    /*
    // @ Desc : 수업의 특징을 1열 추가합니다.
    addFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        let featureList:string[] = this.getFeatureList();
        if(null == featureList) {
            featureList = [];
        }

        featureList.push(feature);

        this.feature = featureList.join(this.delimiter);

    } // end method
    removeFeature(feature:string):void {

        if(null == feature || "" === feature) {
            return;
        }

        // Do somthing...

    }
    */

    // @ Desc : 수업이 있는 요일을 추가합니다.
    addDay(day:string, imgUrl:string) :void {

        if(null == day || "" === day) {
            return;
        }
        if(null == imgUrl || "" === imgUrl) {
            return;
        }

        if(null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }
        this.days_list.push(day);
        this.days = this.days_list.join(this.delimiter);

        this.days_img_url_list.push(imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
    }
    // @ Desc : 수업이 있는 요일을 뺍니다.
    removeDay(day:string, imgUrl:string) :void {

        if(null == day || "" === day) {
            return;
        }
        if(null == imgUrl || "" === imgUrl) {
            return;
        }        

        if(null == this.days_list) {
            this.days_list = [];
            this.days_img_url_list = [];
        }

        this.days_list = this.myArray.removeStr(this.days_list, day);
        this.days = this.days_list.join(this.delimiter);

        this.days_img_url_list = this.myArray.removeStr(this.days_img_url_list, imgUrl);
        this.days_img_url = this.days_img_url_list.join(this.delimiter);
    }

    setTimeBegin(hhmmBegin:string) :void {
        if(this.myTime.isNotHHMM(hhmmBegin)) {
            return;
        }
        this.time_begin = hhmmBegin;

        if(this.myTime.isNotHHMM(this.time_end)) {
            return;
        }
        // 종료 시간이 있다면, 수업 시간을 구합니다.
        let diffMinutes:number = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if(0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if

    } // end method
    setTimeEnd(hhmmEnd:string) :void {
        if(this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.time_end = hhmmEnd;

        if(this.myTime.isNotHHMM(this.time_begin)) {
            return;
        }
        // 시작 시간이 있다면, 수업 시간을 구합니다.
        let diffMinutes:number = this.myTime.getDiffMinutesHHMM(this.time_begin, this.time_end);
        if(0 < diffMinutes) {
            this.time_duration_minutes = diffMinutes;
        } // end if
        
    }
    setTimeBeginEnd(hhmmBegin:string, hhmmEnd:string) :void {
        if(this.myTime.isNotHHMM(hhmmBegin) || this.myTime.isNotHHMM(hhmmEnd)) {
            return;
        }
        this.setTimeBegin(hhmmBegin);
        this.setTimeEnd(hhmmEnd);
    }

    hasNotBanner(banner:string) :boolean {
        return this.myArray.hasNotStr(this.class_banner_url_arr, banner);
    }
    hasBanner(banner:string) :boolean {
        return this.myArray.hasStr(this.class_banner_url_arr, banner);
    }
    removeBanner(banner:string):void {
        this.class_banner_url_arr = this.myArray.removeStr(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    }
    addBanner(banner:string):void {
        this.class_banner_url_arr = this.myArray.addStrUnique(this.class_banner_url_arr, banner);
        this.updateBannerUrl();
    }    
    private updateBannerUrl():void {
        this.class_banner_url = this.class_banner_url_arr.join(this.delimiter);
    }

    getEnrollmentDateList():KlassCalendarDay[] {

        if(null == this.klass_calendar_list || 0 == this.klass_calendar_list.length) {
            return [];
        } // end if

        let enrollmentDateList:KlassCalendarDay[] = [];
        for (var i = 0; i < this.klass_calendar_list.length; ++i) {
            let klassCalendar:KlassCalendar = this.klass_calendar_list[i];
            let klassCalDayList:KlassCalendarDay[] = klassCalendar.getDayList();

            for (var j = 0; j < klassCalDayList.length; ++j) {

                let klassCalDay:KlassCalendarDay = klassCalDayList[j];

                if(null === klassCalDay) {
                    continue;
                }
                if(klassCalDay.isExpired) {
                    continue; 
                }
                if(!klassCalDay.hasKlass) {
                    continue;
                }

                if(4 == +this.enrollment_interval_week && !klassCalDay.isEnrollment4weeks) {
                    continue; 
                } else if(2 == +this.enrollment_interval_week && !klassCalDay.isEnrollment2weeks) {
                    continue; 
                } else if(1 == +this.enrollment_interval_week && !klassCalDay.isEnrollmentWeek) {
                    continue;
                }

                if(klassCalDay.isEnrollment) {
                    enrollmentDateList.push(klassCalDay);
                } // end if

            } // end for

        } // end for

        return enrollmentDateList;
    }

    // @ Desc : 가장 최근 수업 등록 가능한 날짜(수업 시작 날짜) 를 가져옵니다.
    getEnrollmentDate():string {

        let enrollmentDateList:KlassCalendarDay[] = this.getEnrollmentDateList();
        if(null == enrollmentDateList || 0 == enrollmentDateList.length) {
            return "";
        } // end if

        let enrollmentDate:KlassCalendarDay = enrollmentDateList[0];

        return this.getEnrollmentDateStr(enrollmentDate);

    } // end method

    getEnrollmentDateStr(enrollmentDate:KlassCalendarDay):string {

        if(null == enrollmentDate) {
            return "";
        }

        return `${enrollmentDate.month}월 ${enrollmentDate.date}일 ${enrollmentDate.dayKor}요일`;
    }

    setKlassCalendarList(klassCalendarJSONList:any[]):void {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setKlassCalendarList / init");

        if(null == klassCalendarJSONList || 0 == klassCalendarJSONList.length) {
            if(isDebug) console.log("klass / setKlassCalendarList / 중단 / klassCalendarJSONList is not valid!");
            return;
        }

        let klassCalendarList:KlassCalendar[] = [];
        for (var i = 0; i < klassCalendarJSONList.length; ++i) {
            let monthJSON:any = klassCalendarJSONList[i];
            if(null == monthJSON) {
                if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / monthJSON is not valid! / idx-i : ${i}`);
                continue;
            }

            let klassCalendar = new KlassCalendar();

            for (var j = 0; j < monthJSON.length; ++j) {
                let weekJSON:any = monthJSON[j];
                if(null == weekJSON) {
                    if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / weekJSON is not valid! / idx-j : ${j}`);
                    continue;
                }

                for (var k = 0; k < weekJSON.length; ++k) {

                    let dayJSON:any = weekJSON[k];
                    if(null == dayJSON) {
                        // 달력에서 날짜가 빠진날
                        klassCalendar.addDay(null);
                        continue;
                    }
                    let klassCalendarDay = new KlassCalendarDay().setFromJSON(dayJSON);
                    if(null == klassCalendarDay) {
                        // Error Report
                        if(isDebug) console.log(`klass / setKlassCalendarList / 중단 / klassCalendarDay is not valid! / idx-k : ${k}`);
                        continue;
                    }

                    // 달력에서 날짜가 있는 날
                    if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendarDay : `,klassCalendarDay);
                    klassCalendar.addDay(klassCalendarDay);

                } // end for
                
            } // end for
            if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendar : `,klassCalendar);

            klassCalendarList.push(klassCalendar);
        } // end for

        this.klass_calendar_list = klassCalendarList;

        if(isDebug) console.log(`klass / setKlassCalendarList / klassCalendarList : `,klassCalendarList);
    }

    copy():Klass {

        return this.myIs.copy(
            // src:any
            this, 
            // copy:any
            new Klass()
        );

    } // end method

    setJSON(json):Klass {

        // let isDebug:boolean = true;
        let isDebug:boolean = false;
        if(isDebug) console.log("klass / setJSON / init");

        if(isDebug) console.log("klass / setJSON / json : ",json);

        let klass:Klass = this._setJSON(json);

        if(isDebug) console.log("klass / setJSON / klass : ",klass);

        // json 자동 설정 이후의 추가 작업을 여기서 합니다.

        // teacher
        if(null != klass.teacher) {
            klass.teacher = new KlassTeacher().setJSON(klass.teacher);
        }

        // review_list
        let klassReviewList:KlassReview[] = [];
        for (var i = 0; i < klass.review_list.length; ++i) {
            let reviewJSON = klass.review_list[i];
            if(null == reviewJSON) {
                continue;
            }

            let klassReview:KlassReview = new KlassReview().setJSON(reviewJSON);
            klassReviewList.push(klassReview);
        } // end for
        klass.review_list = klassReviewList;

        // question_list
        let klassQuestionList:KlassQuestion[] = [];
        for (var i = 0; i < klass.question_list.length; ++i) {
            let questionJSON = klass.question_list[i];
            if(null == questionJSON) {
                continue;
            }

            let klassQuestion:KlassQuestion = new KlassQuestion().setJSON(questionJSON);
            klassQuestionList.push(klassQuestion);
        } // end for
        klass.question_list = klassQuestionList;

        // teacher - resume
        if(null != klass.teacher_resume && "" != klass.teacher_resume) {
            klass.teacher_resume_list = klass.teacher_resume.split(this.delimiter);
        } // end if

        // teacher - greeting
        if(null != klass.teacher_greeting && "" != klass.teacher_greeting) {
            klass.teacher_greeting_list = klass.teacher_greeting.split(this.delimiter);
        } // end if

        // time_end
        if( null == klass.time_end || 
            "" === klass.time_end) {

          if( null != klass.time_begin && 
              "" != klass.time_begin && 
              !isNaN(klass.time_duration_minutes) ) {

            // 끝나는 시간이 없고, 시작 시간과 진행 시간 정보가 있다면 계산해서 넣어준다.
            klass.time_end = klass.myTime.addMinutesHHMM(klass.time_begin, klass.time_duration_minutes);

          } // end if

        } // end if  

        // days,
        if( null != klass.days && "" != klass.days ) {
            klass.days_list = klass.days.split(klass.delimiter);
        }

        // class_banner_url_arr,
        if(null != klass.class_banner_url && "" != klass.class_banner_url) {
            klass.class_banner_url_arr = klass.class_banner_url.split("|||");
        } else {
            klass.class_banner_url_arr = [];
        }

        // days_img_url_list
        if(null != klass.days_img_url && "" != klass.days_img_url) {
            klass.days_img_url_list = klass.days_img_url.split("|||");
        } else {
            klass.days_img_url_list = [];
        }

        // calendar_table_monthly
        klass.setKlassCalendarList(klass.calendar_table_monthly);

        return klass;

    } // end method

    private _setJSON(json):Klass {

        return this.myIs.copyFromJSON(
            // target:any,
            this,
            // json
            json
        );

    } // end method

}