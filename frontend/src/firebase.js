import * as firebase from 'firebase/app';
import 'firebase/firestore';

// Pass in your own configuration options
const config = {
  projectId: "regretless-life-test",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase;
