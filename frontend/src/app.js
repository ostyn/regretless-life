import { FetchConfig, AuthorizeStep } from 'aurelia-auth';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PageChanged } from 'messages/messages';
import { HttpClient } from 'aurelia-fetch-client';
@inject(FetchConfig, HttpClient)
export class App {
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'blog'], moduleId: './routes/post-list-base', nav: false, title: 'blog', name: 'blog' },
      { route: 'drafts', moduleId: './routes/post-list-drafts', nav: false, title: 'drafts', name: 'drafts', auth: true },
      { route: 'search', moduleId: './routes/post-list-search', nav: false, title: 'search', name: 'search' },
      { route: 'tags/:tag', moduleId: './routes/post-list-tags', nav: false, title: 'tags', name: 'tags' },
      { route: 'editor', moduleId: './routes/editor', nav: false, title: 'editor', name: 'editor', auth: true },
      { route: 'post/:id', moduleId: './routes/post', name: 'post', nav: false, title: config.title },
      { route: 'about', moduleId: './routes/about', name: 'about', nav: true, title: 'about us' },
      { route: 'login', moduleId: './widgets/login', name: 'login', nav: false, title: 'login' },
      { route: 'register', moduleId: './routes/register', nav: false, title: 'register', auth: true },
      { route: 'places', moduleId: './routes/places', nav: true, title: 'places' },
      { route: 'tracker', moduleId: './routes/tracker', title: 'tracker', auth: true },
    ]);

    this.router = router;
  }
  constructor(fetchConfig, http) {
    http.configure(config => {
      config
        .withBaseUrl(window.location.protocol + '//' + window.location.hostname + '/data/')
        .withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Cache-Control': 'max-age=0, private, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
          }
        });
    });
    this.fetchConfig = fetchConfig;
  }

  activate() {
    this.fetchConfig.configure();
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