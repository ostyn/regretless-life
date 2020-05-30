import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {AuthService} from 'aurelia-auth';
import firebase from "firebase";
@inject(AuthService, HttpClient)
export class UserService {
    currentUsersName = "";
    availableUsers = [];
    authenticated
    constructor(auth, http){
        this.auth = auth;
        this.http = http;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.authenticated = true;
                this.usersName = user.displayName;
                //     this.initAvailableUsers();
            } else {
                //this.logout();
            }
        });
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
        this.user = undefined;
        this.authenticated = false;
        firebase.auth().signOut();
    }
    get isAuthenticated(){
        return this.authenticated;
    }
}