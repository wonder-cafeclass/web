import {  Component, 
          Input, 
          Output,
          OnInit }              from '@angular/core';
import { Router }               from '@angular/router';
import { LoginService }         from '../service/login.service';
import { MyLoggerService }      from '../../util/service/my-logger.service';
import { UploadService }        from '../../util/service/upload.service';
import { UrlService }           from "../../util/url.service";

@Component({
  moduleId: module.id,
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: [ 'signup.component.css' ]
})
export class SignupComponent implements OnInit {

  private uploadUserProfileUrl:string = '/CI/index.php/api/upload/userprofile';
  public userProfilePath:string = "/assets/images/user/";
  public userProfileUrl:string = "/assets/images/user/user_anonymous_150x150.png";

  // TODO - 서버에서 anonymous 이미지 받아와야 함.

  constructor(  private loginService: LoginService, 
                private myLoggerService: MyLoggerService, 
                private uploadService: UploadService, 
                private urlService:UrlService,
                public router: Router) {

  }

  ngOnInit(): void {

    // 페이지 진입을 기록으로 남깁니다.
    this.myLoggerService.logActionPage(this.myLoggerService.pageKeySignup);    

    // Do something...

  }

  onChangeFile(event) :void {

    console.log('onChange');
    var files = event.srcElement.files;
    if(null == files || 1 != files.length) {
      // 1개의 파일만 업로드할 수 있습니다.
      return;
    }
    console.log(files);

    let req_url = this.urlService.get(this.uploadUserProfileUrl);

    this.uploadService.makeFileRequest(req_url, [], files).subscribe((response:string) => {
      // 섬네일 주소를 받아와서 화면에 표시해야 한다.
      console.log('sent / response : ',response);
      if( null != response && 
          null != response.data && 
          null != response.data.thumbnail) {

          this.userProfileUrl = this.userProfilePath + response.data.thumbnail;
      }
    });

  }
}
