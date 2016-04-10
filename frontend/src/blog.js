import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
export class Blog {
    activate() {
        return this.skyApi.getAllPosts();
    }
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
}
