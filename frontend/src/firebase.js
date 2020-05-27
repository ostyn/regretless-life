import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

// Pass in your own configuration options
const config = {
  projectId: "regretless-life-test",
  storageBucket: "regretless-life-test.appspot.com",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase;
