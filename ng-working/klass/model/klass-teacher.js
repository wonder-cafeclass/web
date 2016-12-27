"use strict";
var KlassTeacher = (function () {
    function KlassTeacher() {
        this.delimiter = "|||";
    }
    KlassTeacher.prototype.getResumeArr = function () {
        if (null == this.resume || "" === this.resume) {
            return [];
        }
        return this.resume.split(this.delimiter);
    };
    KlassTeacher.prototype.getGreetingArr = function () {
        if (null == this.greeting || "" === this.greeting) {
            return [];
        }
        return this.greeting.split(this.delimiter);
    };
    KlassTeacher.prototype.setJSON = function (json) {
        if (null == json) {
            return this;
        }
        if (null != json["birthday"]) {
            this.birthday = json["birthday"];
        }
        if (null != json["date_created"]) {
            this.date_created = json["date_created"];
        }
        if (null != json["date_updated"]) {
            this.date_updated = json["date_updated"];
        }
        if (null != json["email"]) {
            this.email = json["email"];
        }
        if (null != json["gender"]) {
            this.gender = json["gender"];
        }
        if (null != json["greeting"]) {
            this.greeting = json["greeting"];
        }
        if (null != json["id"]) {
            this.id = parseInt(json["id"]);
        }
        if (null != json["memo"]) {
            this.memo = json["memo"];
        }
        if (null != json["mobile"]) {
            this.mobile = json["mobile"];
        }
        if (null != json["name"]) {
            this.name = json["name"];
        }
        if (null != json["nickname"]) {
            this.nickname = json["nickname"];
        }
        if (null != json["resume"]) {
            this.resume = json["resume"];
        }
        if (null != json["status"]) {
            this.status = json["status"];
        }
        if (null != json["thumbnail"]) {
            this.thumbnail = json["thumbnail"];
        }
        if (null != json["user_id"]) {
            this.user_id = parseInt(json["user_id"]);
        }
        return this;
    };
    return KlassTeacher;
}());
exports.KlassTeacher = KlassTeacher;
//# sourceMappingURL=klass-teacher.js.map