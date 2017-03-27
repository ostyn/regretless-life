import showdown from 'showdown';
import youtube from 'showdown-youtube';
export class MarkdownFormatValueConverter {
  constructor() {
    showdown.setOption('tables', 'true');
    showdown.setOption('simplifiedAutoLink', 'true');
    let imgRegex = /(?:<p>)?<img.*?src="(.+?)"(.*?)\/?>(?:<\/p>)?/gi;
    showdown.extension('imageProxy', function () {
      return [
        {
          type: 'output',
          filter: function (text, converter, options) {
            return text.replace(imgRegex, function (match, url, rest) {               
                var addon = 'onerror="this.onerror=null;this.src=\'http://regretless.life/data/oneDriveImageProxy?url=\' + encodeURIComponent(this.src);" ';
                return match.replace("<img ", "<img " + addon);
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