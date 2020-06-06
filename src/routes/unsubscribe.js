import { inject } from 'aurelia-dependency-injection';
import { BlogDao } from "../dao/BlogDao";
@inject(BlogDao)
export class Unsubscribe {
    constructor(blogDao) {
        this.blogDao = blogDao;
    }
    activate(params) {
        this.blogDao.unsubscribe(params.id)
            .then((resp) => {
                this.response = resp.msg;
            }).catch(() => {
                this.response = "Bad request. No emails were unsubscribed";
            })
    }
}