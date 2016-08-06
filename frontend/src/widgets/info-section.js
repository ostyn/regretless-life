import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {Router} from 'aurelia-router';
@inject(AuthService, Router)
export class InfoSection{
    constructor(auth, router){
        this.auth = auth;
        this.router = router;
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
}