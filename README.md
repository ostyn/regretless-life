# regretless-life
Blog/website. Aurelia frontend. Firebase functions, database, hosting, storage, auth.

# `Setup`
1. Install Firebase locally and login.
2. Ctrl-F for `YOUR_API_KEY`_HERE. You should find two instances: one in `regretless-life/functions/index.js` for your Google Maps API key, and one in `regretless-life/src/firebase.js` for your Firebase API key. 
3. While you're updating your firebase.js be sure to update your `projectId` and `storageBucket` to the appropriate values for your Firebase project.
4. While in the root of the project, run `npm install`
5. Run `firebase deploy`

# `Aurelia`

This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).

For more information, go to https://aurelia.io/docs/cli/webpack

## Run dev app

Run `npm start`, then open `http://localhost:8080`

You can change the standard webpack configurations from CLI easily with something like this: `npm start -- --open --port 8888`. However, it is better to change the respective npm scripts or `webpack.config.js` with these options, as per your need.

To enable Webpack Bundle Analyzer, do `npm run analyze` (production build).

To enable hot module reload, do `npm start -- --hmr`.

To change dev server port, do `npm start -- --port 8888`.

To change dev server host, do `npm start -- --host 127.0.0.1`

**PS:** You could mix all the flags as well, `npm start -- --host 127.0.0.1 --port 7070 --open --hmr`

For long time aurelia-cli user, you can still use `au run` with those arguments like `au run --env prod --open --hmr`. But `au run` now simply executes `npm start` command.

## Build for production

Run `npm run build`, or the old way `au build --env prod`.

## Unit tests

Run `au test` (or `au jest`).

To run in watch mode, `au test --watch` or `au jest --watch`.
