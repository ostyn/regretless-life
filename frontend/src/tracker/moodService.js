import { inject } from "aurelia-framework";
import { MoodDao } from "../dao/MoodDao";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(MoodDao, EventAggregator)
export class MoodService {
    moods = [];

    constructor(moodDao) {
        this.moodDao = moodDao;
    }
    saveMood(mood) {
        return this.moodDao.saveItem(mood)
            .then((id)=>{
                this.notifyListeners();
            });
    }

    updateMood(mood) {
        //this.entries.set(entry._id, entry);
    }

    getMoods() {
        return this.moodDao.getItems()
            .then(moods => moods);
    }

    getMood(id) {
        //return this.entries.get(id);
    }

    deleteMood(id) {
        return this.moodDao.deleteItem(id)
            .then(resp=>{
                this.notifyListeners();
                return resp;
            });
    }
}