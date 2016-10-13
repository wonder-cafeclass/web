import { Component, OnInit, HostBinding,
         trigger, transition,
         animate, style, state }  from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Class }         from './class.service';
import { DialogService }  from '../dialog.service';
@Component({
  template: `
  <div *ngIf="_class">
    <h3>"{{editName}}"</h3>
    <div>
      <label>Id: </label>{{_class.id}}</div>
    <div>
      <label>Name: </label>
      <input [(ngModel)]="editName" placeholder="name"/>
    </div>
    <p>
      <button (click)="save()">Save</button>
      <button (click)="cancel()">Cancel</button>
    </p>
  </div>
  `,
  styles: ['input {width: 20em}'],
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
export class ClassDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') get routeAnimation() {
    return true;
  }
  @HostBinding('style.display') get display() {
    return 'block';
  }
  @HostBinding('style.position') get position() {
    return 'absolute';
  }
  _class: Class;
  editName: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService
  ) { }
  ngOnInit() {
    this.route.data.forEach((data: { _class: Class }) => {
      this.editName = data._class.name;
      this._class = data._class;
    });
  }
  cancel() {
    this.gotoCrises();
  }
  save() {
    this._class.name = this.editName;
    this.gotoCrises();
  }
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no _class or the _class is unchanged
    if (!this._class || this._class.name === this.editName) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }
  gotoCrises() {
    let classId = this._class ? this._class.id : null;
    // Pass along the _class id if available
    // so that the ClassListComponent can select that _class.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    this.router.navigate(['../', { id: classId, foo: 'foo' }], { relativeTo: this.route });
  }
}
