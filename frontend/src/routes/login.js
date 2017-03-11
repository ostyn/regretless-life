import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {UserService} from 'services/userService';
@inject(AuthService, UserService)
export class Login{
    email='';
    password='';

    constructor(auth, userService){
        if(location.protocol !== "https" && location.hostname !== "localhost")
            window.location.replace(window.location.href.replace("http", "https"));
        this.auth = auth;
        this.userService = userService;
    };
}