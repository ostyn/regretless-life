import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
@inject(FetchConfig)
export class App {
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'blog'], moduleId: './routes/blog',nav: false, title: 'blog', name:['', 'blog'] },
      { route: 'drafts', moduleId: './routes/blog',nav: false, title: 'drafts', name:'drafts', auth: true },
      { route: 'search', moduleId: './routes/blog',nav: false, title: 'search', name:'search' },
      { route: 'editor', moduleId: './routes/editor',nav: false, title: 'editor', name:'editor', auth:true},
      { route: 'flights', moduleId: './routes/flights', nav: false, title: 'flights' },
      { route: 'city/:name/explore', moduleId: './routes/city-page', nav: false, title: config.title },
      { route: 'post/:id', moduleId: './routes/post', name:'post', nav: false, title: config.title },
      { route: 'questions', moduleId: './routes/questions', nav: false, title: 'q + a' },
      { route: 'about', moduleId: './routes/post', name:'about', nav: true, title: 'about us'},
      { route: 'login', moduleId: './routes/login', nav: false, title: 'login'},
      { route: 'register', moduleId: './routes/register', nav: false, title: 'register', auth:true},
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
class PostCompleteStep {
  run(routingContext, next) {
      window.scrollTo(0, 0);
      return next();
  }
}