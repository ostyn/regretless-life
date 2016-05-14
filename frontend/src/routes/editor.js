import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/BlogDao.js';
import {Router} from 'aurelia-router';
@inject(SkyScannerApi, Router)
export class Editor {
    title = "";
    author = "";
    location = "";
    content = "";
    constructor(skyApi, router) {
        this.skyApi = skyApi;
        this.router = router;
    }
    submit(){
        this.skyApi.submitPost(this.title, this.author, this.location, this.content, new Date().getTime())
        .then(id => {
            this.router.navigateToRoute('post', {'id' : id});
        })
        .catch(response => {
            if(response.status == 409)
                alert('A post with that name already exists. Please be more original!');
            else
                alert('Something went very, very wrong. Head for the hills')
        });
    }
}