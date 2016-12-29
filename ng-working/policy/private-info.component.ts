import {  Component, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'private-info',
  templateUrl: 'private-info.component.html',
  styleUrls: [ 'private-info.component.css' ]
})
export class PrivateInfoComponent implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {}

  onClickLogo(event):void {

    event.stopPropagation();
    event.preventDefault();

    // 홈으로 이동
    this.router.navigate(["/"]);
    
  } // end method
  
} // end class
