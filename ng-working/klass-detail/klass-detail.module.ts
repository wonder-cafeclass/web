import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';

import { SharedModule }              from '../shared/shared.module';
import { WidgetModule }              from '../widget/widget.module';

import { KlassDetailComponent }              from './klass-detail.component';
import { KlassDetailNavListComponent }       from './klass-detail-nav-list.component';
import { klassDetailRouting }                from './klass-detail.routing';

import { KlassService }              from '../widget/klass/service/klass.service';
import { KlassRadioBtnService }      from '../widget/klass/service/klass-radiobtn.service';
import { KlassCheckBoxService }      from '../widget/klass/service/klass-checkbox.service';
import { KlassColorService }         from '../widget/klass/service/klass-color.service';
import { KlassCommentService }       from '../widget/klass/service/klass-comment.service';

import { KlassTeacherComponent }             from '../widget/klass/klass-teacher.component';
import { KlassVenueSearchListComponent }     from '../widget/klass/klass-venue-search-list.component';
import { KlassPriceCalculatorComponent }     from '../widget/klass/klass-price-calculator.component';

import { MyRulerService }            from '../util/service/my-ruler.service';
import { MyCheckerService }          from '../util/service/my-checker.service';
import { UploadService }             from '../util/service/upload.service';
import { ImageService }              from '../util/image.service';

import { TeacherService }            from '../teachers/service/teacher.service';


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
// import { HiddenUploaderComponent }   from '../widget/input/img-uploader/hidden-uploader.component';


// @ Common
// import { DefaultService }            from '../widget/input/default/service/default.service';
// import { MyTitleComponent }          from '../widget/input/title/my-title.component';
// import { ImageGridV2Component }      from '../widget/image-grid/image-grid-v2.component';
// import { ImageEntryComponent }       from '../widget/image-grid/image-entry.component';
// import { ImportComponent }           from '../widget/payment/import.component';
// import { PaymentService }            from '../widget/payment/service/payment.service';
// import { NavTabsComponent }          from '../widget/nav-tabs/nav-tabs.component';
// import { InputsBtnsRowsComponent }   from '../widget/input-view/inputs-btns-rows.component';
// import { InputBtnsRowComponent }     from '../widget/input-view/input-btns-row.component';
// import { TooltipComponent }          from '../widget/input/tooltip/tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    WidgetModule,
    klassDetailRouting
  ],
  declarations: [
    KlassDetailComponent,
    KlassDetailNavListComponent,
    
    KlassVenueSearchListComponent,
    KlassTeacherComponent,
    KlassPriceCalculatorComponent,
    
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
    // InputRowComponent,
    // HiddenUploaderComponent,
    // MyTitleComponent,
    // ImageGridV2Component,
    // ImageEntryComponent,
    // ImportComponent,
    // NavTabsComponent,
    // InputsBtnsRowsComponent,
    // InputBtnsRowComponent,
    // TooltipComponent
  ],
  providers: [
    KlassService,

    KlassRadioBtnService,
    KlassCheckBoxService,
    KlassColorService,
    MyRulerService,
    MyCheckerService,
    KlassCommentService,
    // CommentService,
    ImageService,
    TeacherService,
    // PaymentService,
    // DefaultService,
    UploadService
  ]
})
export class KlassDetailModule {}