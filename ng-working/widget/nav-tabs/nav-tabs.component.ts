import {  Component, 
          OnInit, 
          Input, 
          Output,
          EventEmitter,
          HostListener, 
          ElementRef, 
          Renderer }      from '@angular/core';
import { RadioBtnOption } from '../radiobtn/model/radiobtn-option';

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

  @Input() cellWidth:number=100;

  @Input() colorTitleFocus:string;
  @Input() colorTitleBlur:string;
  @Input() colorBGFocus:string;
  @Input() colorBGBlur:string;
  @Input() colorBorder:string;

  @Input() isScrollAttachEnabled:boolean=true;

  @Output() emitter = new EventEmitter<any>();

  navHeight:number=50;




  constructor(private el:ElementRef,private renderer: Renderer) {}

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

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("nav-tabs / onScroll / init");
    if(isDebug) console.log("nav-tabs / onScroll / this.isScrollAttachEnabled : ",this.isScrollAttachEnabled);

    if(!this.isScrollAttachEnabled) {
      return;
    }

    let offsetTopParent:number = this.el.nativeElement.offsetParent.offsetTop;
    let scrollTop:number = document.body.scrollTop;

    if(!this.isScrollOver && offsetTopParent <= (scrollTop + this.navHeight)) {

      let clientWidthParent:number = this.el.nativeElement.offsetParent.clientWidth;
      let screenWidth:number = screen.width;
      let marginLeft:number = Math.round((screenWidth-clientWidthParent)/2);

      this.shimWidthStr=`${marginLeft}px`;
      this.isScrollOver = true;

    } else if(this.isScrollOver && (scrollTop + this.navHeight) < offsetTopParent){
      this.isScrollOver = false;
      this.shimWidthStr=null;
    }    
  }

  clickNav(event, radiobtnClicked) {

    event.stopPropagation();
    event.preventDefault();

    for (var i = 0; i < this.radiobtnList.length; ++i) {
      let radiobtn = this.radiobtnList[i];

      if(radiobtnClicked.myEvent.key === radiobtn.myEvent.key) {
        radiobtn.isFocus = true;
      } else {
        radiobtn.isFocus = false;
      }
    }

    // 부모 객체로 이벤트를 전파합니다.
    this.emitter.emit(radiobtnClicked.myEvent);
  }

  // @ Desc : 특정 탭을 포커싱합니다.
  setFocus(eventKey:string):void {

    for (var i = 0; i < this.radiobtnList.length; ++i) {
      let radiobtn = this.radiobtnList[i];

      if(eventKey === radiobtn.myEvent.key) {
        radiobtn.isFocus = true;
      } else {
        radiobtn.isFocus = false;
      }
    }

  } // end method

}