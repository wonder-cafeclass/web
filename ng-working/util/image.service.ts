import { Injectable }             from '@angular/core';
import { UrlService }             from './url.service';

@Injectable()
export class ImageService {

    // 서비스 서버내의 이미지를 가져오는 유틸 클래스.
    // 개발 서버 혹은 서비스 서버등의 환경에도 일관되게 이미지를 가져오는 역할을 합니다.

    noticeHelpUrl:string="assets/images/notice/help.png";
    noticeDrinksUrl:string="assets/images/notice/drinks.png";
    cafeclassLogoUrl:string="assets/images/cafeclass_logo_text_only.svg";
    watchTowerUrl:string="assets/images/admin/watchtower.svg";

    clock1hrUrl:string="assets/images/clock/clock-1hr.svg";
    clock2hrUrl:string="assets/images/clock/clock-2hr.svg";
    clock3hrUrl:string="assets/images/clock/clock-3hr.svg";
    clockBGUrl:string="assets/images/clock/clock-bg.svg";

    constructor(private us:UrlService) {
    }

    get(imgUrl:string) {
        // url segment를 보낸 경우, 자신의 app base href를 확인, full request url을 만들어 준다.

        if(null === this.us) {
            return "";
        }

        return this.us.get(imgUrl);
    }

}
