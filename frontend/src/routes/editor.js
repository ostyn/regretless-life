import {inject, observable} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {Router} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
import {UserService} from 'services/userService';
@inject(BlogDao, Router, UserService)
export class Editor {
    editing = false;
    activelyContactingServer = false;
    message = "There are unsaved changes. Sure you want to leave?";
    @observable markdown;
    userComparer = (userA, userBname) => 
    {
        if(userBname)
            return userA === userBname;
        else
            return userA === this.userService.usersName;
    }
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
    markdownChanged(newValue, oldValue){
        let timeoutId;
        this.post.content = this.markdown;
        if(oldValue !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {   
                window.localStorage.setItem(this.unsavedContentKey, this.markdown);
            }, 1000);
        }
    }
    constructor(blogDao, router, userService) {
        this.blogDao = blogDao;
        this.router = router;
        this.userService = userService;
    }
    canDeactivate(params, routeConfig, navigationInstruction){
        if(window.localStorage.getItem(this.unsavedContentKey))
            return confirm(this.message);
    }
    activate(params, routeConfig, navigationInstruction) {
        this.unsavedContentKey = "unsavedMarkdown" + params["id"];

        let unsavedContent = window.localStorage.getItem(this.unsavedContentKey);
        if(unsavedContent){
            if(!confirm('There are unsaved changes. Use them? Cancel to discard changes')) {
                unsavedContent = undefined;
                window.localStorage.removeItem(this.unsavedContentKey);
            }
        }

        window.onbeforeunload = (e) => {
            if(!window.localStorage.getItem(this.unsavedContentKey))
                return;
            e = e || window.event;
            // For IE and Firefox
            if (e) {
                e.returnValue = this.message;
            }

            // For Safari
            return this.message;
        };

        if(params.id) {
            this.editing = true;
            if(params.isDraft === 'true')
                return this.blogDao.getDraftPost(params.id).then((post) => {
                    this.post = post;
                    if(unsavedContent)
                        this.post.content = unsavedContent;
                    if(!this.post.locationInfo)
                        this.post.locationInfo = {};
                    if(!this.post.images)
                        this.post.images = [];
                });
            else
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    if(unsavedContent)
                        this.post.content = unsavedContent;
                    if(!this.post.locationInfo)
                        this.post.locationInfo = {};
                    if(!this.post.images)
                        this.post.images = [];
                });
        }
        else {
            this.post = {
                'content': unsavedContent,
                'isDraft': true,
                'images':[]
        };
        }
    }
    save(){
        if(!confirm('Save post?'))
            return;
        window.localStorage.removeItem(this.unsavedContentKey);
        this.blogDao.savePost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id' : id, 'isDraft': (this.post.isDraft)?this.post.isDraft:undefined});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelyContactingServer = true;
    }
    publish(){
        if(!confirm('Publish post?'))
            return;
        window.localStorage.removeItem(this.unsavedContentKey);
        this.blogDao.publishPost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id' : id});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills');
        });
        this.activelyContactingServer = true;
    }
    unpublish(){
        if(!confirm('Unpublish post?'))
            return;
        window.localStorage.removeItem(this.unsavedContentKey);
        this.blogDao.unpublishPost(this.post).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id':id, 'isDraft':true});
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills');
        });
        this.activelyContactingServer = true;
    }
    delete(){
        if(!confirm('Delete post?'))
            return;
        window.localStorage.removeItem(this.unsavedContentKey);
        this.blogDao.deletePost(this.post._id).then(id => {
            this.activelyContactingServer = false;
            this.router.navigateToRoute('');
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelyContactingServer = true;
    }
}