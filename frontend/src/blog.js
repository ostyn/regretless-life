import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
export class Blog {
    activate(params) {
        if(params.query)
            return this.skyApi.findAllPosts(params.query);
        return this.skyApi.getAllPosts();
    }
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
}
