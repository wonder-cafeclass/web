import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'phone-number',
  templateUrl: 'phone-number.component.html',
  styleUrls: [ 'phone-number.component.css' ]
})
export class PhoneNumberComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isFocusPhoneNumHead:boolean=false;
  isFocusPhoneNumBody:boolean=false;
  isFocusPhoneNumTail:boolean=false;
  isFocusPhoneNumInfo:boolean=false;  

  constructor() {}

  ngOnInit(): void {}

  onMouseOverInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusInfo) {
      this.isFocusInfo = true;      
    } // end if
  }

  onMouseOutInfo(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusInfo) {
      this.isFocusInfo = false;
    } // end if
  }

  onClickPhoneNumHead(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumHead) {
      this.isFocusPhoneNumHead = true;      
    } // end if
  } 

  onBlurPhoneNumHead(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumHead) {
      this.isFocusPhoneNumHead = false;
    } // end if
  } 

  onClickPhoneNumBody(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumBody) {
      this.isFocusPhoneNumBody = true;      
    } // end if
  } 

  onBlurPhoneNumBody(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumBody) {
      this.isFocusPhoneNumBody = false;
    } // end if
  }  

  onClickPhoneNumTail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocusPhoneNumTail) {
      this.isFocusPhoneNumTail = true;      
    } // end if
  } 

  onBlurPhoneNumTail(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocusPhoneNumTail) {
      this.isFocusPhoneNumTail = false;
    } // end if
  }   

}
