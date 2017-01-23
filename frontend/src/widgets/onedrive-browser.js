import OneDrive from 'onedrive';
export class OnedriveBrowser {
    files = [];
    width=1024;
    height=9999;
    launchOneDrivePicker() {
        var fullUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var odOptions = {
            clientId: "dfa0eeeb-f33a-41a8-b0e8-c9d4feb8c648",
            action: "share",
            multiSelect: true,
            openInNewWindow: true,
            advanced: {
                'redirectUri': fullUrl + '/onedrive.html',
                'createLinkParameters': { 
                    'type': "embed"
                }
            },
            success: (files) => {
                this.files = files.value;
            },
            cancel: function () { /* cancel handler */ },
            error: function (e) { /* error handler */ }
        }
        OneDrive.open(odOptions);
    }
    removeItem(index) {
        this.files.splice(index, 1);
    }
    insertImgNodeAtCursor(imgUrl, name) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount && sel.focusNode.parentNode.isContentEditable) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var imgNode = document.createElement("img");
                imgNode.src = imgUrl;
                imgNode.alt = name;
                range.insertNode(imgNode);
                //Finding the last isContentEditable element ancestor to notify of the change
                let node = sel.focusNode;
                let parentElement = sel.parentElement;
                while (node.parentNode.isContentEditable) {
                    parentElement = node.parentElement;
                    node = node.parentNode;
                }
                parentElement.dispatchEvent(new Event('change'));
                //Move cursor after added element
                range.setStartAfter(imgNode);
                sel.removeAllRanges();
                sel.addRange(range);   
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = imgUrl;
        }
    }
    getFileUrl(file){
        return file.thumbnails[0]['large']['url'];
    }
}