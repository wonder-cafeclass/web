import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';

import { SharedModule }              from '../shared/shared.module';

import { klassCenterRouting }                from './klass-center.routing';
import { KlassCenterComponent }              from './klass-center.component';
import { KlassListComponent }                from './klass-list.component';
import { KlassFilterTileComponent }          from './klass-filter-tile.component';

import { KlassSimpleService }              from '../widget/klass/service/klass-simple.service';

// import { KlassService }              from './service/klass.service';
// import { KlassRadioBtnService }      from './service/klass-radiobtn.service';
// import { KlassCheckBoxService }      from './service/klass-checkbox.service';
// import { KlassColorService }         from './service/klass-color.service';
// import { KlassCommentService }       from './service/klass-comment.service';

// import { KlassDetailResolve }        from './klass-detail-resolve.service';

// import { KlassDetailComponent }              from './klass-detail.component';

// import { KlassCenterHomeComponent }          from './klass-center-home.component';
// import { KlassDetailNavListComponent }       from './klass-detail-nav-list.component';

// import { KlassTeacherComponent }             from './widget/klass-teacher.component';
// import { KlassVenueSearchListComponent }     from './widget/klass-venue-search-list.component';
// import { KlassPriceCalculatorComponent }     from './widget/klass-price-calculator.component';

// import { ClockBoardComponent }       from '../widget/clock/clock-board.component';
// import { ClockDigitalComponent }     from '../widget/clock/clock-digital.component';
// import { ClockComponent }            from '../widget/clock/clock.component';
// import { CalendarComponent }         from '../widget/calendar/calendar.component';
// import { MiniCalendarComponent }     from '../widget/calendar/mini-calendar.component';
// import { PriceTagComponent }         from '../widget/pricetag/pricetag.component';
// import { PriceTagHComponent }        from '../widget/pricetag/pricetag-h.component';
// import { ButterflyComponent }        from '../widget/butterfly/butterfly.component';
// import { ImageGridComponent }        from '../widget/image-grid/image-grid.component';
// import { RadioBtnLinearComponent }   from '../widget/radiobtn/radiobtn-linear.component';

// import { InputViewComponent }        from '../widget/input-view/input-view.component';
// import { InputViewHListComponent }   from '../widget/input-view/input-view-h-list.component';
// import { InputViewUpdownComponent }  from '../widget/input-view/input-view-updown.component';
// import { InputViewTableComponent }   from '../widget/input-view-table/input-view-table.component';
// import { SingleInputViewComponent }  from '../widget/input-view/single-input-view.component';

// import { RadioBtnHListComponent }    from '../widget/radiobtn/radiobtn-h-list.component';
// import { CheckBoxHListComponent }    from '../widget/checkbox/checkbox-h-list.component';
// import { SmartEditorComponent }      from '../widget/smart-editor/smart-editor.component';
// import { CommentListComponent }      from '../widget/comment/comment-list.component';
// import { CommentService }            from '../widget/comment/service/comment.service';
// import { InputRowComponent }         from '../widget/input-row/input-row.component';

// import { MyRulerService }            from '../util/service/my-ruler.service';
// import { MyCheckerService }          from '../util/service/my-checker.service';
// import { ImageService }              from '../util/image.service';

// import { TeacherService }            from '../teachers/service/teacher.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    klassCenterRouting
  ],
  declarations: [
    KlassCenterComponent,
    KlassListComponent,
    KlassFilterTileComponent,

    // KlassCenterHomeComponent,
    // KlassDetailComponent,
    // KlassDetailNavListComponent,
    
    // KlassVenueSearchListComponent,
    // KlassTeacherComponent,
    // KlassPriceCalculatorComponent,
    
    // ClockBoardComponent,
    // ClockDigitalComponent,
    // ClockComponent,
    // CalendarComponent,
    // MiniCalendarComponent,
    // PriceTagComponent,
    // PriceTagHComponent,
    // ButterflyComponent,
    // ImageGridComponent,
    // RadioBtnLinearComponent,
    
    // InputViewComponent,
    // InputViewHListComponent,
    // InputViewTableComponent,
    // InputViewUpdownComponent,

    // SingleInputViewComponent,
    // RadioBtnHListComponent,
    // CheckBoxHListComponent,
    // SmartEditorComponent,
    // CommentListComponent,
    // InputRowComponent
  ],
  providers: [
    KlassSimpleService,
    // KlassService,

    // KlassRadioBtnService,
    // KlassCheckBoxService,
    // KlassDetailResolve,
    // KlassColorService,
    // MyRulerService,
    // MyCheckerService,
    // KlassCommentService,
    // CommentService,
    // ImageService,
    // TeacherService
  ]
})
export class KlassCenterModule {}