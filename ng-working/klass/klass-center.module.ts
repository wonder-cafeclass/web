import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';

import { KlassService }              from './klass.service';
import { KlassRadioBtnService }      from './service/klass-radiobtn.service';
import { KlassCheckBoxService }      from './service/klass-checkbox.service';
import { KlassColorService }      from './service/klass-color.service';

import { KlassDetailResolve }        from './klass-detail-resolve.service';

import { KlassCenterComponent }      from './klass-center.component';
import { KlassListComponent }        from './klass-list.component';
import { KlassCenterHomeComponent }  from './klass-center-home.component';
import { KlassDetailComponent }      from './klass-detail.component';
import { KlassDetailNavListComponent }      from './klass-detail-nav-list.component';
import { KlassFilterTileComponent }  from './klass-filter-tile.component';
import { klassCenterRouting }        from './klass-center.routing';

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
import { RadioBtnHListComponent }    from '../widget/radiobtn/radiobtn-h-list.component';
import { CheckBoxHListComponent }    from '../widget/checkbox/checkbox-h-list.component';
import { NavTabsComponent }          from '../widget/nav-tabs/nav-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    klassCenterRouting
  ],
  declarations: [
    KlassCenterComponent,
    KlassListComponent,
    KlassCenterHomeComponent,
    KlassDetailComponent,
    KlassDetailNavListComponent,
    KlassFilterTileComponent,
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
    RadioBtnHListComponent,
    CheckBoxHListComponent,
    NavTabsComponent
  ],
  providers: [
    KlassService,
    KlassRadioBtnService,
    KlassCheckBoxService,
    KlassDetailResolve,
    KlassColorService
  ]
})
export class KlassCenterModule {}