"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Keep the Input import for now, we'll remove it later:
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var user_service_1 = require('./user.service');
var user_1 = require('./../user');
var UserDetailComponent = (function () {
    function UserDetailComponent(route, router, location, userService) {
        this.route = route;
        this.router = router;
        this.location = location;
        this.userService = userService;
    }
    Object.defineProperty(UserDetailComponent.prototype, "routeAnimation", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDetailComponent.prototype, "display", {
        get: function () {
            return 'block';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDetailComponent.prototype, "position", {
        get: function () {
            return 'absolute';
        },
        enumerable: true,
        configurable: true
    });
    UserDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var id = +params['id']; // (+) converts string 'id' to a number
            _this.userService.getUser(id).then(function (user) { return _this.user = user; });
        });
        // snapshot
        // (+) converts string 'id' to a number
        // let id = +this.route.snapshot.params['id'];
        // this.userService.getUser(id).then(user => this.user = user);	
    };
    UserDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    UserDetailComponent.prototype.gotoUsers = function () {
        // this.router.navigate(['/users']); 
        var userId = this.user ? this.user.id : null;
        // Pass along the hero id if available
        // so that the HeroList component can select that hero.
        this.router.navigate(['/users', { id: userId, foo: 'foo' }]);
    };
    UserDetailComponent.prototype.save = function () {
        var _this = this;
        this.userService.update(this.user)
            .then(function () { return _this.goBack(); });
    };
    __decorate([
        core_1.HostBinding('@routeAnimation'), 
        __metadata('design:type', Object)
    ], UserDetailComponent.prototype, "routeAnimation", null);
    __decorate([
        core_1.HostBinding('style.display'), 
        __metadata('design:type', Object)
    ], UserDetailComponent.prototype, "display", null);
    __decorate([
        core_1.HostBinding('style.position'), 
        __metadata('design:type', Object)
    ], UserDetailComponent.prototype, "position", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', user_1.User)
    ], UserDetailComponent.prototype, "user", void 0);
    UserDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-user-detail',
            templateUrl: 'user-detail.component.html',
            styleUrls: ['user-detail.component.css'],
            animations: [
                core_1.trigger('routeAnimation', [
                    core_1.state('*', core_1.style({
                        opacity: 1,
                        transform: 'translateX(0)'
                    })),
                    core_1.transition('void => *', [
                        core_1.style({
                            opacity: 0,
                            transform: 'translateX(-100%)'
                        }),
                        core_1.animate('0.2s ease-in')
                    ]),
                    core_1.transition('* => void', [
                        core_1.animate('0.5s ease-out', core_1.style({
                            opacity: 0,
                            transform: 'translateY(100%)'
                        }))
                    ])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, common_1.Location, (typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object])
    ], UserDetailComponent);
    return UserDetailComponent;
    var _a;
}());
exports.UserDetailComponent = UserDetailComponent;
//# sourceMappingURL=class-detail.component.js.map