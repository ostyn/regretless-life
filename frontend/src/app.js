import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PageChanged} from 'messages/messages'
@inject(FetchConfig)
export class App {
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'blog'], moduleId: './routes/post-list-base',nav: false, title: 'blog', name:'blog' },
      { route: 'drafts', moduleId: './routes/post-list-draft',nav: false, title: 'drafts', name:'drafts', auth: true },
      { route: 'search', moduleId: './routes/post-list-search',nav: false, title: 'search', name:'search' },
      { route: 'tag/:tag', moduleId: './routes/post-list-tag',nav: false, title: 'tag', name:'tag' },
      { route: 'editor', moduleId: './routes/editor',nav: false, title: 'editor', name:'editor', auth:true},
      { route: 'post/:id', moduleId: './routes/post', name:'post', nav: false, title: config.title },
      { route: 'about', moduleId: './routes/post', name:'about', nav: true, title: 'about us'},
      { route: 'login', moduleId: './routes/login', nav: false, title: 'login'},
      { route: 'register', moduleId: './routes/register', nav: false, title: 'register', auth:true},
      { route: 'places', moduleId: './routes/places', nav: true, title: 'places'},
    ]);

    this.router = router;
  }
  constructor(fetchConfig){
    this.fetchConfig = fetchConfig;
  }

  activate(){
    this.fetchConfig.configure();
  }
}
@inject(EventAggregator)
class PostCompleteStep {
  constructor(eventAggregator){
    this.eventAggregator = eventAggregator;
  }
  run(routingContext, next) {
      this.eventAggregator.publish(new PageChanged());
      window.scrollTo(0, 0);
      return next();
  }
}