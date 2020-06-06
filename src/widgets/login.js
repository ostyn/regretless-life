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
        this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.ui.start('#firebaseui-auth-container', uiConfig);
            }
        });
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