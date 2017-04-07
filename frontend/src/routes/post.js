import {inject} from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {UserService} from 'services/userService';
import {FormatLib} from 'util/FormatLib';
@inject(BlogDao, FormatLib, UserService)
export class Post {
    comment = {};
    mapLoaded = false;
    mapShown = false;
    post = undefined;
    nextPost = undefined;
    prevPost = undefined;
    activelySubmittingComment = false;
    constructor(blogDao, formatLib, userService) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
        this.userService = userService;
    }
    activate(params, routeConfig, navigationInstruction) {
        this.mapShown = false;
        if(params.id) {
            if(params.isDraft === 'true') {
                return this.blogDao.getDraftPost(params.id).then((post) => {
                    this.post = post;
                    routeConfig.navModel.title = post.title;
                });
            }
            else {
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    routeConfig.navModel.title = post.title;
                    this.blogDao.getSurroundingPosts(this.post.date).then((surroundingPosts) => {
                        this.nextPost = surroundingPosts.next;
                        this.prevPost = surroundingPosts.prev;
                    })
                });
            }
        }
        else {
            //let's load up the about page here
            return this.blogDao.getPost('57ab6b3acf1e8c1be5bc7b10').then((post) => {
                this.post = post;
            });
        }
    }

    submitComment() {
        let submitMethod = this.blogDao.submitComment;
        if(this.userService.isAuthenticated) {
            this.comment.name = this.userService.usersName;
            this.comment.email = "";
            submitMethod = this.blogDao.submitAdminComment;
        }
        submitMethod.call(this.blogDao, this.post._id, this.comment)
        .then(id => {
            this.blogDao.getPost(id)
                .then((post) => {
                    this.post = post;
                    this.activelySubmittingComment = false;
                });
            this.comment = {};
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
        this.activelySubmittingComment = true;
    }
    deleteComment(comment) {
        if(!confirm('Delete comment?'))
            return;
        this.blogDao.deleteComment(this.post._id, comment)
        .then(id => {
            this.blogDao.getPost(id)
                .then((post) => {
                    this.post = post;
                });
        })
        .catch(response => {
            alert('Something went very, very wrong. Head for the hills')
        });
    }
}