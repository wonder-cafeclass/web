"use strict";
var User = (function () {
    function User(id, nickname, name, gender, birthday, thumbnail, status, permission, kakao_id, naver_id, facebook_id, google_id, mobile, email, password, date_created, date_updated) {
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.kakao_id = kakao_id;
        this.naver_id = naver_id;
        this.facebook_id = facebook_id;
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