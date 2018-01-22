import { MoodService } from "./moodService";
import { inject, bindable } from "aurelia-framework";
@inject(MoodService)
export class MoodEdit {
    @bindable mood;
    workingCopy;
    moodService;
    constructor(moodService) {
        this.moodService = moodService;
    }

    moodChanged(){
        if(this.mood === undefined)
            this.resetActiveMood();
        else
            this.workingCopy = Object.assign({}, this.mood)
    }

    submitMood() {
        this.moodService.saveMood(this.workingCopy)
            .then(()=> {this.resetActiveMood()});
    }

    cancelEdit() {
        this.resetActiveMood();
    }

    deleteMood() {
        if(this.workingCopy && this.workingCopy._id !== undefined) {
            this.moodService.deleteMood(this.workingCopy._id);
            this.resetActiveMood();
        }
    }

    resetActiveMood() {
        this.mood = { name: undefined, emoji: undefined, _id: undefined, rating: undefined };
    }
}