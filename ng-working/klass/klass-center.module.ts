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
    KlassFilterTileComponent

  ],
  providers: [
    KlassSimpleService
  ]
})
export class KlassCenterModule {}