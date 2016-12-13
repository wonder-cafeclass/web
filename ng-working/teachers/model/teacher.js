"use strict";
var Teacher = (function () {
    function Teacher(id, user_id, nickname, name, gender, resume, greeting, birthday, thumbnail, status, permission, mobile, email, date_created, date_updated) {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.name = name;
        this.gender = gender;
        this.resume = resume;
        this.greeting = greeting;
        this.birthday = birthday;
        this.thumbnail = thumbnail;
        this.status = status;
        this.permission = permission;
        this.mobile = mobile;
        this.email = email;
        this.date_created = date_created;
        this.date_updated = date_updated;
    }
    Teacher.prototype.isNotSameName = function (name) {
        return !this.isSameName(name);
    };
    Teacher.prototype.isSameName = function (name) {
        if (null != name && name === this.name) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameNickname = function (nickname) {
        return !this.isSameNickname(nickname);
    };
    Teacher.prototype.isSameNickname = function (nickname) {
        if (null != nickname && nickname === this.nickname) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameGender = function (gender) {
        return !this.isSameGender(gender);
    };
    Teacher.prototype.isSameGender = function (gender) {
        if (null != gender && gender === this.gender) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameResume = function (resume) {
        return !this.isSameResume(resume);
    };
    Teacher.prototype.isSameResume = function (resume) {
        if (null != resume && resume === this.resume) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameGreeting = function (greeting) {
        return !this.isSameGreeting(greeting);
    };
    Teacher.prototype.isSameGreeting = function (greeting) {
        if (null != greeting && greeting === this.greeting) {
            return true;
        }
        return false;
    };
    Teacher.prototype.isNotSameThumbnail = function (thumbnail) {
        return !this.isSameThumbnail(thumbnail);
    };
    Teacher.prototype.isSameThumbnail = function (thumbnail) {
        if (null != thumbnail && thumbnail === this.thumbnail) {
            return true;
        }
        return false;
    };
    Teacher.prototype.getMobileArr = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.model / getMobileArr / init");
        var mobileArr = this.mobile.split("-");
        var mobileHead = "";
        var mobileBody = "";
        var mobileTail = "";
        if (isDebug)
            console.log("teacher.model / getMobileArr / mobileArr : ", mobileArr);
        if (null != mobileArr && 3 == mobileArr.length) {
            mobileHead = mobileArr[0];
            mobileBody = mobileArr[1];
            mobileTail = mobileArr[2];
        }
        return [mobileHead, mobileBody, mobileTail];
    };
    Teacher.prototype.getMobileHead = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[0];
    };
    Teacher.prototype.isNotSameMobileHead = function (target) {
        return !this.isSameMobileHead(target);
    };
    Teacher.prototype.isSameMobileHead = function (target) {
        var mobileHead = this.getMobileHead();
        if (null == mobileHead || "" === mobileHead) {
            return false;
        }
        return (mobileHead === target) ? true : false;
    };
    Teacher.prototype.getMobileBody = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[1];
    };
    Teacher.prototype.isNotSameMobileBody = function (target) {
        return !this.isSameMobileBody(target);
    };
    Teacher.prototype.isSameMobileBody = function (target) {
        var mobileBody = this.getMobileBody();
        if (null == mobileBody || "" === mobileBody) {
            return false;
        }
        return (mobileBody === target) ? true : false;
    };
    Teacher.prototype.getMobileTail = function () {
        var mobileArr = this.getMobileArr();
        return mobileArr[2];
    };
    Teacher.prototype.isNotSameMobileTail = function (target) {
        return !this.isSameMobileTail(target);
    };
    Teacher.prototype.isSameMobileTail = function (target) {
        var mobileTail = this.getMobileTail();
        if (null == mobileTail || "" === mobileTail) {
            return false;
        }
        return (mobileTail === target) ? true : false;
    };
    Teacher.prototype.getBirthdayArr = function () {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.model / getBirthdayArr / init");
        var birthdayArr = this.birthday.split("-");
        var birthYear = "";
        var birthMonth = "";
        var birthDay = "";
        if (isDebug)
            console.log("teacher.model / getBirthdayArr / birthdayArr : ", birthdayArr);
        if (null != birthdayArr && 3 == birthdayArr.length) {
            birthYear = birthdayArr[0];
            birthMonth = birthdayArr[1];
            birthDay = birthdayArr[2];
        }
        return [birthYear, birthMonth, birthDay];
    };
    Teacher.prototype.getBirthYear = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[0];
    };
    Teacher.prototype.isNotSameBirthYear = function (target) {
        return !this.isSameBirthYear(target);
    };
    Teacher.prototype.isSameBirthYear = function (target) {
        var birthdayHead = this.getBirthYear();
        if (null == birthdayHead || "" === birthdayHead) {
            return false;
        }
        return (birthdayHead === target) ? true : false;
    };
    Teacher.prototype.getBirthMonth = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[1];
    };
    Teacher.prototype.isNotSameBirthMonth = function (target) {
        return !this.isSameBirthMonth(target);
    };
    Teacher.prototype.isSameBirthMonth = function (target) {
        var birthdayBody = this.getBirthMonth();
        if (null == birthdayBody || "" === birthdayBody) {
            return false;
        }
        return (birthdayBody === target) ? true : false;
    };
    Teacher.prototype.getBirthDay = function () {
        var birthdayArr = this.getBirthdayArr();
        return birthdayArr[2];
    };
    Teacher.prototype.isNotSameBirthDay = function (target) {
        return !this.isSameBirthDay(target);
    };
    Teacher.prototype.isSameBirthDay = function (target) {
        var birthdayTail = this.getBirthDay();
        if (null == birthdayTail || "" === birthdayTail) {
            return false;
        }
        return (birthdayTail === target) ? true : false;
    };
    Teacher.prototype.updateWithJSON = function (userJSON) {
        // let isDebug:boolean = true;
        var isDebug = false;
        if (isDebug)
            console.log("teacher.model / updateWithJson / init");
        if (null == userJSON) {
            if (isDebug)
                console.log("teacher.model / updateWithJson / 중단 / userJSON is not valid!");
            return;
        }
        this.id = +userJSON["id"];
        this.nickname = userJSON["nickname"];
        this.name = userJSON["name"];
        this.gender = userJSON["gender"];
        this.birthday = userJSON["birthday"];
        this.thumbnail = userJSON["thumbnail"];
        this.status = userJSON["status"];
        this.permission = userJSON["permission"];
        this.mobile = userJSON["mobile"];
        this.email = userJSON["email"];
        this.date_created = userJSON["date_created"];
        this.date_updated = userJSON["date_updated"];
    };
    Teacher.prototype.copy = function () {
        return new Teacher(
        // public id:number,
        this.id, 
        // public user_id:number,
        this.user_id, 
        // public nickname:string,
        this.nickname, 
        // public name:string,
        this.name, 
        // public gender:string,
        this.gender, 
        // public resume:string,
        this.resume, 
        // public greeting:string,
        this.greeting, 
        // public birthday:string, 
        this.birthday, 
        // public thumbnail:string,
        this.thumbnail, 
        // public status:string,
        this.status, 
        // public permission:string,
        this.permission, 
        // public mobile:string,
        this.mobile, 
        // public email:string,
        this.email, 
        // public date_created:string,
        this.date_created, 
        // public date_updated:string			
        this.date_updated);
    };
    return Teacher;
}());
exports.Teacher = Teacher;
//# sourceMappingURL=teacher.js.map