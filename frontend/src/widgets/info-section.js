import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {Router} from 'aurelia-router';
import {BlogDao} from 'dao/BlogDao';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
@inject(AuthService, Router, BlogDao, EventAggregator)
export class InfoSection{
    subbed = false;
    activelySubscribing = false;
    constructor(auth, router, blogDao, eventAggregator){
        this.auth = auth;
        this.router = router;
        this.blogDao = blogDao;
        this.eventAggregator = eventAggregator;
        this.eventAggregator.subscribe(PageChanged, msg => {
            this.message = undefined;
            this.email = undefined;
        });
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
            .then((response)=>{
                this.activelySubscribing = false;
                if(response.resp) {
                    this.email = "";
                    this.message = response.msg;
                }
                //Known error states
                else if(response.resp === false){
                    this.message = response.msg;
                }
                //Unknown error states
                else {
                    this.message = "Could not subscribe. Try again later."
                }
            });
        this.activelySubscribing = true;
    }
}