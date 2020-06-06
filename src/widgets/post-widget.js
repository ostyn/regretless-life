import {inject, bindable} from 'aurelia-framework';
import {FormatLib} from 'util/FormatLib';
import {UserService} from 'services/userService';
@inject(FormatLib, UserService)
export class PostWidget {
    @bindable post = undefined;
    @bindable showTitleLink = false;
    @bindable showMapButton = true;
    @bindable useLongAuthorDate = true;
    @bindable contentLength = -1;
    @bindable showCommentsLink = false;
    @bindable showTagLinks = true;
    @bindable showLastEditedDate = true;
    @bindable showAuthorDate = true;
    @bindable expandPostTitle = false;
    constructor(formatLib, userService) {
        this.formatLib = formatLib;
        this.userService = userService;
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
    getAuthorDate(useLongAuthorDate) {
        if(useLongAuthorDate==true)
            return `by ${this.post.author} on ${this.formatLib.secondsToDate(this.post.date)} at ${this.formatLib.secondsToTime(this.post.date)}`
        else
            return `by ${this.post.author}, ${this.formatLib.secondsToDate(this.post.date)}`
    }
    getLinkParams(post){
        return { 
            'id': post._id
        };
    }
    get commentNumberText () {
        const numberOfComments = (this.post.comments) ? this.post.comments.length : 0;
        return `${numberOfComments} comment${numberOfComments == 1 ? "" : "s"}`;
    }
}