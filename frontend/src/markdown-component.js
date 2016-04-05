import {customAttribute, inject} from 'aurelia-framework';
import showdown from 'showdown';
import prism from 'prismjs';

@customAttribute('markdown-component')
@inject(Element)
export class MarkdownComponent {
  constructor(element) {
    this.element = element;
    // An instance of the converter
    this.converter = new showdown.Converter();
  }

  valueChanged(newValue) {
    this.element.innerHTML = this.converter.makeHtml(
      newValue.split('\n').map((line) => line.trim()).join('\n')
    );
    prism.highlightAll(this.element.querySelectorAll('code'));
  }
}