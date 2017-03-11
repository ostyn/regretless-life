import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {BlogDao} from 'dao/BlogDao';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
import {UserService} from 'services/userService';
@inject(Router, BlogDao, EventAggregator, UserService)
export class InfoSection{
    subbed = false;
    activelySubscribing = false;
    constructor(router, blogDao, eventAggregator, userService){
        this.router = router;
        this.blogDao = blogDao;
        this.eventAggregator = eventAggregator;
        this.userService = userService;
        this.eventAggregator.subscribe(PageChanged, msg => {
            this.message = undefined;
            this.email = undefined;
        });
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