import OneDrive from 'onedrive';
import Clipboard from 'clipboard';
export class OnedriveBrowser {
    files = [];
    constructor() {
        new Clipboard('.copy');
    }
    launchOneDrivePicker() {
        var fullUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var odOptions = {
            clientId: "dfa0eeeb-f33a-41a8-b0e8-c9d4feb8c648",
            action: "share",
            multiSelect: true,
            openInNewWindow: true,
            advanced: {
                'redirectUri': fullUrl + '/onedrive.html'
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
}