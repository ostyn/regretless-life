import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
export class Post {
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
    activate(params, routeConfig, navigationInstruction) {
        if(params.id)
            return this.skyApi.getPost(params.id);
        routeConfig.navModel.title = "Post number " + params.id;
    }
}