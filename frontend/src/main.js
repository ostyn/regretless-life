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
    })
    .plugin('aurelia-google-analytics', config => {
      config.init('UA-82516304-1');
      config.attach({
        logging: {
          enabled: false // Set to `true` to have some log messages appear in the browser console.
        },
        pageTracking: {
          enabled: true // Set to `false` to disable in non-production environments.
        },
        clickTracking: {
          enabled: false // Set to `false` to disable in non-production environments.
        }
      });
    });;
	
  aurelia.start().then(a => a.setRoot());
}