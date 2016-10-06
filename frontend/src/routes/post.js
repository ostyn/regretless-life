import {inject} from 'aurelia-framework';
import {BlogDao} from '../dao/BlogDao.js';
import {AuthService} from 'aurelia-auth';
@inject(BlogDao, AuthService)
export class Post {
    comment = {};
    mapLoaded = false;
    mapShown = false;
    post = undefined;
    nextPost = undefined;
    prevPost = undefined;
    constructor(blogDao, auth) {
        this.blogDao = blogDao;
        this.auth = auth;
    }
    activate(params, routeConfig, navigationInstruction) {
        this.mapShown = false;
        if(params.id) {
            if(params.isDraft === 'true') {
                return this.blogDao.getDraftPost(params.id).then((post) => {
                    this.post = post;
                    routeConfig.navModel.title = post.title;
                });
            }
            else {
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    routeConfig.navModel.title = post.title;
                    this.blogDao.getSurroundingPosts(this.post.date).then((surroundingPosts) => {
                        this.nextPost = surroundingPosts.next;
                        this.prevPost = surroundingPosts.prev;
                    })
                });
            }
        }
        else {
            //let's load up the about page here
            return this.blogDao.getPost('57ab6b3acf1e8c1be5bc7b10').then((post) => {
                this.post = post;
            });
        }
    }
    toggleMap(){
        if(!this.mapLoaded) {
            this.mapLoaded = true;
            this.mapShown = true;
        }
        else {
            this.mapShown = !this.mapShown;
        }
    }
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
    secondsToDate(seconds) {
        return new Date(seconds).toLocaleDateString();
    }
    secondsToTime(seconds) {
        return new Date(seconds).toLocaleTimeString();
    }
    submitComment() {
        this.blogDao.submitComment(this.post._id, this.comment)
        .then(id => {
            this.blogDao.getPost(id)
                .then((post) => {
                    this.post = post;
                });
            this.comment = {};
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
    deleteComment(comment) {
        this.blogDao.deleteComment(this.post._id, comment)
        .then(id => {
            this.blogDao.getPost(id)
                .then((post) => {
                    this.post = post;
                });
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
    getLinkParams(post){
        return { 
            'id': post._id, 
            'isDraft': (post.isDraft) ? post.isDraft : undefined 
        };
    }
}