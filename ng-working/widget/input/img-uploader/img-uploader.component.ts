import {  Component, 
          ViewChild,
          ElementRef,
          Renderer,  
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }             from '@angular/core';
import { Router }                     from '@angular/router';

import { UploadService }              from '../../../util/service/upload.service';
import { UrlService }                 from "../../../util/url.service";

import { MyCheckerService }           from '../../../util/service/my-checker.service';
import { MyChecker }                  from '../../../util/model/my-checker';
import { MyEventService }             from '../../../util/service/my-event.service';
import { MyEvent }                    from '../../../util/model/my-event';

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';
import { TooltipComponent }           from '../tooltip/tooltip.component';


@Component({
  moduleId: module.id,
  selector: 'img-uploader',
  templateUrl: 'img-uploader.component.html',
  styleUrls: [ 'img-uploader.component.css' ]
})
export class ImgUploaderComponent implements OnInit, AfterViewInit {

  /*
  * Samples *
  public uploadAPIUrl:string = '/CI/index.php/api/upload/userprofile';
  public imagePath:string = "/assets/images/class/banner";
  public imageUrl:string = "/assets/images/class/banner/banner_default.svg";
  */

  @Input() uploadAPIUrl:string = "";
  @Input() imagePath:string = "";
  @Input() imageUrl:string = "";
  @Input() eventKey:string = "";
  @Input() btnName:string = "올리기";
  @Input() fileSizeKBMax:number = 200; // 100000bytes --> 100kb
  @Input() fileWidth:number = 400; // px
  @Input() fileHeight:number = -1; // px / 음수일 경우는 너비의 비율에 맞춰 계산됨.
  @Input() fileMinWidth:number = 100; // px
  @Input() fileMinHeight:number = 100; // px
  @Input() fileMaxWidth:number = 800; // px
  @Input() fileMaxHeight:number = 800; // px

  @Output() emitter = new EventEmitter<MyEvent>();

  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild(TooltipComponent)
  private tooltipComponent: TooltipComponent;

  private myChecker:MyChecker;

  isAdmin:boolean=false;

  // isShowTooltip:boolean=false;
  // isValidInput:boolean=false;
  // tooltipMsg:string="";

  constructor(  private uploadService: UploadService,
                private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private renderer:Renderer,
                private urlService:UrlService  ) {}

