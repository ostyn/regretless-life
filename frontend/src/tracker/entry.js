import { ActivityService } from "./activityService";
import { inject, bindable } from "aurelia-framework";
import { MoodService } from "./moodService";
import { EntryService } from "./entryService";
import { EventAggregator } from "aurelia-event-aggregator";
@inject(ActivityService, MoodService, EntryService, EventAggregator)
export class Entry {
    entryService;
    @bindable entry;
    activities;
    moods;
    currentMood;
    activityService;
    moodService;
    constructor(activityService, moodService, entryService, eventAggregator) {
        this.activityService = activityService;
        this.moodService = moodService;
        this.entryService = entryService;
        this.ea = eventAggregator;
        this.getMoods();
        this.activities = this.activityService.getActivities();
    }
    attached() {
        this.subscriber = this.ea.subscribe('moodsUpdated', this.getMoods);
    }
    
    detached() {
        this.subscriber.dispose();
    }
    getMoods = () => {
        this.moodService.getMoods()
            .then((moods)=>{
                this.moods = moods;
                this.currentMood = this.moods.find(mood => mood._id === this.entry.mood);
            });
    }
    deleteEntry(id){
        this.entryService.deleteEntry(id);
    }
}