import {inject} from 'aurelia-framework';
import {UserService} from 'services/userService';
@inject(UserService)
export class Login{
    email='';
    password='';

    constructor(userService){
        if(location.protocol !== "https" && location.hostname !== "localhost")
            window.location.replace(window.location.href.replace("http", "https"));
        this.userService = userService;
    };
}