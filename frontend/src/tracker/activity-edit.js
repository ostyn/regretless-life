import { ActivityService } from "./activityService";
import { inject, bindable } from "aurelia-framework";
@inject(ActivityService)
export class ActivityEdit {
    @bindable activity;
    workingCopy;
    activityService;
    constructor(activityService) {
        this.activityService = activityService;
    }
    activityChanged(){
        if(this.activity === undefined)
            this.resetActiveActivity();
        else
            this.workingCopy = Object.assign({}, this.activity)
    }

    submitActivity() {
        this.activityService.saveActivity(this.workingCopy);
        this.resetActiveActivity();
    }

    cancelEdit() {
        this.resetActiveActivity();
    }

    deleteActivity() {
        if(this.workingCopy && this.workingCopy._id !== undefined) {
            this.activityService.deleteActivity(this.workingCopy._id);
            this.resetActiveActivity();
        }
    }

    resetActiveActivity() {
        this.activity = { emoji: undefined, _id: undefined, isArchived: undefined, name: undefined };
    }
}