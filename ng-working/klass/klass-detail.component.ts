import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';

import { Klass }                   from './klass';
import { DialogService }           from '../widget/dialog.service';

@Component({
  moduleId: module.id,
  styleUrls: ['klass-detail.component.css'],
  templateUrl: 'klass-detail.component.html',
  animations: [
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateY(100%)'
        }))
      ])
    ])
  ]
})
export class KlassDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') get routeAnimation() {
    return true;
  }

  @HostBinding('style.display') get display() {
    return 'block';
  }

  @HostBinding('style.position') get position() {
    return 'absolute';
  }

  klass: Klass;
  editTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { klass: Klass }) => {
      this.editTitle = data.klass.title;
      this.klass = data.klass;
    });
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
    // Pass along the klass id if available
    // so that the KlassListComponent can select that klass.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
  }
}
