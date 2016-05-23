import {inject} from 'aurelia-framework';
import {SkyScannerApi} from '/dist/dao/BlogDao.js';
import {Router} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
@inject(SkyScannerApi, Router)
export class Editor {
    editing = false;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    constructor(skyApi, router) {
        this.skyApi = skyApi;
        this.router = router;
    }
    activate(params, routeConfig, navigationInstruction) {
        if(params.id) {
            this.editing = true;
            return this.skyApi.getPost(params.id);
        }
        else {
            this.skyApi.post = {};
        }
    }
    submit(){
        let promising;
        if(this.editing){
            promising = this.skyApi.updatePost(this.skyApi.post._id, this.skyApi.post.title, this.skyApi.post.author, this.skyApi.post.location, this.skyApi.post.content)
        }
        else {
           promising = this.skyApi.submitPost(this.skyApi.post.title, this.skyApi.post.author, this.skyApi.post.location, this.skyApi.post.content)
        }
        promising.then(id => {
            this.router.navigateToRoute('post', {'id' : id});
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
}