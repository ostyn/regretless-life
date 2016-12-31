import trimHtml from 'trim-html';
// import stripTags from 'strip-tags';
export class TrimHtmlValueConverter {
  toView(value, length, suffix = " <span class='grey small'>[…]</span>") {
    //return stripTags(trimHtml(value, { limit: length, suffix: suffix }).html, ['img','iframe']);
    return trimHtml(value, { limit: length, suffix: suffix }).html;
  }
}