import trimHtml from 'trim-html';
export class TrimHtmlValueConverter {
  toView(value, length, suffix = " <span class='grey small'>[…]</span>") {
    return trimHtml(value, { limit: length, suffix: suffix }).html;
  }
}