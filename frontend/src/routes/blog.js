import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/SkyScannerApi.js';
import {activationStrategy} from 'aurelia-router';
@inject(SkyScannerApi)
export class Blog {
    previewLength = 200;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    activate(params) {
        if(params.query)
            return this.skyApi.findAllPosts(params.query);
        return this.skyApi.getAllPosts();
    }
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
    secondsToDate(seconds) {
        return new Date(seconds).toLocaleDateString();
    }
    secondsToTime(seconds) {
        return new Date(seconds).toLocaleTimeString();
    }
}
