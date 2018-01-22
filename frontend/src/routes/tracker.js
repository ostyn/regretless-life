import { inject } from "aurelia-framework";
import { MoodService } from "tracker/moodService";
import { ActivityService } from "tracker/activityService";
import { EntryService } from "tracker/entryService";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(MoodService, ActivityService, EntryService, EventAggregator)
export class Tracker {
  entries;
  entryService;
  activityService;
  moodService;

  moods;
  activities;

  activity;
  mood;
  constructor(moodService, activityService, entryService, eventAggregator) {
    this.moodService = moodService;
    this.activityService = activityService;
    this.entryService = entryService;
    this.ea = eventAggregator;
    this.moodService.getMoods()
      .then((moods)=>{
        this.moods = moods;
      });
    this.activities = this.activityService.getActivities();
  }
  getEntries = () => {
    this.entryService.getEntries()
      .then(entries => this.entries = entries);
  }

  attached() {
    this.subscriber = this.ea.subscribe('entriesUpdated', this.getEntries);
  }

  detached() {
    this.subscriber.dispose();
  }
  setCurrentMood(mood) {
    this.mood = mood;
  }
  setCurrentActivity(activity) {
    this.activity = activity;
  }
}