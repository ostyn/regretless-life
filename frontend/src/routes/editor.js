import {inject} from 'aurelia-framework';
import {BlogDao} from '../dao/BlogDao.js';
import {Router} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
@inject(BlogDao, Router)
export class Editor {
    editing = false;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    constructor(blogDao, router) {
        this.blogDao = blogDao;
        this.router = router;
    }
    activate(params, routeConfig, navigationInstruction) {
        if(params.id) {
            this.editing = true;
            return this.blogDao.getPost(params.id).then((post) => {
                this.post = post;
            });
        }
        else {
            this.post = {};
        }
    }
    submit(){
        let promising;
        if(this.editing){
            promising = this.blogDao.updatePost(this.post._id, this.post.title, this.post.author, this.post.location, this.post.content, this.post.heroPhotoUrl)
        }
        else {
           promising = this.blogDao.submitPost(this.post.title, this.post.author, this.post.location, this.post.content, this.post.heroPhotoUrl)
        }
        promising.then(id => {
            this.router.navigateToRoute('post', {'id' : id});
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
}