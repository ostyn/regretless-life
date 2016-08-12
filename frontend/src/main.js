import config from 'authConfig'; 
import fetch from 'whatwg-fetch';
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-auth', (baseConfig)=>{
         baseConfig.configure(config);
    });
	
  aurelia.start().then(a => a.setRoot());
}