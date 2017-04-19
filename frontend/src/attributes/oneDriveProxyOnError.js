import {inject} from 'aurelia-framework';

@inject(Element)
export class OneDriveProxyOnErrorCustomAttribute {
  markdownString = 'onerror="this.onerror=null; this.src=\'https://regretless.life/data/oneDriveImageProxy?url=\' + encodeURIComponent(this.src);"';
  constructor(element) {
    element.onerror=()=>{
        element.onerror=null;
        element.src='https://regretless.life/data/oneDriveImageProxy?url=' + encodeURIComponent(element.src);
    }
  }
}