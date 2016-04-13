import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
import {activationStrategy} from 'aurelia-router';
@inject(SkyScannerApi)
export class Blog {
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
}
