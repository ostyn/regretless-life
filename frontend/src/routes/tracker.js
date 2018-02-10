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
  subscribers = [];
  moods;
  activities;

  activity;
  mood;
  constructor(moodService, activityService, entryService, eventAggregator) {
    this.moodService = moodService;
    this.activityService = activityService;
    this.entryService = entryService;
    this.ea = eventAggregator;
    this.getMoods();
    this.getActivities();
    this.getEntries();
  }
  getEntries = () => {
    this.entryService.getEntries()
      .then(entries => this.entries = entries);
  }

  getMoods = () => {
    this.moods = this.moodService.getMoods();
  }

  getActivities = () => {
    this.activities = this.activityService.getActivities();
  }

  attached() {
    this.subscribers.push(this.ea.subscribe('entriesUpdated', this.getEntries));
    this.subscribers.push(this.ea.subscribe('moodsUpdated', this.getMoods));
    this.subscribers.push(this.ea.subscribe('activitiesUpdated', this.getActivities));
  }

  detached() {
    this.subscribers.forEach(sub => this.subscribers.pop().dispose());
  }
  setCurrentMood(mood) {
    this.mood = mood;
  }
  setCurrentActivity(activity) {
    this.activity = activity;
  }
}