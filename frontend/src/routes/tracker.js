import { inject } from "aurelia-framework";
import { MoodService } from "tracker/moodService";
import { ActivityService } from "tracker/activityService";
import { EntryService } from "tracker/entryService";

@inject(MoodService, ActivityService, EntryService)
export class App {
  entries;
  entryService;
  activityService;
  moodService;

  moods;
  activities;

  activity;
  mood;
  constructor(moodService, activityService, entryService) {
    this.moodService = moodService;
    this.activityService = activityService;
    this.entryService = entryService;
    this.moods = this.moodService.getMoods();
    this.activities = this.activityService.getActivities();
    this.entries = this.entryService.getEntries();
  }
  setCurrentMood(mood) {
    this.mood = mood;
  }
  setCurrentActivity(activity) {
    this.activity = activity;
  }
}