import '../rxjs-extensions';

import { NgModule }                  from '@angular/core';
import { FormsModule }               from '@angular/forms';
import { CommonModule }              from '@angular/common';

import { KlassService }              from './klass.service';
import { KlassDetailResolve }        from './klass-detail-resolve.service';

import { KlassCenterComponent }      from './klass-center.component';
import { KlassListComponent }        from './klass-list.component';
import { KlassCenterHomeComponent }  from './klass-center-home.component';
import { KlassDetailComponent }      from './klass-detail.component';
import { ClockComponent }            from '../widget/clock/clock.component';

import { KlassFilterTileComponent }  from './klass-filter-tile.component';

import { klassCenterRouting }        from './klass-center.routing';

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
    KlassFilterTileComponent,
    ClockComponent
  ],
  providers: [
    KlassService,
    KlassDetailResolve
  ]
})
export class KlassCenterModule {}