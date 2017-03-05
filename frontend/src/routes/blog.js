import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import {activationStrategy, Router} from 'aurelia-router';
@inject(BlogDao, FormatLib, Router)
export class Blog {
    previewLength = 200;
    start = 0;
    num = 5;
    posts = [];
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
        if(this.isDraftPage())
            return this.blogDao.getNDraftPosts(this.start, this.num)
                .then((postsData) => {
                    if(postsData) {
                        this.posts = postsData.posts;
                        this.remainingPosts = postsData.remainingPosts;
                    }
                });
        else
            return this.blogDao.getNPosts(this.start, this.num)
                .then((postsData) => {
                    if(postsData) {
                        this.posts = postsData.posts;
                        this.remainingPosts = postsData.remainingPosts;
                    }
                });
    }
    constructor(blogDao, formatLib, router) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
        this.router = router;
    }
    isSearchPage(){
        return this.query != undefined;
    }
    isDraftPage(){
        return this.router.history.location.hash.indexOf("draft") !=-1;
    }
    getLinkParams(post){
        return { 
            'id': post._id, 
            'isDraft': (post.isDraft) ? post.isDraft : undefined 
        };
    }
}
