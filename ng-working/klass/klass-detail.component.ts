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
import { KlassCheckboxService }    from './service/klass-checkbox.service';

import { CheckboxOption }          from '../widget/checkbox/model/checkbox-option';
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
  checkboxOptionListCourseDuration:CheckboxOption[];

  // Admin Section
  checkboxOptionListEnrollment:CheckboxOption[];
  checkboxOptionListCourseDurationMin:CheckboxOption[];
  checkboxOptionListCourseDurationMax:CheckboxOption[];

  klassPriceList:InputViewUpdown[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public imageService: ImageService,
    public dialogService: DialogService,
    private authService: AuthService,
    private myEventService: MyEventService,
    private checkboxService:KlassCheckboxService
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

      // wonder.jung
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
      this.checkboxOptionListCourseDuration =
      this.checkboxService.getKlassEnrolmentWeeks(this.klass, 0);

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

  initAdmin() {

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);

    // 수강신청 가능 기간
    let optionList:CheckboxOption[] = 
    this.checkboxService.getKlassEnrolmentInterval(this.klass, ""+this.klass.enrollment_interval_week);
    this.checkboxOptionListEnrollment = optionList;

    // 가장 짧은 수강 기간
    optionList = this.checkboxService.getKlassWeeksMin(this.klass, ""+this.klass.week_min);
    this.checkboxOptionListCourseDurationMin = optionList;

    // 가장 긴 수강 기간
    optionList = this.checkboxService.getKlassWeeksMax(this.klass, ""+this.klass.week_max);
    this.checkboxOptionListCourseDurationMax = optionList;

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
            "4",
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

  onChangedFromInputView(myEvent:MyEvent) {

    let eventName:string = myEvent.eventName;
    let myEventService:MyEventService = this.myEventService;

    if(this.myEventService.is_it(eventName,myEventService.ON_CHANGE_KLASS_ENROLMENT_INTERVAL)) {
      // '수강신청일'이 변경되었습니다.

      // 1. 표시된 달력의 수강시작일 표시가 변경된 데이터에 맞게 표시되어야 합니다.
      let interval:number = +myEvent.value;
      let cloneTableGroup = this.klassCalendarTableMonthly;
      for (var i = 0; i < cloneTableGroup.length; ++i) {

        // 한달의 4개 이상의 수업이 있어야 4주마다 참여할 수 있음.
        // 한달의 2개 이상의 수업이 있어야 2주마다 참여할 수 있음.
        
        let table = cloneTableGroup[i];
        let isFirstClass:boolean=false;
        for (var j = 0; j < table.length; ++j) {
          let row = table[j];
          for (var k = 0; k < row.length; ++k) {
            let field = row[k];

            if(null == field) {
              continue;
            }
            if(!field.hasKlass) {
              // 수업이 없는 날은 제외
              continue;
            }
            if(field.isExpired) {
              // 지난 날은 제외
              continue;
            }

            // 수업 시작은 모두 아닌 것으로 초기화.
            field.isEnrollment = false;

            // 매주 수강이 가능한 경우의 날짜들만 필터링.
            if(4 === interval && field.isEnrollment4weeks) {
              // 4주마다 새로 강의 참여가 가능.
              // 매월 첫번째 강의 날에만 참여할 수 있음.
              field.isEnrollment = true;
            } else if(2 === interval && field.isEnrollment2weeks) {
              // 2주마다 새로 강의 참여가 가능.
              // 매월 첫번째,세번째 강의 날에만 참여할 수 있음.
              field.isEnrollment = true;
            } else if(1 === interval && field.isEnrollmentWeek) {
              // 매주마다 새로 강의 참여가 가능.
              // 모든 주에 신청이 가능.
              field.isEnrollment = true;
            } // end if
          } // end for
        } // end for
      } // end for
    }

    

  }

}
