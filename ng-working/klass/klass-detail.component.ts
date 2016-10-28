import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';

import { Klass }                   from './model/klass';
import { Calendar }                from '../widget/calendar/model/calendar';
import { ImageService }            from '../util/image.service';

import { DialogService }           from '../widget/dialog.service';
import { ClockBoardComponent }     from '../widget/clock/clock-board.component';
import { PriceTagComponent }       from '../widget/pricetag/pricetag.component';
import { ImageGridComponent }      from '../widget/image-grid/image-grid.component';

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

  klassCalendarTable:Calendar[][];

  editTitle: string;

  priceTagCurrency:string="₩";
  priceTagColor:string="#e85c41";
  priceTagWidth:number=105;
  priceTagCageWidth:number=105;

  selectileImageTable:string[][];
  selectileImageHeight:number=60;
  selectileImageWidth:number=60;
  selectileCageWidth:number=60;

  bannerImageTable:string[][];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public imageService: ImageService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {

    this.route.data.forEach((data: { klass: Klass }) => {

      if(null != data.klass) {
        this.klass = data.klass;
      }

      console.log("this.klass : ",this.klass);

      this.klassCalendarTable = this.klass.calendar_table;
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
