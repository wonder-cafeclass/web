import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ClassListComponent }    from './class-list.component';
import { ClassDetailComponent }  from './class-detail.component';

import { ClassesService } from './class.service';
import { classesRouting } from './class.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    classesRouting
  ],
  declarations: [
    ClassListComponent,
    ClassDetailComponent
  ],
  providers: [
    ClassesService
  ]
})
export class ClasssModule {}
