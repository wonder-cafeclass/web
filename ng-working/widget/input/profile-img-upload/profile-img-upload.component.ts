import {  Component, 
          ViewChild,
          ElementRef,
          Renderer,  
          Input, 
          Output,
          EventEmitter,
          OnInit,
          AfterViewInit }       from '@angular/core';
import { Router }               from '@angular/router';

import { UploadService }        from '../../../util/service/upload.service';
import { UrlService }           from "../../../util/url.service";

import { MyCheckerService }     from '../../../util/service/my-checker.service';
import { MyChecker }            from '../../../util/model/my-checker';
import { MyEventService }       from '../../../util/service/my-event.service';
import { MyEvent }              from '../../../util/model/my-event';

import { MyLoggerService }            from '../../../util/service/my-logger.service';
import { MyEventWatchTowerService }   from '../../../util/service/my-event-watchtower.service';
import { MyResponse }                 from '../../../util/model/my-response';



@Component({
  moduleId: module.id,
  selector: 'profile-img-upload',
  templateUrl: 'profile-img-upload.component.html',
  styleUrls: [ 'profile-img-upload.component.css' ]
})
export class ProfileImgUploadComponent implements OnInit, AfterViewInit {

  private uploadUserProfileUrl:string = '/CI/index.php/api/upload/userprofile';
  public userProfilePath:string = "/assets/images/user/";
  public userProfileUrl:string = "/assets/images/user/user_anonymous_150x150_orange.png";

  public userProfileSampleArr:string[] = [
    "/assets/images/user/user_anonymous_150x150_cat.jpg",
    "/assets/images/user/user_anonymous_150x150_lion.jpg",
    "/assets/images/user/user_anonymous_150x150_dolphin.jpg",
    "/assets/images/user/user_anonymous_150x150_parrot.jpg",
    "/assets/images/user/user_anonymous_150x150_poppy.jpg"
  ];

  @Input() top:number=-1;
  @Input() left:number=-1;

  @Output() emitter = new EventEmitter<MyEvent>();

  isFocus:boolean=false;
  isFocusInfo:boolean=false;

  @ViewChild('fileInput') fileInput:ElementRef;

  isShowPopover:boolean=false;

  private myChecker:MyChecker;

  isAdmin:boolean=false;

  constructor(  private uploadService: UploadService,
                private myEventService:MyEventService,
                private myLoggerService:MyLoggerService,
                private watchTower:MyEventWatchTowerService, 
                private myCheckerService:MyCheckerService,
                private renderer:Renderer,
                private urlService:UrlService  ) {}

  ngOnInit(): void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("profile-img-upload / ngOnInit / init");

  }

  ngAfterViewInit(): void {

    // 자식 뷰가 모두 완료된 이후에 초기화를 진행.
    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / ngAfterViewInit");

    this.asyncViewPack();

  } 
  private asyncViewPack(): void {
    
    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("my-info / asyncViewPack / 시작");

    // 이미 View 기본정보가 들어왔다면 바로 가져온다. 
    if(this.watchTower.getIsViewPackReady()) {
      if(isDebug) console.log("my-info / asyncViewPack / isViewPackReady : ",true);
      this.init();
    } // end if

    // View에 필요한 기본 정보가 비동기로 들어올 경우, 처리.
    this.watchTower.isViewPackReady$.subscribe(
      (isViewPackReady:boolean) => {
      if(isDebug) console.log("my-info / asyncViewPack / subscribe / isViewPackReady : ",isViewPackReady);
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

    let isDebug:boolean = true;
    // let isDebug:boolean = false;
    if(isDebug) console.log("profile-img-upload / setMyChecker / 시작");

    if(null == this.myChecker) {
      this.myChecker = this.myCheckerService.getMyChecker("user_thumbnail");
    }
  }

  private init() :void {
    // 뷰에 필요한 공통 정보를 설정합니다.
    this.setViewPack();
    
    this.setMyChecker();
  }  

  isOK(input:string) :boolean {

    if(null == this.myCheckerService) {
      return false;
    }

    return this.myCheckerService.isOK(this.myChecker, input);
  }
  public setProfileImg(thumbnail:string) :void {
    if(this.isOK(thumbnail)) {
      this.userProfileUrl = thumbnail;
    }
  }

  // @ Desc : 프로필 이미지가 제대로 입력되었는지 확인합니다.
  public hasNotDone() :boolean {
    return !this.hasDone();
  }
  public hasDone() :boolean {

    let isOK:boolean = this.isOK(this.userProfileUrl);

    if(!isOK) {
      let history = this.myCheckerService.getLastHistory();
      console.log("profile-img / hasDone / history : ",history);
    }

    return isOK;
  } 
  // @ Desc : 프로필 이미지를 확인해 달라는 표시를 보여줍니다.
  public showWarning() :void {
    // Do something...
  } 
  public getProfileImgUrl() :string {
    return this.userProfileUrl;
  } 


  onClickSampleThumb(event, idx) :void {

    event.stopPropagation();
    event.preventDefault();

    let profileUrlNext:string = "";
    if(null != idx && -1 < idx && idx < this.userProfileSampleArr.length) {
      profileUrlNext = this.userProfileSampleArr[idx];
    } // end if
    if(null != profileUrlNext && "" != profileUrlNext) {
      this.userProfileUrl = profileUrlNext;
    } // end if

  }

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

  onFocusFileUpload(event) :void {
    event.stopPropagation();
    event.preventDefault();
  }

  onClickFileUpload(event) :void {
    event.stopPropagation();
    event.preventDefault();

    // from http://stackoverflow.com/a/32010791/217408
    let eventClick = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [eventClick]);    
  }
  onChangeFile(event) :void {

    // let isDebug:boolean = true;
    let isDebug:boolean = false;
    if(isDebug) console.log("profile-img / onChangeFile / init");
    
    var files = event.srcElement.files;
    if(null == files || 1 != files.length) {
      // 1개의 파일만 업로드할 수 있습니다.
      return;
    }
    console.log(files);

    let req_url = this.urlService.get(this.uploadUserProfileUrl);

    this.uploadService.makeFileRequest(req_url, [], files).subscribe((response:any) => {
      // 섬네일 주소를 받아와서 화면에 표시해야 한다.
      if(isDebug) console.log("profile-img / onChangeFile / response : ",response);

      if( null != response && 
          null != response.data && 
          null != response.data.thumbnail) {

        // this.userProfileUrl = this.userProfilePath + response.data.thumbnail;
        this.userProfileUrl = response.data.thumbnail;

        if(isDebug) console.log("profile-img / onChangeFile / this.userProfileUrl : ",this.userProfileUrl);

        let isOK:boolean = this.isOK(this.userProfileUrl);

        if(isDebug) console.log("profile-img / onChangeFile / isOK : ",isOK);
        if(isDebug) console.log("profile-img / onChangeFile / this.myChecker : ",this.myChecker);

        if(isOK) {
          // 부모 객체에게 Change Event 발송 
          let myEventOnChange:MyEvent =
          this.myEventService.getMyEvent(
            // public eventName:string
            this.myEventService.ON_CHANGE,
            // public key:string
            this.myEventService.KEY_USER_THUMBNAIL,
            // public value:string
            this.userProfileUrl,
            // public metaObj:any
            null,
            // public myChecker:MyChecker
            this.myChecker
          );
          this.emitter.emit(myEventOnChange);
        }

      }
    });

  }  

}
