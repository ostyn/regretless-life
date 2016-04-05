import {inject} from 'aurelia-framework';
import {SkyScannerApi} from 'SkyScannerApi.js';
@inject(SkyScannerApi)
export class Editor {
    title = "";
    author = "";
    location = "";
    content = "";
    constructor(skyApi) {
        this.skyApi = skyApi;
    }
    submit(){
        this.skyApi.submitPost(this.title, this.author, this.location, this.content, new Date().getTime());
    }
}