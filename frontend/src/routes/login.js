import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {BlogDao} from '../dao/BlogDao.js';
@inject(AuthService, BlogDao)

export class Login{
    constructor(auth, blogDao){
        this.auth = auth;
        this.blogDao = blogDao;
    };

    heading = 'Login';

    email='';
    password='';
    name = '';
    login(){
        return this.auth.login(this.email, this.password)
        .then(response=>{
            console.log("success logged " + response);
        })
        .catch(err=>{
            console.log("login failure");
        });
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