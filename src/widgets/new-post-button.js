import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { BlogDao } from 'dao/BlogDao';
import { UserService } from 'services/userService';
@inject(Router, BlogDao, UserService)
export class NewPostButton {
    constructor(router, blogDao, userService) {
        this.router = router;
        this.blogDao = blogDao;
        this.userService = userService;
    }
    newPost() {
        this.router.navigateToRoute('editor');
    }
    openPrompt() {
        this.promptOpen = true;
    }
    closePrompt() {
        this.promptOpen = false;
        this.postTitle = "";
    }
    createPost() {
        this.blogDao.savePost({ "title": this.postTitle, "isDraft": true, author:this.userService.usersName })
            .then((id) => {
                this.closePrompt();
                this.router.navigateToRoute('editor', {'id' : id});
            });
    }
}