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
        if(this.workingCopy.id === undefined)
            this.moodService.addMood(this.workingCopy);
        else
            this.moodService.updateMood(this.workingCopy);
        this.resetActiveMood();
    }

    cancelEdit() {
        this.resetActiveMood();
    }

    deleteMood() {
        if(this.workingCopy && this.workingCopy.id !== undefined) {
            this.moodService.deleteMood(this.workingCopy.id);
            this.resetActiveMood();
        }
    }

    resetActiveMood() {
        this.mood = { name: undefined, emoji: undefined, id: undefined, rating: undefined };
    }
}