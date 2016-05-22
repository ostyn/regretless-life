import showdown from 'showdown';
import prism from 'prismjs';
export class MarkdownFormatValueConverter {
  constructor() {
    showdown.setOption('tables', 'true');
    showdown.setOption('simplifiedAutoLink', 'true');
    this.converter = new showdown.Converter();
  }
  toView(value) {
    if(!value)
      value = "";
    return this.converter.makeHtml(
      value.split('\n').map((line) => line.trim()).join('\n')
    );
  }
}