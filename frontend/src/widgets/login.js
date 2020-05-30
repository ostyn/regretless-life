import { inject } from 'aurelia-framework';
import { UserService } from 'services/userService';
import firebase from "firebase";
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css';
@inject(UserService)
export class Login {
    constructor(userService) {
        this.userService = userService;
    }
    attached(){
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.ui.start('#firebaseui-auth-container', uiConfig);
            }
        });
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        var uiConfig = {
            signInFlow: 'popup',
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
                },
            ],
            callbacks: {
                signInSuccess: () => false,
            },
            credentialHelper: firebaseui.auth.CredentialHelper.NONE
        };
    }
}