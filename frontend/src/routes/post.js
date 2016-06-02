import {inject} from 'aurelia-framework';
import {BlogDao} from '/dist/dao/BlogDao.js';
@inject(BlogDao)
export class Post {
    comment = {};
    post = undefined;
    nextPost = undefined;
    prevPost = undefined;
    constructor(blogDao) {
        this.blogDao = blogDao;
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