import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {Router} from 'aurelia-router';
import {BlogDao} from '../dao/BlogDao.js';
@inject(AuthService, Router, BlogDao)
export class InfoSection{
    subbed =false;
    constructor(auth, router, blogDao){
        this.auth = auth;
        this.router = router;
        this.blogDao = blogDao;
    }
    logout(){
        this.auth.logout();
    }
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
    me(){
        if(this.isAuthenticated)
            return this.auth.getMe();
    }
    newPost(){
        this.router.navigateToRoute('editor');
    }
    subscribe(){
        this.blogDao.subscribe(this.email)
            .then(()=>{
                this.email = "";
                this.subbed = true;
            });
    }
}