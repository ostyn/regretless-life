import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {AuthService} from 'aurelia-auth';
@inject(AuthService, HttpClient)
export class UserService {
    currentUsersName = "";
    availableUsers = [];
    constructor(auth, http){
        this.auth = auth;
        this.http = http;
        this.initUsersName();
        this.initAvailableUsers();
    }
    login(email, password){
        return this.auth.login(email, password)
        .then(response=>{
            console.log("success logged " + response);
            this.initUsersName();
            this.initAvailableUsers();
        })
        .catch(err=>{
            console.log("login failure");
        });
    };
    initUsersName() {
        this.usersName = this.auth.getMe()
            .then((usersName) =>
            {
                this.usersName = usersName.resp;
            }
        );
    }
    initAvailableUsers(){
        return this.http
            .fetch('getAvailableUsers', {
                'method':'get'
        })
        .then(response => {
            if(response.status > 400)
                throw response;
            return response.json();
        })
        .then((availableUsers) =>
        {
            this.availableUsers = availableUsers.resp;
        });
    }
    logout(){
        this.usersName = "";
        this.availableUsers = [];
        this.auth.logout();
    }
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
}