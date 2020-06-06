import showdown from 'showdown';
import youtube from 'showdown-youtube';
import {inject} from 'aurelia-framework';
export class MarkdownFormatValueConverter {
  constructor() {
    showdown.setOption('tables', 'true');
    showdown.setOption('simplifiedAutoLink', 'true');
    this.converter = new showdown.Converter({extensions: ['youtube']});
  }
  toView(value) {
    if(!value)
      value = "";
    return this.converter.makeHtml(
      value.split('\n').map((line) => line.trim()).join('\n')
    );
  }
}