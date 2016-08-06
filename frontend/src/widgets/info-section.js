import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
@inject(AuthService)
export class InfoSection{
    constructor(auth){
        this.auth = auth;
    }
    logout(){
        this.auth.logout();
    }
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
}