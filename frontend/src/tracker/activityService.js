export class ActivityService {
    nextId = 1;
    activities = new Map();
    constructor(){
        let activity = {name: "this.name", emoji: "this.emoji", isArchived: false, _id: ""+this.nextId++};
        this.activities.set(activity._id, activity);
    }
    addActivity(activity) {
        activity._id = this.nextId++;
        this.activities.set(activity._id, activity);
    }

    updateActivity(activity) {
        this.activities.set(activity._id, activity);
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