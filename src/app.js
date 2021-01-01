import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PageChanged } from 'messages/messages';
import {PLATFORM} from 'aurelia-pal';
import {Redirect} from 'aurelia-router';
import firebase from "firebase";
import { BlogDao } from './dao/BlogDao';
@inject(BlogDao)
export class App {
  constructor(blogDao) {
    this.blogDao = blogDao;
  }
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.addPipelineStep('authorize', CheckAuth);
    config.addPipelineStep('postcomplete', PostCompleteStep);
     config.map([
      { route: ['', 'blog'], moduleId: PLATFORM.moduleName('./routes/post-list-base'), nav: false, title: 'blog', name: 'blog' },
      { route: 'drafts', moduleId: PLATFORM.moduleName('./routes/post-list-drafts'), nav: false, title: 'drafts', name: 'drafts', auth: true },
      { route: 'tags/:tag', moduleId: PLATFORM.moduleName('./routes/post-list-tags'), nav: false, title: 'tags', name: 'tags' },
      { route: 'editor', moduleId: PLATFORM.moduleName('./routes/editor'), nav: false, title: 'editor', name: 'editor', auth: true },
      { route: 'post/:id', moduleId: PLATFORM.moduleName('./routes/post'), name: 'post', nav: false, title: config.title },
      { route: 'about', moduleId: PLATFORM.moduleName('./routes/about'), name: 'about', nav: true, title: 'about us' },
      { route: 'places', moduleId: PLATFORM.moduleName('./routes/places'), nav: true, title: 'places' },
      { route: 'unsubscribe/:id', moduleId: PLATFORM.moduleName('./routes/unsubscribe'), title: 'unsubscribe', auth: false },
     ]);

    this.router = router;
  }
}
@inject(EventAggregator)
class PostCompleteStep {
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }
  run(routingContext, next) {
    this.eventAggregator.publish(new PageChanged());
    window.scrollTo(0, 0);
    return next();
  }
}
class CheckAuth {
  run(navigationInstruction, next) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            let currentRoute = navigationInstruction.config;
            let loginRequired = currentRoute.auth && currentRoute.auth === true;
            if (!user && loginRequired) {
                return resolve(next.cancel(new Redirect('')));
            }
            return resolve(next());
        });
    });
}
}
