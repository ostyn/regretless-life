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
          apiKey: 'AIzaSyDJUe-5GYpgt4u034NjKCa7qlWm4_TPsQ4',
          apiLibraries: 'drawing,geometry' //get optional libraries like drawing, geometry, ... - comma seperated list
      });
    });
	
  aurelia.start().then(a => a.setRoot());
}