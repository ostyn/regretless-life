import { ActivityService } from "./activityService";
import { MoodService } from "./moodService";
import { inject } from "aurelia-framework";
import { EntryService } from "./entryService";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(ActivityService, MoodService, EntryService, EventAggregator)
export class EntryEdit {
    entryService;
    note;
    selectedActivities = new Map(); // map of activityId to count
    mood;
    moods;
    activities = [];
    subscribers = [];
    activityService;
    moodService;
    entry;
    date;
    time;
    get nonArchivedActivities() {
        return this.activities
            .filter((activity) => !activity.isArchived);
    }
    constructor(activityService, moodService, entryService, eventAggregator) {
        this.activityService = activityService;
        this.moodService = moodService;
        this.entryService = entryService;
        this.ea = eventAggregator;
        this.getActivities();
        this.getMoods();
        this.date = new Date().toISOString().substr(0,10);
        this.time = new Date().toTimeString().substr(0,5);
    }

    attached() {
        this.subscribers.push(this.ea.subscribe('moodsUpdated', this.getMoods));
        this.subscribers.push(this.ea.subscribe('activitiesUpdated', this.getActivities));
      }
    
    detached() {
        this.subscribers.forEach(sub => this.subscribers.pop().dispose());
    }

    getMoods = () => {
        this.moodService.getMoods()
            .then((moods) => {
                this.moods = moods;
            });
    }
    getActivities = () => {
        this.activityService.getActivities()
            .then((activities) => {
                this.activities = activities;
            });
    }

    addActivity(id) {
        if (this.selectedActivities.has(id))
            this.selectedActivities.set(id, this.selectedActivities.get(id) + 1);
        else
            this.selectedActivities.set(id, 1);
    }
    removeActivity(id) {
        if (this.selectedActivities.get(id) > 1)
            this.selectedActivities.set(id, this.selectedActivities.get(id) - 1);
        else
            this.selectedActivities.delete(id);
    }
    submitEntry() {
        this.entry = { activities: this.selectedActivities, _id: undefined, mood: this.mood, note: this.note, time: this.time, date: this.date }
        this.entryService.addEntry(this.entry);
        this.selectedActivities = new Map();
        this.mood = undefined;
        this.note = undefined;
        this.date = new Date().toISOString().substr(0,10);
        this.time = new Date().toTimeString().substr(0,5);
    }
    findActivity(id) {
        return this.activities.find(activity => activity._id === id);
    }
}