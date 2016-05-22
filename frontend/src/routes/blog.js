import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/BlogDao.js';
import {activationStrategy} from 'aurelia-router';
@inject(SkyScannerApi)
export class Blog {
    previewLength = 200;
    start = 0;
    num = 5;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    activate(params) {
        if(params.start)
            this.start = params.start
        if(params.query) {
            this.query = params.query;
            return this.skyApi.findNPosts(params.query, this.start, this.num);
        }
        return this.skyApi.getNPosts(this.start, this.num);
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
