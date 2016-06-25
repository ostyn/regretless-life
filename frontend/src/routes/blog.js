import {inject} from 'aurelia-framework';
import {BlogDao} from '../dao/BlogDao.js';
import {activationStrategy} from 'aurelia-router';
@inject(BlogDao)
export class Blog {
    previewLength = 200;
    start = 0;
    num = 5;
	posts = {};
	remainingPosts = 0;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    activate(params) {
        if(params.start)
            this.start = parseInt(params.start);
        if(params.query) {
            this.query = params.query;
            return this.blogDao.findNPosts(params.query, this.start, this.num)
                .then((postsData) => {
                    if(postsData) {
                        this.posts = postsData.posts;
                        this.remainingPosts = postsData.remainingPosts;
                    }
                });
        }
        return this.blogDao.getNPosts(this.start, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData.posts;
                    this.remainingPosts = postsData.remainingPosts;
                }
            });
    }
    constructor(blogDao) {
        this.blogDao = blogDao;
    }
    secondsToDate(seconds) {
        return new Date(seconds).toLocaleDateString();
    }
    secondsToTime(seconds) {
        return new Date(seconds).toLocaleTimeString();
    }
}
