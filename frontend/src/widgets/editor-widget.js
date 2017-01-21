import MediumEditor from 'medium-editor';
import toMarkdown from 'to-markdown';
import { bindable } from 'aurelia-framework';
export class EditorWidget {
    editor = undefined;
    @bindable markdown;
    @bindable startingValue;
    Md = MediumEditor.Extension.extend(function () {
        var ret = {
            name: 'md'
        }
        var options, callback;
        if (typeof options === "function") {
            callback = options;
            options = {};
        }

        // Defaults
        options = Object(options);
        options.events = options.events || ["input", "change"];
        callback = callback || options.callback || function () { };

        var toMarkdownOptions = options.toMarkdownOptions = Object(options.toMarkdownOptions);
        toMarkdownOptions.converters = toMarkdownOptions.converters || [];

        if (!options.ignoreBuiltInConverters) {
            toMarkdownOptions.converters.push({
                filter: function (node) {
                    return node.nodeName === "DIV" && !node.attributes.length;
                }
                , replacement: function (content) {
                    return content;
                }
            });
        }

        function normalizeList($elm) {
            var $children = $elm.children;
            for (var i = 0; i < $children.length; ++i) {
                var $cChild = $children[i];
                var $br = $cChild.querySelector("br");
                $br && $br.remove();
                !$cChild.innerHTML.trim() && $cChild.remove();
                var $prevChild = $children[i - 1];
                if (/^UL|OL$/.test($cChild.tagName)) {
                    try {
                        $prevChild.appendChild($cChild);
                    } catch (e) { console.warn(e); }
                    normalizeList($cChild);
                }
            }
        }

        // Called by medium-editor during init
        ret["init"] = function () {
            callback = this.base.options.mdOptions.callback;
            // If this instance of medium-editor doesn't have any elements, there's nothing for us to do
            if (!this.base.elements || !this.base.elements.length) {
                return;
            }

            // Element(s) that this instance of medium-editor is attached to is/are stored in .elements
            this.element = this.base.elements[0];

            // String.prototype.trimRight is non-standard, this should have the same effect
            var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*$/;

            var handler = function () {
                var $clone = this.element.cloneNode(true);
                var $lists = $clone.querySelectorAll("ul, ol");
                for (var i = 0; i < $lists.length; ++i) {
                    normalizeList($lists[i]);
                }

                callback(toMarkdown($clone.innerHTML, options.toMarkdownOptions).split("\n").map(function (c) {
                    return c.replace(rightWhitespace, '');
                }).join("\n").replace(rightWhitespace, ''));
            }.bind(this);

            options.events.forEach(function (c) {
                this.element.addEventListener(c, handler);
            }.bind(this));

            handler();
        };
        return ret;
    } ()
    );
    attached() {
        this.editor = new MediumEditor('.editable', {
            toolbar: {
                buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'image', 'unorderedlist', 'orderedlist']
            },
            extensions: {
                'md': new this.Md()
            },
            'mdOptions': {
                callback: (mdText) => {
                    this.markdown = mdText;
                }
            }
        });
    }
    detached(){
        this.editor.destroy();
    }
}