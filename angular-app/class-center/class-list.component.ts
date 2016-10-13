import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Class, ClassService } from './class.service';
@Component({
  template: `
    <ul class="items">
      <li *ngFor="let _class of crises"
        [_class.selected]="isSelected(_class)"
        (click)="onSelect(_class)">
        <span class="badge">{{_class.id}}</span> {{_class.name}}
      </li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class ClassListComponent implements OnInit {
  crises: Class[];
  public selectedId: number;
  constructor(
    private service: ClassService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  isSelected(_class: Class) {
    return _class.id === this.selectedId;
  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCrises()
        .then(crises => this.crises = crises);
    });
  }
  onSelect(_class: Class) {
    this.selectedId = _class.id;
    // Navigate with relative link
    this.router.navigate([_class.id], { relativeTo: this.route });
  }
}
