import {  Component, 
          OnInit, 
          Input, 
          HostListener, 
          Directive, 
          ElementRef, 
          Renderer }      from '@angular/core';
import { RadioBtnOption } from '../radiobtn/model/radiobtn-option';

@Directive({ selector: '[myHighlight]' })
@Component({
  moduleId: module.id,
  selector: 'nav-tabs',
  templateUrl: 'nav-tabs.component.html',
  styleUrls: [ 'nav-tabs.component.css' ]
})
export class NavTabsComponent implements OnInit {

  @Input() radiobtnList:RadioBtnOption[];
  @Input() fontSizeTitle:number=12;
  @Input() paddingTopTitle:number=10;
  @Input() cageWidth:number=-1;
  cageWidthStr:string;
  shimWidthStr:string;
  @Input() topLeftImageUrl:string;

  @Input() colorTitleFocus:string;
  @Input() colorTitleBlur:string;

  @Input() colorBGFocus:string;
  @Input() colorBGBlur:string;

  @Input() colorBorder:string;


  constructor(private el: ElementRef,private renderer: Renderer) {}

  ngOnInit(): void {
    if(0 < this.cageWidth) {
      this.cageWidthStr=`${this.cageWidth}px`;
    } else {
      this.cageWidthStr="100%";
    } // end if
  }

  isScrollOver:boolean=false;
  @HostListener('window:scroll', ['$event']) 
  onScroll(event) {

    let offsetTopParent:number = this.el.nativeElement.offsetParent.offsetTop;
    let scrollTop:number = document.body.scrollTop;

    if(!this.isScrollOver && offsetTopParent <= (scrollTop - 1)) {

      let clientWidthParent:number = this.el.nativeElement.offsetParent.clientWidth;
      let screenWidth:number = screen.width;
      let marginLeft:number = Math.round((screenWidth-clientWidthParent)/2);

      console.log("clientWidthParent : ",clientWidthParent);
      console.log("screenWidth : ",screenWidth);
      console.log("marginLeft : ",marginLeft);

      this.shimWidthStr=`${marginLeft}px`;
      this.isScrollOver = true;

    } else if(this.isScrollOver && scrollTop < offsetTopParent){
      this.isScrollOver = false;
      this.shimWidthStr=null;
    }
    
  }

  clickNav(event) {
    event.stopPropagation();
    console.log("clickNav / event : ",event);
  }

}