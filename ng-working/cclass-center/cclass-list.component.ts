import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { CClass, CClassService } from './cclass.service';

@Component({
  styleUrls: ['./ng-working/cclass-center/cclass-list.component.css'],
  templateUrl: './ng-working/cclass-center/cclass-list.component.html'
})
export class CClassListComponent implements OnInit {
  cclasses: CClass[];
  public selectedId: number;

  constructor(
    private service: CClassService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  isSelected(cclass: CClass) {
    return cclass.id === this.selectedId;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['id'];
      this.service.getCClasses()
        .then(cclasses => this.cclasses = cclasses);
    });
  }

  onSelect(cclass: CClass) {
    this.selectedId = cclass.id;

    // Navigate with relative link
    this.router.navigate([cclass.id], { relativeTo: this.route });
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/