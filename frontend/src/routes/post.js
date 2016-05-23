import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/BlogDao.js';
@inject(SkyScannerApi)
export class Post {
    comment = {};
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
    submitComment() {
        this.skyApi.submitComment(this.skyApi.post._id, this.comment.name, this.comment.content, this.comment.email)
        .then(id => {
            this.skyApi.getPost(id);
            this.comment = {};
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
}