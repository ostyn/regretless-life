import {inject} from 'aurelia-framework';
import {UserService} from 'services/userService';
@inject(UserService)
export class Login{
    email='';
    password='';

    constructor(userService){
        this.userService = userService;
    };
}