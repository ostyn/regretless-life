import { inject } from "aurelia-framework";
import { ActivityDao } from "../dao/ActivityDao";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(ActivityDao, EventAggregator)
export class ActivityService {
    constructor(activityDao, eventAggregator) {
        this.activityDao = activityDao;
        this.ea = eventAggregator;
    }
    notifyListeners(){
        this.ea.publish('activitiesUpdated');
        this.ea.publish('entriesUpdated');
    }
    saveActivity(activity) {
        return this.activityDao.saveItem(activity)
            .then((id)=>{
                this.notifyListeners();
            });
    }

    updateActivity(activity) {
        //this.entries.set(entry._id, entry);
    }

    getActivities() {
        return this.activityDao.getItems()
            .then(activities => activities);
    }

    getActivity(id) {
        //return this.entries.get(id);
    }

    deleteActivity(id) {
        return this.activityDao.deleteItem(id)
            .then(resp=>{
                this.notifyListeners();
                return resp;
            });
    }
}