To build and deploy:
$ au build --env prod
$ firebase deploy

If it's your first time setting up, you'll need to setup the firebase-send-mail extension in your project:
$ firebase ext:install firestore-send-email --project=regretless-life-test