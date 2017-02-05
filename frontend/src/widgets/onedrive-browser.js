import OneDrive from 'onedrive';
import { bindable, inject } from 'aurelia-framework';
import {BlogDao} from 'dao/BlogDao';
import {FormatLib} from 'util/FormatLib';
@inject(BlogDao, FormatLib)
export class OnedriveBrowser {
    usingOnedrive = true;
    @bindable files = [];
    @bindable images = [];
    width=1024;
    height=9999;
    constructor(blogDao, formatLib) {
        this.blogDao = blogDao;
        this.formatLib = formatLib;
    }
    launchOneDrivePicker() {
        this.openOneDriveWindow();
    }
    openOneDriveWindow() {
        var fullUrl = 'https://' + location.hostname + (location.port ? ':' + location.port : '');
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
                this.processImages(files);
            },
            cancel: function () { /* cancel handler */ },
            error: function (e) { /* error handler */ }
        }
        OneDrive.open(odOptions);
    }
    processImages(files){
        this.files = files.value;
        var slotOffset = this.images.length;
        this.blogDao.getAuthkey(files.webUrl).then((authkey)=>{
            this.files.sort(this.formatLib.dynamicSort("name"));
            for(var index in this.files) {
                var url = `https://api.onedrive.com/v1.0/drive/items/${this.files[index].id}/thumbnails?select=c9999x9999&authkey=${authkey}&access_token=${window.localStorage.getItem("access_token")}`;
                this.images.push({
                    'name':this.files[index].name, 
                    'id':this.files[index].id,
                    'url':'loading.gif'
                    });
                let slotIndex = index;
                this.blogDao.getOneDriveLink(url)
                .then((resp)=>{
                    var urlTemp = resp.value[0]['c9999x9999']['url'];
                    var urlTempParts= urlTemp.split('?');
                    urlTemp = urlTempParts[0];
                    this.images[parseInt(slotIndex)+slotOffset].url = urlTemp;
                });
            }
        });
        //files.webUrl goes to getAuthkey
        //Once that returns, get the access token by hitting
        //https://login.live.com/oauth20_authorize.srf?client_id=dfa0eeeb-f33a-41a8-b0e8-c9d4feb8c648&scope=onedrive.readwrite&response_type=token&redirect_uri=http://localhost:9000/onedriveRedirect.html
        //That page needs to be altered to save the accesstoken to localStorage
        //Once that's done, we'll use the access token and authkey and loop through
        //https://api.onedrive.com/v1.0/drive/items/ITEMID/thumbnails?select=c9999x9999%2Cc1024x999999%2Cc660x999999%2Cc256x999999&authkey=AUTHKEY&access_token=TOKEN
        //(we really only need to select the first one)
        //We then use these urls to populate the files list along with the original name
    }
    removeItem(index) {
        this.files.splice(index, 1);
    }
    insertImgNodeAtCursor(imgUrl, name, id) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount && sel.focusNode.parentNode.isContentEditable) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var imgNode = document.createElement("img");
                imgNode.src = imgUrl;
                if(name)
                    imgNode.alt = name + "|" + id;
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
        if (this.usingOnedrive)
            return file.thumbnails[0]['c9999x9999']['url'].split('?')[0];
        else
            return file['url'].split('?')[0]
    }
    setWidthHeight(width, height){
        this.width = width;
        this.height = height;
    }
}