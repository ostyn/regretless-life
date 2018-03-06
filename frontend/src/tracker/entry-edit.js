import { ActivityService } from "./activityService";
import { MoodService } from "./moodService";
import { inject, bindable } from "aurelia-framework";
import { EntryService } from "./entryService";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(ActivityService, MoodService, EntryService, EventAggregator)
export class EntryEdit {
    @bindable entry;
    activities = [];
    subscribers = [];
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
        this.entry = this.newEntry();
    }

    attached() {
        this.subscribers.push(this.ea.subscribe('moodsUpdated', this.getMoods));
        this.subscribers.push(this.ea.subscribe('activitiesUpdated', this.getActivities));
    }

    detached() {
        this.subscribers.forEach(sub => this.subscribers.pop().dispose());
    }

    getMoods = () => {
        this.moods = this.moodService.getMoods();
    }
    getActivities = () => {
        this.activities = this.activityService.getActivities();
    }

    addActivity(id) {
        if (this.entry.activities.has(id))
            this.entry.activities.set(id, this.entry.activities.get(id) + 1);
        else
            this.entry.activities.set(id, 1);
    }
    removeActivity(id) {
        if (this.entry.activities.get(id) > 1)
            this.entry.activities.set(id, this.entry.activities.get(id) - 1);
        else
            this.entry.activities.delete(id);
    }
    submitEntry() {
        this.entryService.addEntry(this.entry);
        this.entry = this.newEntry();
    }
    findActivity(id) {
        return this.activities.find(activity => activity._id === id);
    }
    newEntry() {
        var date = new Date();
        return {
            activities: new Map(),
            mood: undefined,
            note: undefined,
            date: date.getFullYear() + '-' + this.padValue(date.getMonth() + 1, 2) + '-' +  this.padValue(date.getDate(), 2),
            time: date.toTimeString().substr(0, 5)
        }
    }
    padValue(value, width) {
        let padding = "0".repeat(width)
        return (padding + value).slice (-width);
    }
}