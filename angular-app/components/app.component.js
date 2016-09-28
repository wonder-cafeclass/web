System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AppComponent;
    return {
        setters:[],
        execute: function() {
            {
                template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>';
            }
            AppComponent = (function () {
                function AppComponent() {
                    this.title = 'Tour of Heroes';
                    this.hero = 'Windstorm';
                }
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map