"use strict";
var browser_1 = require("angular2/platform/browser");
var core_1 = require('angular2/core');
var app_1 = require("./components/app/app");
var router_1 = require('angular2/router');
// App Module
browser_1.bootstrap(app_1.App, [
    router_1.ROUTER_PROVIDERS,
    router_1.ROUTER_DIRECTIVES,
    core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
]);
//# sourceMappingURL=boot.js.map