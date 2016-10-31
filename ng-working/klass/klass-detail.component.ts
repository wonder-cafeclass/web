import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';

import { Klass }                   from './model/klass';
import { Calendar }                from '../widget/calendar/model/calendar';
import { ImageService }            from '../util/image.service';

import { DialogService }           from '../widget/dialog.service';
import { AuthService }             from '../auth.service';

import { CheckboxOption } from '../widget/checkbox/model/checkbox-option';
import { InputViewUpdown } from '../widget/input-view/model/input-view-updown';

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
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.route.data.forEach((data: { klass: Klass }) => {

      if(null != data.klass) {
        this.klass = data.klass;
      }

      // console.log("this.klass : ",this.klass);

      this.klassCalendarTableLinear = this.klass.calendar_table_linear;
      this.klassCalendarTableMonthly = this.klass.calendar_table_monthly;

      console.log("this.klassCalendarTableMonthly : ",this.klassCalendarTableMonthly);

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
          this.klass.venue_cafe_logo_img_url
        ],
        [
          this.klass.days_img_url,
          this.klass.time_begin_img_url,
          null
        ]
      ];
      let fieldCntSelectile = this.selectileImageTable[0].length;
      this.selectileCageWidth = (fieldCntSelectile * this.selectileImageWidth) + 20;

      // wonder.jung
      let fieldCntCalMonthly = this.klassCalendarTableMonthly.length;
      this.miniCalCageWidth = (fieldCntCalMonthly * this.miniCalWidth) + 5;

      this.bannerImageTable =
      [
        [
          this.imageService.get(this.imageService.noticeDrinksUrl)
        ],
        [
          this.imageService.get(this.imageService.noticeHelpUrl)
        ]
      ];
      
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

    // 최대수강신청기간
    this.checkboxOptionListCourseDuration = [
      new CheckboxOption("4주","4",true),
      new CheckboxOption("8주","8",false),
      new CheckboxOption("12주","12",false)
    ];


    


  }

  initAdmin() {

    this.watchTowerImgUrl = this.imageService.get(this.imageService.watchTowerUrl);

    // 수강신청일
    let optionList = [
      new CheckboxOption("4주마다","4",false),
      new CheckboxOption("2주마다","2",false),
      new CheckboxOption("매주마다","1",false)
    ];
    for (var i = 0; i < optionList.length; ++i) {
      let option = optionList[i];
      if(this.klass.enrollment_interval_week == +option.value) {
        option.isFocus = true;  
      }
      optionList[i] = option;
    }
    this.checkboxOptionListEnrollment = optionList;

    optionList = [
      new CheckboxOption("4주","4",true),
      new CheckboxOption("8주","8",false),
      new CheckboxOption("12주","12",false)
    ];
    for (var i = 0; i < optionList.length; ++i) {
      let option = optionList[i];
      if(this.klass.week_min == +option.value) {
        option.isFocus = true;  
      }
      optionList[i] = option;
    }
    this.checkboxOptionListCourseDurationMin = optionList;

    optionList = [
      new CheckboxOption("4주","4",true),
      new CheckboxOption("8주","8",false),
      new CheckboxOption("12주","12",false)
    ];
    for (var i = 0; i < optionList.length; ++i) {
      let option = optionList[i];
      if(this.klass.week_max == +option.value) {
        option.isFocus = true;  
      }
      optionList[i] = option;
    }
    this.checkboxOptionListCourseDurationMax = optionList;

    let updownList = [
      new InputViewUpdown("4주",12,"40000",12,"price","#f0f"),
      new InputViewUpdown("8주",12,"80000",12,"price","#f0f"),
      new InputViewUpdown("12주",12,"120000",12,"price","#f0f")
    ];
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

}
