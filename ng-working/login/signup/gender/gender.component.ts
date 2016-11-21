import {  Component, 
          Input, 
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'gender',
  templateUrl: 'gender.component.html',
  styleUrls: [ 'gender.component.css' ]
})
export class GenderComponent implements OnInit {

  @Input() top:number=-1;
  @Input() left:number=-1;

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  isFemale:boolean=true;

  constructor() {}

  ngOnInit(): void {}

  onClick(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFocus) {
      this.isFocus = true;      
    } // end if
  } 

  onBlur(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFocus) {
      this.isFocus = false;
    } // end if
  }  

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

  onClickGenderFemale(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(!this.isFemale) {
      this.isFemale = true;
    } // end if    
  }

  onClickGenderMale(event) :void {
    event.stopPropagation();
    event.preventDefault();

    if(this.isFemale) {
      this.isFemale = false;      
    } // end if
  }   

}
