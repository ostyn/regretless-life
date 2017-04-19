import showdown from 'showdown';
import youtube from 'showdown-youtube';
import {inject} from 'aurelia-framework';
import {OneDriveProxyOnErrorCustomAttribute} from 'attributes/oneDriveProxyOnError'
@inject(OneDriveProxyOnErrorCustomAttribute)
export class MarkdownFormatValueConverter {
  constructor(oneDriveProxy) {
    showdown.setOption('tables', 'true');
    showdown.setOption('simplifiedAutoLink', 'true');
    let imgRegex = /(?:<p>)?<img.*?src="(.+?)"(.*?)\/?>(?:<\/p>)?/gi;
    showdown.extension('imageProxy', function () {
      return [
        {
          type: 'output',
          filter: function (text, converter, options) {
            return text.replace(imgRegex, function (match, url, rest) {               
                return match.replace("<img ", "<img " + oneDriveProxy.markdownString + " ");
            });
          }
        }
      ];
    });
    this.converter = new showdown.Converter({extensions: ['youtube', 'imageProxy']});
  }
  toView(value) {
    if(!value)
      value = "";
    return this.converter.makeHtml(
      value.split('\n').map((line) => line.trim()).join('\n')
    );
  }
}