import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/auth';

// Pass in your own configuration options
const config = {
  projectId: "regretless-life-test",
  apiKey: 'YOUR_API_KEY_HERE',
  storageBucket: "regretless-life-test.appspot.com",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    }
  ],
  authDomain: 'http://localhost:8080'
};

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase;
