export class App {
  configureRouter(config, router) {
    config.title = 'regretless.life';
    config.map([
      { route: ['', 'blog'], moduleId: 'blog',nav: false, title: 'blog', name:['', 'blog'] },
      { route: ['search'], moduleId: 'blog',nav: false, title: 'blog', name:'search' },
      { route: 'editor', moduleId: 'editor',nav: false, title: 'editor' },
      { route: 'flights', moduleId: 'flights', nav: true, title: 'flights' },
      { route: 'city/:name/explore', moduleId: 'city-page', nav: false, title: config.title },
      { route: 'post/:id', moduleId: 'post', name:'post', nav: false, title: config.title },
      { route: 'about', moduleId: 'about', nav: true, title: 'about' }
    ]);

    this.router = router;
  }
}
