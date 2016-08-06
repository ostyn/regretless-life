import {inject} from 'aurelia-framework';
import {BlogDao} from '../dao/BlogDao.js';
import {AuthService} from 'aurelia-auth';
@inject(BlogDao, AuthService)
export class Post {
    comment = {};
    post = undefined;
    nextPost = undefined;
    prevPost = undefined;
    constructor(blogDao, auth) {
        this.blogDao = blogDao;
        this.auth = auth;
    }
    activate(params, routeConfig, navigationInstruction) {
        if(params.id) {
            return this.blogDao.getPost(params.id).then((post) => {
                this.post = post;
                this.blogDao.getSurroundingPosts(this.post.date).then((surroundingPosts) => {
                    this.nextPost = surroundingPosts.next;
                    this.prevPost = surroundingPosts.prev;
                })
            });
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
        this.blogDao.submitComment(this.post._id, this.comment.name, this.comment.content, this.comment.email)
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
}