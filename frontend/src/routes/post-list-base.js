import {inject, useView} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import {activationStrategy, Router} from 'aurelia-router';
@useView('routes/post-list.html')
@inject(BlogDao, FormatLib, Router)
export class PostListBase{
    nextText = "newer posts";
    prevText = "older posts";
    previewLength = 200;
    showCommentsLink = true;
    showAuthorDate = true;
    start = 0;
    num = 5;
    posts = [];
    remainingPosts = 0;
    routeName;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    getData(params){
        return this.blogDao.getNPosts(this.start, this.num)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData.posts;
                    this.remainingPosts = postsData.remainingPosts;
                }
            });
    }
    activate(params, routeConfig, navigationInstruction) {
        this.routeName = routeConfig.name;
        if(params.start)
            this.start = parseInt(params.start);
        return this.getData(params);

    }
    constructor(blogDao, formatLib, router) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
        this.router = router;
    }
    nextLinkParams(){
        return { 'start': (this.start-this.num<0)?0:this.start-this.num };
    }
    prevLinkParams(){
        return { 'start': this.start+this.num };
    }
    get getNextLinkParams(){
        return this.nextLinkParams();
    }
    get getPrevLinkParams(){
        return this.prevLinkParams();
    }
}