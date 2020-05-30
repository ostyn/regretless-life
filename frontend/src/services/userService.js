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
                var getAllUsers = firebase.functions().httpsCallable('getAllUsers');
                return getAllUsers().then((resp) => {
                    this.availableUsers = resp.data.users;
                }).catch((err) => {
                    return {error: err.message};
                });
            }
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