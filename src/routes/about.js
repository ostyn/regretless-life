import {inject} from "aurelia-framework";
import {BlogDao} from "dao/BlogDao";
@inject(BlogDao)
export class About {
    ABOUT_PAGE_ID = '57ab6b3acf1e8c1be5bc7b10';
    constructor(blogDao){
        this.blogDao = blogDao;
    }
    activate(params, routeConfig, navigationInstruction) {
        return this.blogDao.getPost(this.ABOUT_PAGE_ID).then((post) => {
            this.post = post;
        });
    }
}