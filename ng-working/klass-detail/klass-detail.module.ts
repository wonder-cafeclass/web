import '../rxjs-extensions';

import { NgModule }                          from '@angular/core';
import { FormsModule }                       from '@angular/forms';
import { CommonModule }                      from '@angular/common';

import { SharedModule }                      from '../shared/shared.module';
import { WidgetModule }                      from '../widget/widget.module';

import { KlassDetailComponent }              from './klass-detail.component';
import { KlassDetailNavListComponent }       from './klass-detail-nav-list.component';
import { klassDetailRouting }                from './klass-detail.routing';

import { KlassService }                      from '../widget/klass/service/klass.service';
import { KlassRadioBtnService }              from '../widget/klass/service/klass-radiobtn.service';
import { KlassCheckBoxService }              from '../widget/klass/service/klass-checkbox.service';
import { KlassColorService }                 from '../widget/klass/service/klass-color.service';
import { KlassCommentService }               from '../widget/klass/service/klass-comment.service';

import { KlassTeacherComponent }             from '../widget/klass/klass-teacher.component';
import { KlassVenueSearchListComponent }     from '../widget/klass/klass-venue-search-list.component';
import { KlassPriceCalculatorComponent }     from '../widget/klass/klass-price-calculator.component';

import { MyRulerService }                    from '../util/service/my-ruler.service';
import { MyCheckerService }                  from '../util/service/my-checker.service';
import { UploadService }                     from '../util/service/upload.service';
import { ImageService }                      from '../util/image.service';

import { TeacherService }                    from '../teachers/service/teacher.service';

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
    KlassPriceCalculatorComponent
  ],
  providers: [
    KlassService,
    KlassRadioBtnService,
    KlassCheckBoxService,
    KlassColorService,
    MyRulerService,
    MyCheckerService,
    KlassCommentService,
    ImageService,
    TeacherService,
    UploadService
  ]
})
export class KlassDetailModule {}