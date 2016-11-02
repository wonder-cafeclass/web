import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';

import { Klass }                   from './model/klass';
import { KlassPrice }              from './model/klass-price';
import { Calendar }                from '../widget/calendar/model/calendar';
import { ImageService }            from '../util/image.service';
import { MyEventService }          from '../util/my-event.service';
import { MyEvent }                 from '../util/model/my-event';

import { DialogService }           from '../widget/dialog.service';
import { AuthService }             from '../auth.service';
import { KlassRadioBtnService }    from './service/klass-radiobtn.service';
import { KlassCheckBoxService }    from './service/klass-checkbox.service';

import { RadioBtnOption }          from '../widget/radiobtn/model/radiobtn-option';
import { CheckBoxOption }          from '../widget/checkbox/model/checkbox-option';
import { InputViewUpdown }         from '../widget/input-view/model/input-view-updown';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-detail.component.css'],
  templateUrl: 'klass-detail.component.html'
})
export class KlassDetailComponent implements OnInit {

  klass: Klass;
  klassTimeBegin:string;
  klassTimeEnd:string;

  klassDayBegin:string;
  klassDateBegin:string;
  
  klassPriceMin:string;
  klassPriceMax:string;
  klassWeekMin:number;
  klassWeekMax:number;

  klassCalendarTableLinear:Calendar[][];
  klassCalendarTableMonthly:Calendar[][][];

  editTitle: string;

  priceTagCurrency:string="₩";
  priceTagColor:string="#e85c41";
  priceTagWidth:number=105;
  priceTagCageWidth:number=105;
  pricePerWeekFormat:string="주";

  selectileImageTable:string[][];
  selectileImageHeight:number=60;
  selectileImageWidth:number=60;
  selectileCageWidth:number=60;

  miniCalHeight:number=60;
  miniCalWidth:number=60;
  miniCalCageWidth:number=60;

  bannerImageTable:string[][];

  isAdmin:boolean=false;

  watchTowerImgUrl:string;
  radiobtnOptionListCourseDuration:RadioBtnOption[];

  // Admin Section
  radiobtnOptionListEnrollment:RadioBtnOption[];
  checkboxOptionListKlassDay:CheckBoxOption[];

  klassPriceList:InputViewUpdown[];

