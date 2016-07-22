export class App {
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'blog'], moduleId: './routes/blog',nav: false, title: 'blog', name:['', 'blog'] },
      { route: ['search'], moduleId: './routes/blog',nav: false, title: 'blog', name:'search' },
      { route: 'editor', moduleId: './routes/editor',nav: false, title: 'editor', name:'editor' },
      { route: 'flights', moduleId: './routes/flights', nav: false, title: 'flights' },
      { route: 'city/:name/explore', moduleId: './routes/city-page', nav: false, title: config.title },
      { route: 'post/:id', moduleId: './routes/post', name:'post', nav: false, title: config.title },
      { route: 'questions', moduleId: './routes/questions', nav: true, title: 'q + a' },
      { route: 'about', moduleId: './routes/about', nav: true, title: 'about us'},
    ]);

    this.router = router;
  }
  
}
class PostCompleteStep {
  run(routingContext, next) {
      window.scrollTo(0, 0);
      return next();
  }
}