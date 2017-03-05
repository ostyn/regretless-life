import {inject, bindable} from 'aurelia-framework';
import {FormatLib} from 'util/FormatLib';
import {AuthService} from 'aurelia-auth';
@inject(FormatLib, AuthService)
export class PostWidget {
    @bindable post = undefined;
    @bindable showTitleLink = false;
    @bindable showMapButton = true;
    @bindable useLongAuthorDate = true;
    @bindable contentLength = -1;
    @bindable showCommentsLink = false;
    constructor(formatLib, auth) {
        this.formatLib = formatLib;
        this.auth = auth;
    }
    toggleMap(){
        if(!this.mapLoaded) {
            this.mapLoaded = true;
            this.mapShown = true;
        }
        else {
            this.mapShown = !this.mapShown;
        }
    }
    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
    getAuthorDate(useLongAuthorDate) {
        if(useLongAuthorDate)
            return `by ${this.post.author} on ${this.formatLib.secondsToDate(this.post.date)} at ${this.formatLib.secondsToTime(this.post.date)}`
        else
            return `by ${this.post.author}, ${this.formatLib.secondsToDate(this.post.date)}`
    }
    getLinkParams(post){
        return { 
            'id': post._id, 
            'isDraft': (post.isDraft) ? post.isDraft : undefined 
        };
    }
}