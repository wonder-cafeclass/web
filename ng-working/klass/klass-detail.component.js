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
var dialog_service_1 = require('../widget/dialog.service');
var KlassDetailComponent = (function () {
    function KlassDetailComponent(route, router, dialogService) {
        this.route = route;
        this.router = router;
        this.dialogService = dialogService;
    }
    Object.defineProperty(KlassDetailComponent.prototype, "routeAnimation", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlassDetailComponent.prototype, "display", {
        get: function () {
            return 'block';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlassDetailComponent.prototype, "position", {
        get: function () {
            return 'absolute';
        },
        enumerable: true,
        configurable: true
    });
    KlassDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.forEach(function (data) {
            _this.editTitle = data.klass.title;
            _this.klass = data.klass;
        });
    };
    KlassDetailComponent.prototype.cancel = function () {
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.save = function () {
        this.klass.title = this.editTitle;
        this.gotoKlassList();
    };
    KlassDetailComponent.prototype.canDeactivate = function () {
        // Allow synchronous navigation (`true`) if no klass or the klass is unchanged
        if (!this.klass || this.klass.title === this.editTitle) {
            return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        return this.dialogService.confirm('Discard changes?');
    };
    KlassDetailComponent.prototype.gotoKlassList = function () {
        var klassId = this.klass ? this.klass.id : null;
        // Pass along the klass id if available
        // so that the KlassListComponent can select that klass.
        // Add a totally useless `foo` parameter for kicks.
        // Relative navigation back to the crises
        this.router.navigate(['../', { id: klassId, foo: 'foo' }], { relativeTo: this.route });
    };
    __decorate([
        core_1.HostBinding('@routeAnimation'), 
        __metadata('design:type', Object)
    ], KlassDetailComponent.prototype, "routeAnimation", null);
    __decorate([
        core_1.HostBinding('style.display'), 
        __metadata('design:type', Object)
    ], KlassDetailComponent.prototype, "display", null);
    __decorate([
        core_1.HostBinding('style.position'), 
        __metadata('design:type', Object)
    ], KlassDetailComponent.prototype, "position", null);
    KlassDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['klass-detail.component.css'],
            templateUrl: 'klass-detail.component.html',
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
    ], KlassDetailComponent);
    return KlassDetailComponent;
}());
exports.KlassDetailComponent = KlassDetailComponent;
//# sourceMappingURL=klass-detail.component.js.map