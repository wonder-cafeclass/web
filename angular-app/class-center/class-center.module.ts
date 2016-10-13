import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ClassListComponent }    from './class-list.component';
import { ClassDetailComponent }  from './class-detail.component';

import { ClassService } from './class.service';
import { classCenterRouting } from './class-center.routing';
import { ClassDetailResolve }  from './class-detail-resolve.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    classCenterRouting
  ],
  declarations: [
    ClassListComponent,
    ClassDetailComponent
  ],
  providers: [
    ClassService,
    ClassDetailResolve
  ]
})
export class ClassCenterModule {}
