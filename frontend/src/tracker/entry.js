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
    currentMood;
    activityService;
    moodService;
    constructor(activityService, moodService, entryService) {
        this.activityService = activityService;
        this.moodService = moodService;
        this.entryService = entryService;
        this.moodService.getMoods()
            .then((moods)=>{
                this.moods = moods;
                this.currentMood = this.moods.find(mood => mood._id === entry.mood);
            });
        this.activities = this.activityService.getActivities();
    }
    deleteEntry(id){
        this.entryService.deleteEntry(id);
    }
}