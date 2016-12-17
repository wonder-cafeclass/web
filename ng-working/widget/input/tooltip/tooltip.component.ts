import {  Component, 
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }       from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: [ 'tooltip.component.css' ]
})
export class TooltipComponent implements OnInit, AfterViewInit {

  @Input() marginTop:number = -73;
  @Input() marginLeft:number = 0;

  isShowTooltip:boolean=false;
  isFocus:boolean=false;
  isValid:boolean=false;
  tooltipMsg:string="";

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  // @ Desc : 실패 툴팁을 보여줍니다.
  public showTooltipFailWarning(msg:string, isTimeout:Boolean) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;    
    if(isDebug) console.log("tooltip / showTooltipFailWarning / init");
    if(isDebug) console.log("tooltip / showTooltipFailWarning / msg : ",msg);

    this.isShowTooltip = true;
    this.isFocus = true;
    this.isValid = false;
    this.tooltipMsg = msg;

    if(isDebug) console.log("tooltip / showTooltipFailWarning / this.isShowTooltip : ",this.isShowTooltip);

    if(null != isTimeout && isTimeout) {
      if(isDebug) console.log("tooltip / showTooltipFailWarning / this.hideTooltipHead(2)");
      this.hideTooltipInterval(2);
    } // end if

  }  

  private hideTooltipInterval(sec:number) :void {

    if(null == sec || !(0 < sec)) {
      sec = 3;
    }

    let _self = this;
    setTimeout(function() {
      // 메시지를 지정된 시간 뒤에 화면에서 지웁니다.
      _self.hideTooltip();
    }, 1000 * sec);

  } 

  public hideTooltip() :void {
    this.tooltipMsg = null;
    this.isValid = true;
    this.isFocus = false;
    this.isShowTooltip = false;
  }



}
