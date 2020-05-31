import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PageChanged } from 'messages/messages';
import { HttpClient } from 'aurelia-fetch-client';
import {PLATFORM} from 'aurelia-pal';
import { UserService } from './services/userService';
import {Redirect} from 'aurelia-router';
@inject(HttpClient)
export class App {
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
  constructor(http) {
    http.configure(config => {
      config
        .withBaseUrl(window.location.protocol + '//' + window.location.hostname + '/data/')
        .withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          }
        });
    });
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

@inject(EventAggregator, UserService)
class CheckAuth {
  constructor(eventAggregator, userService) {
    this.eventAggregator = eventAggregator;
    this.userService = userService;
  }
  run(routingContext, next) {
    if(!routingContext.config.auth || this.userService.isAuthorized)
      return next();
    return next.cancel(new Redirect('/'));
  }
}