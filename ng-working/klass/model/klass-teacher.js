"use strict";
var KlassTeacher = (function () {
    function KlassTeacher(id, user_id, nickname, first_name, last_name, gender, birth_year, thumbnail, thumbnail_url, status, mobile, email, resume, resume_arr, greeting, greeting_arr, memo, date_created, date_updated) {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.birth_year = birth_year;
        this.thumbnail = thumbnail;
        this.thumbnail_url = thumbnail_url;
        this.status = status;
        this.mobile = mobile;
        this.email = email;
        this.resume = resume;
        this.resume_arr = resume_arr;
        this.greeting = greeting;
        this.greeting_arr = greeting_arr;
        this.memo = memo;
        this.date_created = date_created;
        this.date_updated = date_updated;
    }
    return KlassTeacher;
}());
exports.KlassTeacher = KlassTeacher;
//# sourceMappingURL=klass-teacher.js.map