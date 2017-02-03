import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {Router} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
@inject(BlogDao, Router)
export class Editor {
    editing = false;
    activelyContactingServer = false;
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
                    if(!this.post.locationInfo)
                        this.post.locationInfo = {};
                    if(!this.post.images)
                        this.post.images = [];
                });
            else
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    if(!this.post.locationInfo)
                        this.post.locationInfo = {};
                    if(!this.post.images)
                        this.post.images = [];
                });
        }
        else {
            this.post = {
                'isDraft': true,
                'images':[]
        };
        }
    }
    save(){
        this.blogDao.savePost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id' : id, 'isDraft': (this.post.isDraft)?this.post.isDraft:undefined});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelyContactingServer = true;
    }
    publish(){
        this.blogDao.publishPost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id' : id});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills');
        });
        this.activelyContactingServer = true;
    }
    unpublish(){
        this.blogDao.unpublishPost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id':id, 'isDraft':true});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills');
        });
        this.activelyContactingServer = true;
    }
    delete(){
        this.blogDao.deletePost(this.post._id).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('');
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelyContactingServer = true;
    }
}