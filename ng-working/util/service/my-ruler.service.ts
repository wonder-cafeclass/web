import { Injectable }             from '@angular/core';

@Injectable()
export class MyRulerService {

    // HTML Element의 수치를 확인하는 서비스 객체
    getHeight(id) {
        let element = document.getElementById(id);

        if(null == element) {
            return -1;
        }

        let style = window.getComputedStyle(element);
        let height = element.offsetHeight;
        let margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        let border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

        let actualHeight = height + margin + border;

        return actualHeight;
    }
}