  private isNotValidParams() :boolean {
    return !this.isValidParams();
  }
  private isValidParams() :boolean {

    if(!this.isValidUploadAPIUrl()) {
      return false;
    }
    if(!this.isValidImagePath()) {
      return false;
    }
    if(!this.isValidImageUrl()) {
      return false;
    }
    if(!this.isValidEventKey()) {
      return false;
    }

    return true;
  }
  private isValidUploadAPIUrl() :boolean {
    if(null == this.uploadAPIUrl || "" == this.uploadAPIUrl) {
      return false;
    }
    return true;
  }
  private isValidImagePath() :boolean {
    if(null == this.imagePath || "" == this.imagePath) {
      return false;
    }
    return true;
  }
  private isValidImageUrl() :boolean {
    if(null == this.imageUrl || "" == this.imageUrl) {
      return false;
    }
    return true;
  }
  private isValidEventKey() :boolean {
    if(null == this.eventKey || "" == this.eventKey) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / ngAfterViewInit");

    this.asyncViewPack();

  } 
  private asyncViewPack(): void {
    
    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("img-uploader / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("img-uploader / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
      this.init();
    }); // end subscribe

  }
  private setViewPack() :void {
    this.isAdmin = this.watchTower.getIsAdmin();
    this.myCheckerService.setReady(
      // checkerMap:any
      this.watchTower.getCheckerMap(),
      // constMap:any
      this.watchTower.getConstMap(),
      // dirtyWordList:any
      this.watchTower.getDirtyWordList(),
      // apiKey:string
      this.watchTower.getApiKey()
    ); // end setReady
  }   

  private setMyChecker() :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_thumbnail");
    }
  }

  private init() :void {
    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    
    this.setMyChecker();
  }  

  isNotOK(input:string) :boolean {
    return !this.isOK(input);
  }
  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }
  public setProfileImg(thumbnail:string) :void {

    if(this.isNotValidParams()) {
      return;
    }

    if(this.isOK(thumbnail)) {
      this.imageUrl = thumbnail;
    }
  }

  // @ Desc : 프로필 이미지가 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {

    if(this.isNotValidParams()) {
      return false;
    }

    let isOK:boolean = this.isOK(this.imageUrl);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("img-uploader / hasDone / history : ",history);
    }

    return isOK;
  } 
  public getProfileImgUrl() :string {
    return this.imageUrl;
  }

  private isValidEventkey():boolean {
    if(null == this.eventKey || "" == this.eventKey) {
      return false;
    }
    return true;
  }


  onFocusFileUpload(event) :void {
    event.stopPropagation();
    event.preventDefault();
  }

  onClickFileUpload(event) :void {

    event.stopPropagation();
    event.preventDefault();

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / onClickFileUpload / init");
    
    // from http://stackoverflow.com/a/32010791/217408
    let eventClick = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);

  }
  onChangeFile(event) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / onChangeFile / init");

    if(this.isNotValidParams()) {
      if(isDebug) console.log("img-uploader / onChangeFile / Params is not valid!");
      return;
    }

    // 툴팁을 노출되었다면 가립니다.
    this.tooltipComponent.hideTooltip();
    
    var files = event.srcElement.files;
    if(null == files || 1 != files.length) {
      // 1개의 파일만 업로드할 수 있습니다.
      return;
    }
    if(isDebug) console.log("img-uploader / onChangeFile / files : ",files);

    let file = files[0];
    let isValidFileType:boolean = false;
    if( file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png" || 
        file.type === "image/gif") {

      isValidFileType = true;
    }
    if(!isValidFileType) {
      this.tooltipComponent.showTooltipFailWarning("업로드할 수 없는 이미지 타입입니다", false);
      return;
    }

    let fileSizeBytesMax:number = this.fileSizeKBMax*1000;
    if(fileSizeBytesMax < file.size) {
      if(isDebug) console.log("img-uploader / onChangeFile / size : ",file.size);
      this.tooltipComponent.showTooltipFailWarning(`${ this.fileSizeKBMax }kb 이하 이미지로 올려주세요`, false);
      return;
    }

    // max size / 100kb
    // wonder.jung
    let req_url = this.urlService.get(this.uploadAPIUrl);
    let paramsObj = 
    {
      image_file_size:this.fileSizeKBMax,
      image_dir_dest:this.imagePath,
      desired_width:this.fileWidth,
      desired_height:this.fileHeight,
      min_width:this.fileMinWidth,
      max_width:this.fileMaxWidth,
      min_height:this.fileMinHeight,
      max_height:this.fileMaxHeight
    };    

    this.uploadService.makeFileRequest(req_url, paramsObj, files).subscribe((myResponse:MyResponse) => {
      // 섬네일 주소를 받아와서 화면에 표시해야 한다.
      if(isDebug) console.log("img-uploader / onChangeFile / myResponse : ",myResponse);

      if( null != myResponse && 
          null != myResponse.data && 
          null != myResponse.data.thumbnail) {

        // this.imageUrl = this.imagePath + myResponse.data.thumbnail;
        this.imageUrl = myResponse.data.thumbnail;

        if(isDebug) console.log("img-uploader / onChangeFile / this.imageUrl : ",this.imageUrl);

        let isOK:boolean = this.isOK(this.imageUrl);

        if(isDebug) console.log("img-uploader / onChangeFile / isOK : ",isOK);
        if(isDebug) console.log("img-uploader / onChangeFile / this.myChecker : ",this.myChecker);

        if(isOK && this.isValidEventkey()) {
          // 부모 객체에게 Change Event 발송 
          this.emitEventOnAddRow(
            // eventKey:string
            this.eventKey,
            // value:string
            this.imageUrl
          );
        } // end if

      }
    });

  } // end method

  private emitEventOnAddRow(eventKey:string, value:string) :void {

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("img-uploader / emitEventOnAddRow / 시작");

    if(null == eventKey) {
      if(isDebug) console.log("img-uploader / emitEventOnAddRow / 중단 / eventKey is not valid!");
      return;
    }
    if(null == value) {
      if(isDebug) console.log("img-uploader / emitEventOnAddRow / 중단 / value is not valid!");
      return;
    }

    let myEventOnChange:MyEvent =
    this.myEventService.getMyEvent(
      // public eventName:string
      this.myEventService.ON_ADD_ROW,
      // public key:string
      eventKey,
      // public value:string
      value,
      // public metaObj:any
      null,
      // public myChecker:MyChecker
      this.myChecker
    );
    this.emitter.emit(myEventOnChange);

    if(isDebug) console.log("img-uploader / emitEventOnAddRow / Done!");

  } // end method

}
