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
    watchTowerWhiteUrl:string="assets/images/admin/watchtower_white.svg";

    clock1hr00m00mUrl:string="assets/images/clock/clock-1hr-00m-00m.svg";
    clock1hr00m30mUrl:string="assets/images/clock/clock-1hr-00m-30m.svg";
    clock1hr30m00mUrl:string="assets/images/clock/clock-1hr-30m-00m.svg";
    clock1hr30m30mUrl:string="assets/images/clock/clock-1hr-30m-30m.svg";
    clock1hrNoticeAMUrl:string="assets/images/clock/clock-1hr-notice-am.svg";
    clock1hrNoticePMUrl:string="assets/images/clock/clock-1hr-notice-pm.svg";
    clock1hr30mNoticeAMUrl:string="assets/images/clock/clock-1hr-30m-notice-am.svg";
    clock1hr30mNoticePMUrl:string="assets/images/clock/clock-1hr-30m-notice-pm.svg";

    clock2hr00m00mUrl:string="assets/images/clock/clock-2hr-00m-00m.svg";
    clock2hr00m30mUrl:string="assets/images/clock/clock-2hr-00m-30m.svg";
    clock2hr30m00mUrl:string="assets/images/clock/clock-2hr-30m-00m.svg";
    clock2hr30m30mUrl:string="assets/images/clock/clock-2hr-30m-30m.svg";
    clock2hrNoticeAMUrl:string="assets/images/clock/clock-2hr-notice-am.svg";
    clock2hrNoticePMUrl:string="assets/images/clock/clock-2hr-notice-pm.svg";
    clock2hr30mNoticeAMUrl:string="assets/images/clock/clock-2hr-30m-notice-am.svg";
    clock2hr30mNoticePMUrl:string="assets/images/clock/clock-2hr-30m-notice-pm.svg";

    clock3hr00m00mUrl:string="assets/images/clock/clock-3hr-00m-00m.svg";
    clock3hr00m30mUrl:string="assets/images/clock/clock-3hr-00m-30m.svg";
    clock3hr30m00mUrl:string="assets/images/clock/clock-3hr-00m-00m.svg";
    clock3hr30m30mUrl:string="assets/images/clock/clock-3hr-00m-30m.svg";
    clock3hrNoticeAMUrl:string="assets/images/clock/clock-3hr-notice-am.svg";
    clock3hrNoticePMUrl:string="assets/images/clock/clock-3hr-notice-pm.svg";
    clock3hr30mNoticeAMUrl:string="assets/images/clock/clock-3hr-30m-notice-am.svg";
    clock3hr30mNoticePMUrl:string="assets/images/clock/clock-3hr-30m-notice-pm.svg";

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
