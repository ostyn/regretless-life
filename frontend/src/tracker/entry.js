import { ActivityService } from "./activityService";
import { inject, bindable } from "aurelia-framework";
import { MoodService } from "./moodService";
import { EntryService } from "./entryService";
@inject(ActivityService, MoodService, EntryService)
export class Entry {
    entryService;
    @bindable entry;
    activities;
    moods;
    activityService;
    moodService;
    constructor(activityService, moodService, entryService) {
        this.activityService = activityService;
        this.moodService = moodService;
        this.entryService = entryService;
        this.moods = this.moodService.getMoods();
        this.activities = this.activityService.getActivities();
    }
    deleteEntry(id){
        this.entryService.deleteEntry(id);
    }
}