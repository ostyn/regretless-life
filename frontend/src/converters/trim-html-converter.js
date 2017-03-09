import trimHtml from 'trim-html';
import striptags from 'striptags';
export class TrimHtmlValueConverter {
  toView(value, length, suffix = " <span class='grey small'>…</span>") {
    if(length < 0)
      return value;
    else
      return striptags(trimHtml(value, { limit: length, suffix: suffix }).html, 
        ['p','strong', 'em', 'i', 'b', 'ul','ol','li','a','blockquote','h1','h2','h3','h4','h5','h6']
      );
  }
}