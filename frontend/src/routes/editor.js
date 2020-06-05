import {inject, observable} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {Router, Redirect} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
import {UserService} from 'services/userService';
@inject(BlogDao, Router, UserService)
export class Editor {
    editing = false;
    activelyContactingServer = false;
    message = "There are unsaved changes. Sure you want to leave?";
    availableTags = new Set();
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
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    if(unsavedContent)
                        this.post.content = unsavedContent;
                    if(!this.post.locationInfo)
                        this.post.locationInfo = {};
                    if(!this.post.images)
                        this.post.images = [];
                    if(!this.post.tags)
                        this.post.tags = new Set();
                    else
                        this.post.tags = new Set(this.post.tags);
                    routeConfig.navModel.title = "Editing: " + post.title;
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
                    if(!this.post.tags)
                        this.post.tags = new Set();
                    else
                        this.post.tags = new Set(this.post.tags);
                    routeConfig.navModel.title = "Editing: " + post.title;
                });
        }
        else {
            this.post = {
                'content': unsavedContent,
                'isDraft': true,
                'images':[],
                'tags':new Set()
        };
        }
        routeConfig.navModel.title = "Editing: New Post";
    }
    save(){
        if(!confirm('Save post?'))
            return;
        this.blogDao.savePost(this.post).then(id => {
            window.localStorage.removeItem(this.unsavedContentKey);
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
        this.blogDao.publishPost(this.post).then(id => {
            window.localStorage.removeItem(this.unsavedContentKey);
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
        this.blogDao.unpublishPost(this.post).then(id => {
            window.localStorage.removeItem(this.unsavedContentKey);
            this.activelyContactingServer = false;
            this.router.navigateToRoute('post', {'id':id});
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
        this.blogDao.deletePost(this.post._id).then(() => {
            window.localStorage.removeItem(this.unsavedContentKey);
            this.activelyContactingServer = false;
            if(this.post.isDraft)
                this.router.navigateToRoute('drafts');
            else
                new Redirect('');
        })
        .catch(response => {
            this.activelyContactingServer = false;
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelyContactingServer = true;
    }
}