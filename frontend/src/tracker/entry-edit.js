import { ActivityService } from "./activityService";
import { MoodService } from "./moodService";
import { inject } from "aurelia-framework";
import { EntryService } from "./entryService";

@inject(ActivityService, MoodService, EntryService)
export class EntryEdit {
    entryService;
    note;
    selectedActivities = new Map(); // map of activityId to count
    mood;
    moods;
    activities;
    activityService;
    moodService;
    entry;
    date;
    time;
    get nonArchivedActivities() {
        return Array.from(this.activities.values())
            .filter((entry) => !entry.isArchived);
    }
    constructor(activityService, moodService, entryService) {
        this.activityService = activityService;
        this.moodService = moodService;
        this.entryService = entryService;
        this.activities = this.activityService.getActivities();
        this.moodService.getMoods()
            .then((moods)=>{
                this.moods = moods;
            });
        this.date = new Date().toISOString().substr(0,10);
        this.time = new Date().toTimeString().substr(0,5);
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
        this.entry = { activities: new Map(this.selectedActivities), _id: undefined, mood: this.mood, note: this.note, time: this.time, date: this.date }
        this.entryService.addEntry(this.entry);
        this.selectedActivities = new Map();
        this.mood = undefined;
        this.note = undefined;
        this.date = new Date().toISOString().substr(0,10);
        this.time = new Date().toTimeString().substr(0,5);
    }
}