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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var user_service_1 = require('./user.service');
var UserListComponent = (function () {
    function UserListComponent(userService, route, router) {
        this.userService = userService;
        this.route = route;
        this.router = router;
        this.mode = 'Observable';
    }
    UserListComponent.prototype.ngOnInit = function () {
        // Legacy
        // this.getUsers(); 
        var _this = this;
        // New
        this.route.params.forEach(function (params) {
            _this.selectedId = +params['id'];
            _this.userService.getUsers()
                .then(function (users) { return _this.users = users; });
        });
    };
    UserListComponent.prototype.isSelected = function (user) { return user.id === this.selectedId; };
    // observable-based
    /*
    getUseres() {
      this.userService.getUsers()
                       .subscribe(
                         users => this.users = users,
                         error =>  this.errorMessage = <any>error);
    }
    */
    // promise-based
    UserListComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService.getUsers()
            .then(function (users) { return _this.users = users; }, function (error) { return _this.errorMessage = error; });
    };
    // observable-based
    /*
    addUser (name: string) {
      if (!name) { return; }
      this.userService.addUser(name)
                       .subscribe(
                         user  => this.users.push(user),
                         error =>  this.errorMessage = <any>error);
    }
    */
    // promise-based
    UserListComponent.prototype.addUser = function (name) {
        var _this = this;
        if (!name) {
            return;
        }
        this.userService.addUser(name)
            .then(function (user) { return _this.users.push(user); }, function (error) { return _this.errorMessage = error; });
    };
    UserListComponent.prototype.onSelect = function (user) {
        this.router.navigate(['/user', user.id]);
    };
    UserListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-user-list',
            templateUrl: 'user-list.component.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof user_service_1.UserService !== 'undefined' && user_service_1.UserService) === 'function' && _a) || Object, router_1.ActivatedRoute, router_1.Router])
    ], UserListComponent);
    return UserListComponent;
    var _a;
}());
exports.UserListComponent = UserListComponent;
//# sourceMappingURL=class-list.component.js.map