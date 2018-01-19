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
        if(this.workingCopy.id === undefined)
            this.activityService.addActivity(this.workingCopy);
        else
            this.activityService.updateActivity(this.workingCopy);
        this.resetActiveActivity();
    }

    cancelEdit() {
        this.resetActiveActivity();
    }

    deleteActivity() {
        if(this.workingCopy && this.workingCopy.id !== undefined) {
            this.activityService.deleteActivity(this.workingCopy.id);
            this.resetActiveActivity();
        }
    }

    resetActiveActivity() {
        this.activity = { emoji: undefined, id: undefined, isArchived: undefined, name: undefined };
    }
}