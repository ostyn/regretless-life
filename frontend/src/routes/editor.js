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
            if(params.isDraft === 'true')
                return this.blogDao.getDraftPost(params.id).then((post) => {
                    this.post = post;
                });
            else
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
            promising = this.blogDao.updatePost(this.post)
        }
        else {
           promising = this.blogDao.submitPost(this.post)
        }
        promising.then(id => {
            this.router.navigateToRoute('post', {'id' : id, 'isDraft': (this.post.isDraft)?this.post.isDraft:undefined});
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
    delete(){
        this.blogDao.deletePost(this.post._id).then(id => {
            this.router.navigateToRoute('');
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
}