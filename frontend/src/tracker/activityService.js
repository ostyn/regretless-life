export class ActivityService {
    nextId = 1;
    activities = new Map();
    constructor(){
        let activity = {name: "this.name", emoji: "this.emoji", isArchived: false, id: this.nextId++};
        this.activities.set(activity.id, activity);
    }
    addActivity(activity) {
        activity.id = this.nextId++;
        this.activities.set(activity.id, activity);
    }

    updateActivity(activity) {
        this.activities.set(activity.id, activity);
    }

    getActivities() {
        return this.activities;
    }

    getActivity(id) {
        return this.activities.get(id);
    }

    deleteActivity(activityId) {
        this.activities.delete(activityId);
    }
}