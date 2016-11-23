import '../rxjs-extensions';

import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { CommonModule }                   from '@angular/common';
import { policyRouting }        		      from './policy.routing';

import { PolicyComponent }      		      from './policy.component';
import { PrivateInfoComponent }           from './private-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    policyRouting
  ],
  declarations: [
    PolicyComponent,
    PrivateInfoComponent
  ],
  providers: []
})
export class PolicyModule {}