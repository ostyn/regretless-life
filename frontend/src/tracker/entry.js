import { ActivityService } from "./activityService";
import { inject, bindable } from "aurelia-framework";
import { MoodService } from "./moodService";
import { EntryService } from "./entryService";
import { EventAggregator } from "aurelia-event-aggregator";
@inject(ActivityService, MoodService, EntryService, EventAggregator)
export class Entry {
    entryService;
    @bindable entry;
    activities = [];
    subscribers = [];
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
        this.getActivities();
    }

    attached() {
        this.subscribers.push(this.ea.subscribe('moodsUpdated', this.getMoods));
        this.subscribers.push(this.ea.subscribe('activitiesUpdated', this.getActivities));
      }
    
    detached() {
        this.subscribers.forEach(sub => this.subscribers.pop().dispose());
    }

    getActivities = () => {
        this.activityService.getActivities()
            .then((activities) => {
                this.activities = activities;
            });
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

    buildActivityString(id, count) {
        if(this.activities.length == 0)
            return;
        let activity = this.activities.find(activity => activity._id === id);
        return `${activity.name}x${count}`;
    }
}