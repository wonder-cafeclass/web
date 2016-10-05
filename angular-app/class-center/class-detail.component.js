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
var dialog_service_1 = require('../dialog.service');
var ClassDetailComponent = (function () {
    function ClassDetailComponent(route, router, dialogService) {
        this.route = route;
        this.router = router;
        this.dialogService = dialogService;
    }
    Object.defineProperty(ClassDetailComponent.prototype, "routeAnimation", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDetailComponent.prototype, "display", {
        get: function () {
            return 'block';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDetailComponent.prototype, "position", {
        get: function () {
            return 'absolute';
        },
        enumerable: true,
        configurable: true
    });
    ClassDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.forEach(function (data) {
            _this.editName = data._class.name;
            _this._class = data._class;
        });
    };
    ClassDetailComponent.prototype.cancel = function () {
        this.gotoCrises();
    };
    ClassDetailComponent.prototype.save = function () {
        this._class.name = this.editName;
        this.gotoCrises();
    };
    ClassDetailComponent.prototype.canDeactivate = function () {
        // Allow synchronous navigation (`true`) if no _class or the _class is unchanged
        if (!this._class || this._class.name === this.editName) {
            return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        return this.dialogService.confirm('Discard changes?');
    };
    ClassDetailComponent.prototype.gotoCrises = function () {
        var classId = this._class ? this._class.id : null;
        // Pass along the _class id if available
        // so that the ClassListComponent can select that _class.
        // Add a totally useless `foo` parameter for kicks.
        // Relative navigation back to the crises
        this.router.navigate(['../', { id: classId, foo: 'foo' }], { relativeTo: this.route });
    };
    __decorate([
        core_1.HostBinding('@routeAnimation'), 
        __metadata('design:type', Object)
    ], ClassDetailComponent.prototype, "routeAnimation", null);
    __decorate([
        core_1.HostBinding('style.display'), 
        __metadata('design:type', Object)
    ], ClassDetailComponent.prototype, "display", null);
    __decorate([
        core_1.HostBinding('style.position'), 
        __metadata('design:type', Object)
    ], ClassDetailComponent.prototype, "position", null);
    ClassDetailComponent = __decorate([
        core_1.Component({
            template: "\n  <div *ngIf=\"_class\">\n    <h3>\"{{editName}}\"</h3>\n    <div>\n      <label>Id: </label>{{_class.id}}</div>\n    <div>\n      <label>Name: </label>\n      <input [(ngModel)]=\"editName\" placeholder=\"name\"/>\n    </div>\n    <p>\n      <button (click)=\"save()\">Save</button>\n      <button (click)=\"cancel()\">Cancel</button>\n    </p>\n  </div>\n  ",
            styles: ['input {width: 20em}'],
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
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, dialog_service_1.DialogService])
    ], ClassDetailComponent);
    return ClassDetailComponent;
}());
exports.ClassDetailComponent = ClassDetailComponent;
//# sourceMappingURL=class-detail.component.js.map