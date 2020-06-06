import {inject, useView} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
import {activationStrategy, Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
@useView(PLATFORM.moduleName('routes/post-list.html'))
@inject(BlogDao, FormatLib, Router)
export class PostListBase{
    moreText = "show more";
    previewLength = 200;
    showCommentsLink = true;
    showAuthorDate = true;
    widgetCssRule = "regularFeedPostWidget";
    expandPostTitle = false;
    requestedLastPage = false;
    num = 5;
    posts = [];
    routeName;
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    getData(params){
        return this.blogDao.getNPosts(false, this.num, this.start)
            .then((postsData) => {
                if(postsData) {
                    this.posts = postsData;
                }
            });
    }
    activate(params, routeConfig, navigationInstruction) {
        this.routeName = routeConfig.name;
        return this.getData(params);

    }
    constructor(blogDao, formatLib, router) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
        this.router = router;
    }
    loadMore() {
        return this.blogDao.getNPosts(false, this.num, this.posts[this.posts.length-1].date);
    }
    showMore(){
        this.loadMore()
            .then((postsData) => {
                if(postsData) {
                    if(postsData.length > 0)
                        this.posts = this.posts.concat(postsData);
                    else
                        this.requestedLastPage = true;
                }
            });
    }
}