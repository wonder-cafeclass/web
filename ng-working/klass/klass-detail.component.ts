import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';

import { Klass }                   from './model/klass';
import { ImageService }            from '../util/image.service';

import { DialogService }           from '../widget/dialog.service';
import { ClockComponent }           from '../widget/clock/clock.component';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-detail.component.css'],
  templateUrl: 'klass-detail.component.html'
})
export class KlassDetailComponent implements OnInit {

  klass: Klass;
  klassTimeBegin:string;
  klassTimeEnd:string;
  editTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public imageService: ImageService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {

    this.route.data.forEach((data: { klass: Klass }) => {

      if(null != data.klass) {
        this.klass = data.klass;
      }

    });

    // TEST clock
    this.klassTimeBegin = this.klass.time_begin;
    this.klassTimeEnd = this.klass.time_end;

  }

  cancel() {
    this.gotoKlassList();
  }

  save() {
    this.klass.title = this.editTitle;
    this.gotoKlassList();
  }

  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
    if (!this.klass || this.klass.title === this.editTitle) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }

  gotoKlassList() {
    let klassId = this.klass ? this.klass.id : null;

    console.log("gotoKlassList / klassId : ",klassId);

    // Pass along the klass id if available
    // so that the KlassListComponent can select that klass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises

    // this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
  }

  // EVENT
  onClickEnrollment(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickWishList(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickEnrollment / klass ::: ",klass);
  }

  onClickYellowID(event, klass:Klass) {
    event.stopPropagation();
    console.log("onClickYellowID / klass ::: ",klass);
  }

}
