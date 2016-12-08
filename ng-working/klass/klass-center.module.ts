import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';

import { WidgetModule }              from '../widget/widget.module';

import { KlassService }              from './klass.service';
import { KlassRadioBtnService }      from './service/klass-radiobtn.service';
import { KlassCheckBoxService }      from './service/klass-checkbox.service';
import { KlassColorService }         from './service/klass-color.service';
import { KlassCommentService }       from './service/klass-comment.service';
import { MyRulerService }            from '../util/service/my-ruler.service';
import { MyCheckerService }          from '../util/service/my-checker.service';
import { ImageService }              from '../util/image.service';
import { CommentService }            from '../widget/comment/service/comment.service';

import { KlassDetailResolve }        from './klass-detail-resolve.service';

import { KlassCenterComponent }      from './klass-center.component';
import { KlassListComponent }        from './klass-list.component';
import { KlassCenterHomeComponent }  from './klass-center-home.component';
import { KlassDetailComponent }      from './klass-detail.component';
import { 
    KlassDetailNavListComponent 
}                                    from './klass-detail-nav-list.component';
import { KlassFilterTileComponent }  from './klass-filter-tile.component';
import { klassCenterRouting }        from './klass-center.routing';
import { KlassVenueSearchListComponent } from './widget/klass-venue-search-list.component';
import { KlassTeacherComponent }     from './widget/klass-teacher.component';

import { ClockBoardComponent }       from '../widget/clock/clock-board.component';
import { ClockDigitalComponent }     from '../widget/clock/clock-digital.component';
import { ClockComponent }            from '../widget/clock/clock.component';
import { CalendarComponent }         from '../widget/calendar/calendar.component';
import { MiniCalendarComponent }     from '../widget/calendar/mini-calendar.component';
import { PriceTagComponent }         from '../widget/pricetag/pricetag.component';
import { PriceTagHComponent }        from '../widget/pricetag/pricetag-h.component';
import { ButterflyComponent }        from '../widget/butterfly/butterfly.component';
import { ImageGridComponent }        from '../widget/image-grid/image-grid.component';
import { RadioBtnLinearComponent }   from '../widget/radiobtn/radiobtn-linear.component';

import { InputViewComponent }        from '../widget/input-view/input-view.component';
import { InputViewHListComponent }   from '../widget/input-view/input-view-h-list.component';
import { InputViewUpdownComponent }  from '../widget/input-view/input-view-updown.component';
import { InputViewTableComponent }   from '../widget/input-view-table/input-view-table.component';
import { SingleInputViewComponent }  from '../widget/input-view/single-input-view.component';
import { InputBtnsRowComponent }     from '../widget/input-view/input-btns-row.component';
import { InputsBtnsRowsComponent }     from '../widget/input-view/inputs-btns-rows.component';

import { RadioBtnHListComponent }    from '../widget/radiobtn/radiobtn-h-list.component';
import { CheckBoxHListComponent }    from '../widget/checkbox/checkbox-h-list.component';
import { SmartEditorComponent }      from '../widget/smart-editor/smart-editor.component';
import { CommentListComponent }      from '../widget/comment/comment-list.component';

// @ Deprecated
import { DronListComponent }         from '../widget/dron-list/dron-list.component';
import { InputRowComponent }         from '../widget/input-row/input-row.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    klassCenterRouting
  ],
  declarations: [
    KlassCenterComponent,
    KlassListComponent,
    KlassCenterHomeComponent,
    KlassDetailComponent,
    KlassDetailNavListComponent,
    KlassFilterTileComponent,
    KlassVenueSearchListComponent,
    KlassTeacherComponent,
    
    ClockBoardComponent,
    ClockDigitalComponent,
    ClockComponent,
    CalendarComponent,
    MiniCalendarComponent,
    PriceTagComponent,
    PriceTagHComponent,
    ButterflyComponent,
    ImageGridComponent,
    RadioBtnLinearComponent,
    
    InputViewComponent,
    InputViewHListComponent,
    InputViewTableComponent,
    InputViewUpdownComponent,
    InputBtnsRowComponent,
    InputsBtnsRowsComponent,

    SingleInputViewComponent,
    RadioBtnHListComponent,
    CheckBoxHListComponent,
    // NavTabsComponent,
    SmartEditorComponent,
    CommentListComponent,
    DronListComponent,    // @ Depreacted
    InputRowComponent
  ],
  providers: [
    KlassService,
    KlassRadioBtnService,
    KlassCheckBoxService,
    KlassDetailResolve,
    KlassColorService,
    MyRulerService,
    MyCheckerService,
    KlassCommentService,
    CommentService,
    ImageService
  ]
})
export class KlassCenterModule {}