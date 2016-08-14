import config from 'authConfig'; 
import fetch from 'whatwg-fetch';
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-auth', (baseConfig)=>{
         baseConfig.configure(config);
    })
    .plugin('aurelia-google-maps', config => {
      config.options({
          apiKey: 'TESTKEY',
          apiLibraries: 'drawing,geometry' //get optional libraries like drawing, geometry, ... - comma seperated list
      });
    });
	
  aurelia.start().then(a => a.setRoot());
}