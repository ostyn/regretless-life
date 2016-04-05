import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
	
  aurelia.use
    .plugin('aurelia-google-maps', config => {
        config.options({
            apiKey: 'APICODEHERE'
        });
    });
  aurelia.start().then(a => a.setRoot());
}