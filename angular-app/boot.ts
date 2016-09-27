import {bootstrap} from "angular2/platform/browser";
import {provide, enableProdMode} from 'angular2/core';
import {App} from "./components/app/app";
import {
    LocationStrategy,
    HashLocationStrategy,
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS
} from 'angular2/router';

// enableProdMode();
bootstrap(App, [
    ROUTER_PROVIDERS,
    ROUTER_DIRECTIVES,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);