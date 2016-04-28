import trimHtml from 'trim-html';
export class TrimHtmlValueConverter {
  toView(value, length, suffix = " […]") {
    return trimHtml(value, { limit: length, suffix: suffix }).html;
  }
}