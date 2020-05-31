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
        if(params.isDraft === 'true') {
            return this.blogDao.getDraftPost(params.id).then((post) => {
                this.post = post;
                routeConfig.navModel.title = post.title;
            });
        }
        else {
            if (this.prevPost && params.id === this.prevPost.id) {
                this.nextPost = this.post;
                this.post = this.prevPost;
                this.blogDao.getPrevPost(this.post.date).then((prevPost) => {
                    this.prevPost = prevPost;
                });
            } else if (this.nextPost && params.id === this.nextPost.id) {
                this.prevPost = this.post;
                this.post = this.nextPost;
                this.blogDao.getNextPost(this.post.date).then((nextPost) => {
                    this.nextPost = nextPost;
                });
            } else {
                return this.blogDao.getPost(params.id).then((post) => {
                    this.post = post;
                    routeConfig.navModel.title = post.title;
                    this.blogDao.getPrevPost(this.post.date).then((prevPost) => {
                        this.prevPost = prevPost;
                    })
                    this.blogDao.getNextPost(this.post.date).then((nextPost) => {
                        this.nextPost = nextPost;
                    })
                });
            }
        }
    }

    submitComment() {
        let submitMethod = this.blogDao.submitComment;
        if(this.userService.isAuthorized) {
            this.comment.name = this.userService.usersName;
            this.comment.email = "";
            submitMethod = this.blogDao.submitAdminComment;
        }
        submitMethod.call(this.blogDao, this.post._id, this.comment)
        .then(id => {
            this.blogDao.getPost(this.post._id)
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
    deleteComment(index) {
        if(!confirm('Delete comment?'))
            return;
        this.blogDao.deleteComment(this.post._id, index)
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