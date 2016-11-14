"use strict";
var User = (function () {
    function User(id, nickname, first_name, last_name, gender, birthday, thumbnail, status, permission, kakao_id, naver_id, fb_id, google_id, mobile, email, password, date_created, date_updated) {
        this.id = id;
        this.nickname = nickname;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.birthday = birthday;
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.kakao_id = kakao_id;
        this.naver_id = naver_id;
        this.fb_id = fb_id;
        this.google_id = google_id;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
        this.date_created = date_created;
        this.date_updated = date_updated;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map