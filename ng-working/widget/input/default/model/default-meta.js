"use strict";
var DefaultMeta = (function () {
    function DefaultMeta(title, placeholder, eventKey, checkerKey) {
        this.title = title;
        this.placeholder = placeholder;
        this.eventKey = eventKey;
        this.checkerKey = checkerKey;
    }
    DefaultMeta.prototype.isOK = function () {
        if (this.hasNoTitle()) {
            return false;
        }
        if (this.hasNoPlaceholder()) {
            return false;
        }
        if (this.hasNoEventKey()) {
            return false;
        }
        if (this.hasNoCheckerKey()) {
            return false;
        }
        return true;
    };
    DefaultMeta.prototype.hasNoTitle = function () {
        return !this.hasTitle();
    };
    DefaultMeta.prototype.hasTitle = function () {
        if (null == this.title || "" === this.title) {
            return false;
        }
        return true;
    };
    DefaultMeta.prototype.hasNoPlaceholder = function () {
        return !this.hasPlaceholder();
    };
    DefaultMeta.prototype.hasPlaceholder = function () {
        if (null == this.placeholder || "" === this.placeholder) {
            return false;
        }
        return true;
    };
    DefaultMeta.prototype.hasNoEventKey = function () {
        return !this.hasEventKey();
    };
    DefaultMeta.prototype.hasEventKey = function () {
        if (null == this.eventKey || "" === this.eventKey) {
            return false;
        }
        return true;
    };
    DefaultMeta.prototype.hasNoCheckerKey = function () {
        return !this.hasCheckerKey();
    };
    DefaultMeta.prototype.hasCheckerKey = function () {
        if (null == this.checkerKey || "" === this.checkerKey) {
            return false;
        }
        return true;
    };
    return DefaultMeta;
}());
exports.DefaultMeta = DefaultMeta;
//# sourceMappingURL=default-meta.js.map