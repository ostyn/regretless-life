import config from 'authConfig'; 
import {PLATFORM} from 'aurelia-pal';
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin(PLATFORM.moduleName('aurelia-auth'), (baseConfig)=>{
         baseConfig.configure(config);
    })
    .plugin(PLATFORM.moduleName('aurelia-google-maps'), config => {
      config.options({
          clientId:false,
          apiKey: 'AIzaSyDJUe-5GYpgt4u034NjKCa7qlWm4_TPsQ4',
          apiLibraries: 'drawing,geometry', //get optional libraries like drawing, geometry, ... - comma seperated list
          options: {zoomControl: false}
      });
    })
    .plugin(PLATFORM.moduleName('aurelia-google-analytics'), config => {
      config.init('UA-82516304-1');
      config.attach({
        logging: {
          enabled: false // Set to `true` to have some log messages appear in the browser console.
        },
        pageTracking: {
          enabled: true, // Set to `false` to disable in non-production environments.
          getTitle: function(){
            return window.document.title.split(' | ')[0];
          }
        },
        clickTracking: {
          enabled: false // Set to `false` to disable in non-production environments.
        }
      });
    })
    .globalResources(PLATFORM.moduleName("aurelia-auth/auth-filter"));
	
    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}