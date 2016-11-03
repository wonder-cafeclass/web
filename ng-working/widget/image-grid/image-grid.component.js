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
var ImageGridComponent = (function () {
    function ImageGridComponent() {
        this.imageHeight = -1;
        this.imageWidth = -1;
        this.tableWidth = -1;
        this.hasTableBorder = false;
        this.gridWidth = 100;
    }
    ImageGridComponent.prototype.ngOnInit = function () {
        // 첫번째 열의 컬럼 갯수를 기준으로 전체 열의 엘리먼트 갯수가 같은지 확인합니다.
        // 컬럼 갯수가 많다면 마지막 엘리먼트를 제거. - Not implemented!
        // 컬럼 갯수가 적다면 공백 문자열을 추가합니다.
        var rowCnt = this.imageTable.length;
        var colCnt = this.imageTable[0].length;
        for (var rowIdx = 0; rowIdx < this.imageTable.length; ++rowIdx) {
            var row = this.imageTable[rowIdx];
            if (row.length === colCnt) {
                continue;
            }
            else if (row.length < colCnt) {
                // 엘리먼트가 부족할 경우의 처리.
                var colCntNeeded = colCnt - row.length;
                for (var k = 0; k < colCntNeeded; ++k) {
                    row.push(null);
                } // end inner for
            } // end if
        } // end outer for
        this.gridWidth = this.imageWidth * colCnt;
        if (0 < this.tableWidth) {
            this.tableWidthStr = this.tableWidth + "px";
        }
        else {
            this.tableWidthStr = "100%";
        }
        console.log("hasTableBorder : ", this.hasTableBorder);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ImageGridComponent.prototype, "imageTable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "imageHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "imageWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImageGridComponent.prototype, "tableWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ImageGridComponent.prototype, "hasTableBorder", void 0);
    ImageGridComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'image-grid',
            templateUrl: 'image-grid.component.html',
            styleUrls: ['image-grid.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], ImageGridComponent);
    return ImageGridComponent;
}());
exports.ImageGridComponent = ImageGridComponent;
//# sourceMappingURL=image-grid.component.js.map