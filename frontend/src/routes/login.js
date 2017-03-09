import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(AuthService)
export class Login{
    email='';
    password='';

    constructor(auth){
        if(location.protocol !== "https" && location.hostname !== "localhost")
            window.location.replace(window.location.href.replace("http", "https"));
        this.auth = auth;
    };

    login(){
        return this.auth.login(this.email, this.password)
        .then(response=>{
            console.log("success logged " + response);
        })
        .catch(err=>{
            console.log("login failure");
        });
    };
}