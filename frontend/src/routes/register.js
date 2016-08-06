import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(AuthService)
export class Register{
    email='';
    password='';
    name = '';

    constructor(auth){
        this.auth = auth;
    };

    register(){
        return this.auth.signup(this.name, this.email, this.password)
        .then(response=>{
            console.log("success logged " + response);
        })
        .catch(err=>{
            console.log("registration failure");
        });
    };
}