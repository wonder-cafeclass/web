import {  Component, 
          ViewChild,
          OnInit, 
          AfterViewInit,
          Output, 
          EventEmitter,
          Input }                     from '@angular/core';

import { Router }                     from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'my-footer',
  templateUrl: 'footer.component.html',
  styleUrls: [ 'footer.component.css' ]
})
export class FooterComponent implements OnInit, AfterViewInit {

  constructor(public router:Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onClickInfo(event) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickContact(event) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickContact / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/']);

  }

  onClickPolicy(event) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickPolicy / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/policy']);

  }

  onClickPrivateInfo(event) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("footer / onClickPrivateInfo / 시작");

    event.stopPropagation();
    event.preventDefault();

    this.router.navigate(['/private-info']);

  }  

}