import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/BlogDao.js';
@inject(SkyScannerApi)
export class Post {
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
    activate(params, routeConfig, navigationInstruction) {
        if(params.id)
            return this.skyApi.getPost(params.id);
    }
    secondsToDate(seconds) {
        return new Date(seconds).toLocaleDateString();
    }
    secondsToTime(seconds) {
        return new Date(seconds).toLocaleTimeString();
    }
}