  firstClassDate:Calendar;
  firstClassDateFormatStr:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public imageService: ImageService,
    public dialogService: DialogService,
    private authService: AuthService,
    private myEventService: MyEventService,
    private radiobtnService:KlassRadioBtnService,
    private checkboxService:KlassCheckBoxService
  ) {}

  ngOnInit() {

    this.route.data.forEach((data: { klass: Klass }) => {

      if(null != data.klass) {
        this.klass = data.klass;
      }

      this.klassCalendarTableLinear = this.klass.calendar_table_linear;
      this.klassCalendarTableMonthly = this.klass.calendar_table_monthly;

      this.klassDayBegin = this.klass.days;

      // send time data to "clock board"
      this.klassTimeBegin = this.klass.time_begin;
      this.klassTimeEnd = this.klass.time_end;

      this.klassDateBegin = this.klass.date_begin;
      this.klassWeekMin = this.klass.week_min;
      this.klassWeekMax = this.klass.week_max;

      this.priceTagCageWidth = this.klass.weekly_price_list.length * this.priceTagWidth;

      // send image table to "image-grid"
      this.selectileImageTable =
      [
        [
          this.klass.level_img_url, 
          this.klass.venue_subway_station_img_url,
          this.klass.venue_cafe_logo_img_url,
          this.klass.days_img_url,
          this.klass.time_begin_img_url,
        ]
      ];      
      let fieldCntSelectile = this.selectileImageTable[0].length;
      this.selectileCageWidth = (fieldCntSelectile * this.selectileImageWidth) + 20;

      let fieldCntCalMonthly = this.klassCalendarTableMonthly.length;
      this.miniCalCageWidth = (fieldCntCalMonthly * this.miniCalWidth);

      this.bannerImageTable =
      [
        [
          this.imageService.get(this.imageService.noticeDrinksUrl)
        ],
        [
          this.imageService.get(this.imageService.noticeHelpUrl)
        ]
      ];

      this.pricePerWeekFormat = this.klass.week_min + this.pricePerWeekFormat;

      // 유저 수강 기간
      this.radiobtnOptionListCourseDuration =
      this.radiobtnService.getKlassEnrolmentWeeks(this.klass, 0);

      // 첫수업 날짜 가져오기
      this.setFirstClassDateFormat();
      // REMOVE ME
      /*
      this.firstClassDate = this.getFirstClassDate(this.klass);
      if(this.firstClassDate) {
        this.firstClassDateFormatStr = `${this.firstClassDate.month}월 ${this.firstClassDate.date}일 ${this.firstClassDate.dayKor}요일`;
      }
      */
    });

    this.authService.getAdminAuth().then(
      result => {
        if(null != result.is_admin) {
          this.isAdmin = result.is_admin;

          // 운영툴 여부 결정 
          if(this.isAdmin){
            this.initAdmin();            
          }
        }
      }
    );


    


  }

  private setFirstClassDateFormat() :void {
    this.firstClassDate = this.getFirstClassDate(this.klass);

    console.log("HERE / setFirstClassDateFormat / this.firstClassDate : ",this.firstClassDate);

    if(this.firstClassDate) {
      this.firstClassDateFormatStr = `${this.firstClassDate.month}월 ${this.firstClassDate.date}일 ${this.firstClassDate.dayKor}요일`;
    }
  }
  private getFirstClassDate(klass:Klass) :Calendar {

    let calendar_table_monthly = klass.calendar_table_monthly;
    for (var i = 0; i < calendar_table_monthly.length; ++i) {
      let calendar_table = calendar_table_monthly[i];
      // console.log("calendar_table : ",calendar_table);
      for (var j = 0; j < calendar_table.length; ++j) {
        let week = calendar_table[j];
        // console.log("week : ",week);
        for (var k = 0; k < week.length; ++k) {
          let date:Calendar = week[k];
          // console.log("date : ",date);

          if(null === date) {
            continue;
          }
          if(date.isExpired) {
            continue; 
          }
          if(!date.hasKlass) {
            continue;
          }

          if(4 == +klass.enrollment_interval_week && !date.isEnrollment4weeks) {
            continue; 
          } else if(2 == +klass.enrollment_interval_week && !date.isEnrollment2weeks) {
            continue; 
          } else if(1 == +klass.enrollment_interval_week && !date.isEnrollmentWeek) {
            continue; 
          }

          // 첫 수업을 찾았습니다.
          return date;
        }
      }
    }

    return null;
  }

  initAdmin() {

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);

    // 수강신청 가능 기간
    let optionList:RadioBtnOption[] = 
    this.radiobtnService.getKlassEnrolmentInterval(this.klass, ""+this.klass.enrollment_interval_week);
    this.radiobtnOptionListEnrollment = optionList;

    let updownList = [];
    for (var i = 0; i < this.klass.klass_price_list.length; ++i) {

      let klassPrice:KlassPrice = this.klass.klass_price_list[i];

      let updown:InputViewUpdown = 
      new InputViewUpdown(
        // public myEvent:MyEvent
        new MyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE_KLASS_ENROLMENT_WEEKS,
            // public title:string
            klassPrice.weeks + "주",
            // public key:string
            "week_max",
            // public value:string
            "" + klassPrice.discount,
            // public metaObj:any
            this.klass
        ),
        // public fontSizeTitle:number
        12,
        // public fontSizeText:number
        12, 
        // public type:string
        "price",
        // public color:string
        "#f0f"
      );

      updownList.push(updown);
    }

    // 운영자 지정 - 수업 요일 
    // days_list
    // wonder.jung
    this.checkboxOptionListKlassDay = this.checkboxService.getKlassDays(this.klass);
    console.log("TEST / this.checkboxOptionListKlassDay : ",this.checkboxOptionListKlassDay);


    this.klassPriceList = updownList;
  }

  cancel() {
    this.gotoKlassList();
  }

  save() {
    this.klass.title = this.editTitle;
    this.gotoKlassList();
  }

  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
    if (!this.klass || this.klass.title === this.editTitle) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }

  gotoKlassList() {
    let klassId = this.klass ? this.klass.id : null;

    console.log("gotoKlassList / klassId : ",klassId);

    // Pass along the klass id if available
    // so that the KlassListComponent can select that klass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises

    // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
  }

  // EVENT
  onClickEnrollment(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickWishList(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickYellowID(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickYellowID / klass ::: ",klass);
  }

  onChangedFromMiniCalendar(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    if(this.myEventService.is_it(eventName,myEventService.ON_MOUSEENTER_KLASS_CALENDAR_DATE)) {
      console.log("ON_MOUSEENTER_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
    } else if(this.myEventService.is_it(eventName,myEventService.ON_MOUSELEAVE_KLASS_CALENDAR_DATE)) {
      console.log("ON_MOUSELEAVE_KLASS_CALENDAR_DATE / myEvent : ",myEvent);
    }

  }

  // @ Deprecated
  onChangedFromInputView(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
      // '수강신청일'이 변경되었습니다.
      console.log("'수강신청일'이 변경되었습니다.");
    } // end if
  }

  onChangedFromChild(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {

      // '수강신청일'이 변경되었습니다.
      // console.log("onChangedFromChild / eventName : ",eventName);
      // console.log("onChangedFromChild / myEvent.value : ",myEvent.value);

      let weekInterval:number = +myEvent.value;

      // 첫수업날짜가 변경됩니다.
      if(4 === weekInterval) {

        this.klass.enrollment_interval_week = 4;
        this.setFirstClassDateFormat();
        console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 4주");

      } else if(2 === weekInterval) {

        this.klass.enrollment_interval_week = 2;
        this.setFirstClassDateFormat();
        console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 2주");

      } else if(1 === weekInterval) {

        this.klass.enrollment_interval_week = 1;
        this.setFirstClassDateFormat();
        console.log("onChangedFromChild / '수강신청일'이 변경되었습니다. / 매주");

      }


    } // end if



  }
}
