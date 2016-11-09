"use strict";
/*
*	@ Desc : Button UI에 필요한 데이터 셋 모음.
*	MyChecker는 버튼을 누르면서 변경되는 값에 대한 유효성 검사.
*	MyEvent는 이벤트 전달을 받을 객체가 판단할 수 있는 메타 데이터를 전달합니다.
*
*
*/
var MyButton = (function () {
    function MyButton(title, eventName, myChecker, myEvent) {
        this.title = title;
        this.eventName = eventName;
        this.myChecker = myChecker;
        this.myEvent = myEvent;
    }
    return MyButton;
}());
exports.MyButton = MyButton;
//# sourceMappingURL=my-button.js.map